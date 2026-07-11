export const meta = {
  name: 'elucidate-eval',
  description: 'Empirically test distill-and-reinject (none/freeform/typed) and single vs debate+judge on hidden-constraint decision problems',
  phases: [
    { title: 'Distill' },
    { title: 'Solve+Grade' },
  ],
}

// args: { problems:[{id,prompt,hidden_constraint,correct_answer}], noise, prompts:{...}, cells:[{inputMode,distillMode,analysisMode}], trials }
const A = typeof args === 'string' ? JSON.parse(args) : args
const { problems, noise, prompts, cells, trials } = A
const H = A.solverModel || 'haiku'   // model under test (solver/debaters/judge)
const S = A.smartModel || 'sonnet'   // distiller + grader

const DISTILL_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { distilled: { type: 'string', description: 'Briefing text to inject into a fresh reasoner.' } },
  required: ['distilled'],
}
const SOLVE_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { recommendation: { type: 'string' }, reasoning: { type: 'string' } },
  required: ['recommendation', 'reasoning'],
}
const ARG_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { argument: { type: 'string' } }, required: ['argument'],
}
const GRADE_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    surfaced_constraint: { type: 'boolean' },
    correct_recommendation: { type: 'boolean' },
    quality: { type: 'number' },
    notes: { type: 'string' },
  },
  required: ['surfaced_constraint', 'correct_recommendation', 'quality', 'notes'],
}

const materialFor = (p, inputMode) =>
  inputMode === 'polluted' ? (noise + '\n\n' + p.prompt) : p.prompt

// ---- Phase 1: distill artifacts (only for cells that need A/B) ----
phase('Distill')
const distillKeys = new Set()
for (const p of problems) for (const c of cells) {
  if (c.distillMode === 'A' || c.distillMode === 'B')
    distillKeys.add(`${p.id}|${c.inputMode}|${c.distillMode}`)
}
const distillList = [...distillKeys].map(k => {
  const [id, inputMode, dMode] = k.split('|')
  return { k, p: problems.find(x => x.id === id), inputMode, dMode }
})
const distillResults = await parallel(distillList.map(d => () => {
  const promptText = d.dMode === 'A' ? prompts.distill_freeform : prompts.distill_typed
  return agent(`${promptText}\n\n=== RAW MATERIAL ===\n${materialFor(d.p, d.inputMode)}`, {
    label: `distill:${d.p.id}:${d.inputMode}:${d.dMode}`,
    phase: 'Distill', model: S, effort: 'medium', schema: DISTILL_SCHEMA,
  }).then(r => ({ k: d.k, distilled: r ? r.distilled : materialFor(d.p, d.inputMode) }))
}))
const distillMap = {}
for (const r of distillResults) if (r) distillMap[r.k] = r.distilled

// ---- Phase 2: solve + grade over all jobs ----
phase('Solve+Grade')
const jobs = []
for (const p of problems) for (const c of cells) for (let t = 0; t < trials; t++) jobs.push({ p, c, t })

async function solve(job) {
  const { p, c } = job
  let base
  if (c.distillMode === 'none') {
    base = `=== MATERIAL ===\n${materialFor(p, c.inputMode)}`
  } else {
    const brief = distillMap[`${p.id}|${c.inputMode}|${c.distillMode}`] || materialFor(p, c.inputMode)
    base = `=== BRIEFING ===\n${brief}\n\n=== QUESTION ===\n${p.prompt}`
  }
  if (c.analysisMode === 'single') {
    const r = await agent(`${prompts.solve_single}\n\n${base}`, {
      label: `solve:${p.id}:${c.inputMode}:${c.distillMode}`,
      phase: 'Solve+Grade', model: H, effort: 'low', schema: SOLVE_SCHEMA,
    })
    return r || { recommendation: '(none)', reasoning: '' }
  }
  const [pro, con] = await parallel([
    () => agent(`${prompts.debate_pro}\n\n${base}`, { label: `pro:${p.id}:${c.inputMode}:${c.distillMode}`, phase: 'Solve+Grade', model: H, effort: 'low', schema: ARG_SCHEMA }),
    () => agent(`${prompts.debate_con}\n\n${base}`, { label: `con:${p.id}:${c.inputMode}:${c.distillMode}`, phase: 'Solve+Grade', model: H, effort: 'low', schema: ARG_SCHEMA }),
  ])
  const judgeInput = `${base}\n\n=== ADVOCATE A ===\n${pro ? pro.argument : ''}\n\n=== ADVOCATE B ===\n${con ? con.argument : ''}`
  const r = await agent(`${prompts.judge}\n\n${judgeInput}`, {
    label: `judge:${p.id}:${c.inputMode}:${c.distillMode}`, phase: 'Solve+Grade', model: H, effort: 'low', schema: SOLVE_SCHEMA,
  })
  return r || { recommendation: '(none)', reasoning: '' }
}

async function grade(sol, job) {
  const { p } = job
  const gi = `=== PROBLEM ===\n${p.prompt}\n\n=== HIDDEN CONSTRAINT ===\n${p.hidden_constraint}\n\n=== CORRECT ANSWER ===\n${p.correct_answer}\n\n=== CANDIDATE ANSWER ===\nRecommendation: ${sol.recommendation}\nReasoning: ${sol.reasoning}`
  const r = await agent(`${prompts.grade}\n\n${gi}`, {
    label: `grade:${p.id}:${job.c.inputMode}:${job.c.distillMode}:${job.c.analysisMode}`,
    phase: 'Solve+Grade', model: S, effort: 'medium', schema: GRADE_SCHEMA,
  })
  return r || { surfaced_constraint: false, correct_recommendation: false, quality: 0, notes: 'grade failed' }
}

const records = await pipeline(
  jobs,
  (job) => solve(job).then(sol => ({ job, sol })),
  ({ job, sol }) => grade(sol, job).then(g => ({
    problemId: job.p.id,
    inputMode: job.c.inputMode,
    distillMode: job.c.distillMode,
    analysisMode: job.c.analysisMode,
    trial: job.t,
    recommendation: sol.recommendation,
    surfaced_constraint: !!g.surfaced_constraint,
    correct_recommendation: !!g.correct_recommendation,
    quality: g.quality,
    notes: g.notes,
  }))
)

// ---- aggregate ----
const clean = records.filter(Boolean)
const byCell = {}
for (const r of clean) {
  const k = `${r.inputMode}|${r.distillMode}|${r.analysisMode}`
  const b = byCell[k] || (byCell[k] = { inputMode: r.inputMode, distillMode: r.distillMode, analysisMode: r.analysisMode, n: 0, surfaced: 0, correct: 0, solved: 0, quality: 0 })
  b.n++
  b.surfaced += r.surfaced_constraint ? 1 : 0
  b.correct += r.correct_recommendation ? 1 : 0
  b.solved += (r.surfaced_constraint && r.correct_recommendation) ? 1 : 0
  b.quality += r.quality
}
const cellSummary = Object.values(byCell).map(b => ({
  cell: `${b.inputMode}/${b.distillMode}/${b.analysisMode}`,
  n: b.n,
  surfaced_rate: +(b.surfaced / b.n).toFixed(2),
  correct_rate: +(b.correct / b.n).toFixed(2),
  solved_rate: +(b.solved / b.n).toFixed(2),
  mean_quality: +(b.quality / b.n).toFixed(1),
})).sort((a, b) => b.solved_rate - a.solved_rate || b.mean_quality - a.mean_quality)

log(`cells=${cellSummary.length} records=${clean.length}`)
return { cellSummary, records: clean }
