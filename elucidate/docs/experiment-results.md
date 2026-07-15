# elucidate — experiment results

Two workflow runs over a 5-problem family of **hidden-constraint decision problems** (car-wash,
charger, couch, plant, mail-neighbor — each hides a prerequisite or rests on a false premise). Every
candidate answer graded by an independent `sonnet` grader against the problem's known hidden
constraint + correct answer. Metrics: `surfaced` (named the hidden constraint?), `correct` (right
action / rejected false frame?), `solved` = both, `quality` 0–100.

Distillation modes: **none** (raw material → reasoner) · **A** = freeform principles · **B** = typed
slots (FACTS/CONSTRAINTS/PRIORITIES/VECTORS/OPEN-QUESTIONS). Reasoning modes: **single** vs
**debate** (pro/con + judge). Distiller + grader = `sonnet` throughout.

The two runs differ in **the reasoner under test**, which turned out to be the key variable:

- **Run 1** — reasoner = `haiku`, solve prompt *carries the forcing function* ("if the question is a false choice or omits a prerequisite, say so"). This makes the baseline artificially strong.
- **Run 2** — reasoner = `sonnet`, solve prompt is **naive** ("choose the better of the options"). This exposes real baseline failure and isolates distillation's value.

---

## Run 1 — strong reasoner (forcing-function solver, haiku)

| cell | n | surfaced | correct | **solved** | quality |
|---|---:|---:|---:|---:|---:|
| polluted / none / single | 10 | 1.00 | 1.00 | **1.00** | 94.8 |
| clean / B / single | 10 | 1.00 | 1.00 | **1.00** | 94.2 |
| polluted / B / single | 10 | 1.00 | 1.00 | **1.00** | 92.9 |
| polluted / B / debate | 9 | 1.00 | 1.00 | **1.00** | 92.0 |
| clean / none / single | 10 | 0.90 | 0.90 | **0.90** | 84.9 |
| clean / B / debate | 10 | 0.90 | 0.70 | **0.70** | 70.9 |
| clean / none / debate | 10 | 0.60 | 0.60 | **0.60** | 63.5 |
| polluted / A / single | 9 | 0.89 | 0.56 | **0.56** | 68.3 |

Read this run for the **negative** results (baseline was near-ceiling because the solve prompt already
does mental-model work):

- **Freeform distillation (A) actively hurt** — 0.89 surfaced but only **0.56 correct**, *below* the
  0.90–1.00 no-distill baseline. A lossy prose intermediate can override an already-capable reasoner:
  it re-states the situation and the reasoner commits to the framed options anyway.
- **Debate degraded hidden-constraint problems** — `clean/none/debate` fell to **0.60**. Advocates
  argue the two offered options (walk vs drive, morning vs afternoon), which *entrenches the false
  dichotomy*; the judge tends to accept the premise. Typed constraints partially rescue it
  (`polluted/B/debate` 1.00) but debate never beat single-agent.
- **Typed B held at the ceiling** (1.00 across all its single cells).
- Two `haiku` agents emitted junk ("test") outputs — a low-effort reliability artifact (it dinged
  `clean/none/single` and `clean/B/debate`), not a method effect. This motivated moving to `sonnet` in run 2.

---

## Run 2 — naive reasoner (no forcing function, sonnet) — the clean test

| cell | n | surfaced | correct | **solved** | quality |
|---|---:|---:|---:|---:|---:|
| polluted / B / single | 10 | 1.00 | 0.90 | **0.90** | 86.8 |
| clean / B / single | 9 | 1.00 | 0.89 | **0.89** | 88.2 |
| polluted / A / single | 10 | 0.80 | 0.80 | **0.80** | 77.2 |
| clean / none / single | 10 | 0.60 | 0.60 | **0.60** | 65.2 |
| polluted / none / single | 10 | 0.60 | 0.60 | **0.60** | 59.6 |

With the forcing function removed, the baseline drops to **0.60** (a capable model, left to "pick the
better option," fails charger and couch outright — it dismisses outlet access, and it just picks a
time for the couch). Now the effect is unmistakable:

- **Typed distillation (B) rescues the naive reasoner: 0.60 → ~0.90** (+0.30 absolute), and it is
  **pollution-proof** — 0.90 polluted == 0.89 clean. The typed CONSTRAINTS slot forces surfacing to
  **1.00** regardless of the reasoner's disposition.
- **Freeform (A) helps but is weaker: 0.60 → 0.80**, and surfaces only 0.80. It rescued the charger
  but never reliably forced the couch feasibility constraint.
- **Pollution** degrades a naive reasoner's *quality* (65.2 → 59.6) and induced an outright
  **hallucination** (one charger answer fabricated references to the noise — farmers market,
  insurance). Typed distillation neutralizes both.

---

## Unified conclusions

1. **Typed-slot distillation (B) is dominant in both regimes.** It is the ceiling when the reasoner is
   already strong (run 1: 1.00, never dropped a genuine case) *and* the biggest rescue when the
   reasoner is naive or the context is polluted (run 2: +0.30, pollution-proof). **It never hurt.**
   → Directional but consistent answer to the A-vs-B question (small n, single answer-key grader): **B wins.**

2. **Freeform principles (A) are regime-dependent and risky.** They help a naive reasoner modestly but
   *hurt* a capable one (run 1: 0.56). Prose lets the key constraint stay soft and lets the reasoner
   fall back on the framed options. **Don't distill to freeform when correctness matters.**

3. **The forcing function is the mechanism, and the typed CONSTRAINTS slot is its most reliable
   carrier.** The same explicit demand — "what MUST be true / is this a false choice?" — moves 0.60 →
   0.90 whether it lives in the solver instruction (run 1 baseline) or in a typed slot (B). B is best
   because it *guarantees* the prerequisite gets written down (surfaced = 1.00) independent of whether
   the reasoner would have thought to ask.

4. **Debate degrades hidden-constraint problems.** It entrenches the offered framing. Use single-agent;
   reserve debate for genuine two-sided *value* tradeoffs, and even then feed it the typed CONSTRAINTS.

5. **Hardest residual case: `couch`.** Even with constraints surfaced (1.00), a naive reasoner
   sometimes still answers "which time" — surfacing a constraint does not guarantee heeding it. This is
   where an explicit reasoner instruction to *act on* the constraints still adds value on top of B.

**→ Production configuration (shipped in `SKILL.md`): typed-slot distillation → single fresh reasoner
carrying the forcing-function instruction.** Both halves of the project — the distill/reinject loop
and the mental-model elicitation — collapse into this: the typed CONSTRAINTS slot *is* the elicitation,
and the fresh single reasoner *is* the clean reinjection.

---

## Run 3 — Field validation: live head-to-head on real work

Not a synthetic problem. The operating seat of a running market-making campaign ran the **same
generative task** — "propose new MM mechanisms for a fast binary-options book" — two ways:

- **Straight** — generate directly over the polluted research corpus (a strategy-generation
  research doc, private).
- **Elucidated** — first distill the corpus into a **typed briefing** (25 hard constraints), then
  generate from it (both artifacts in the private field-data repo).

**Verdict (the operator's, verbatim in spirit): the typed-distill run was net better on this task
— not by generating more exotic ideas, but by (a) refusing to propose what the constraints
forbid, and (b) catching two false premises in its *own* briefing that the straight pass never
surfaced.**

| | Straight pass | Elucidated pass |
|---|---|---|
| Top-3 aim | drifted toward PnL **sign**-edges | all 3 attack **capture/presence** — the ranked #1 priority |
| #1 idea | post-close stale-ask clip — *graveyard-adjacent* (single-participant, faded venue) | phase-joined presence profile — points straight at the measured multi-x capture gap, nearly free |
| Discipline | proposed some ideas the engine's constraints forbid | **killed 7 candidate classes** on named constraints (multi-window concurrency vs single-active-epoch engine; "reduce maker fee" vs taker-only; "race the pool" vs denominator-free rebate; etc.) |
| Self-audit | none | **caught 2 false premises in the briefing itself** |

The two false-premise catches — the real prize:

1. **Literal-sign vs structural-positivity.** The briefing's bar ("the benchmark trader achieves
   neither trading>0 nor rebate>0") contradicted its own FACTS (he posts both positive). Left
   uncaught, a mediocre config posting a hair above zero would claim false victory. The bar must
   be *structurally* positive, not literal-sign.
2. **An ungrounded judging gate.** "Passing worst-latency" was being read against a placeholder
   ceiling the briefing elsewhere admits is ungrounded — so configs "passing" pass a hypothesis,
   not a measured ceiling.

The seat carried both catches into its go-package judging language, and folded the cheap
elucidated ideas into its next in-sample batch.

**Where it did NOT help:** no wildly novel mechanism the straight pass couldn't reach; overlap on the
phase/reload idea family. **Cost:** one extra distill stage (~9 min, sonnet).

**Why this matters for the skill:** it independently reproduces the synthetic finding on real,
high-stakes work — *typed distillation earns its keep by surfacing hidden constraints and false
premises, not by out-creating.* It also demonstrated two capabilities the synthetic eval never
tested, now promoted to first-class outputs in `SKILL.md`:

- **Constraint-kill** — enumerate along VECTORS, then *reject* candidates against CONSTRAINTS and
  report each kill with the constraint that killed it. Constraints firing is the mechanism working.
- **Briefing self-audit** — before answering, check FACTS against CONSTRAINTS for internal
  contradictions and flag false premises / ungrounded placeholders in the briefing itself.

---

## Run 4 — dataset expansion: frame-import graded, pattern-import sentinels (naive haiku)

Nine problems, none from the original 5-problem family: `mint-match-frame` (frame-import, added
after runs 1–2 but never graded until now) plus 8 documented public reasoning problems added
2026-07-15 — 4 tagged `hidden-constraint` (stock-flow accumulation, Simpson's paradox, base-rate
neglect, conjunction fallacy) and 4 tagged `pattern-import` (a famous-puzzle template that differs
from the actual question in a stated fact: AIW sibling count, dead cat in the box, kg-vs-lb,
trivial river crossing). Sources cited per-problem in `eval/problems.json`. Conditions: clean
input, single reasoner, **naive** solve prompt (no forcing function, run-2 style), solver = haiku,
2 trials/problem.

| cell | n | surfaced | correct | **solved** | quality |
|---|---:|---:|---:|---:|---:|
| clean / B / single | 18 | 1.00 | 1.00 | **1.00** | 95.1 |
| clean / none / single | 18 | 0.89 | 0.89 | **0.89** | 85.7 |

The whole gap is one problem — and it's the right one:

- **`mint-match-frame` is the run's RED→GREEN.** The naive baseline failed **0/2**, both times
  booking the mint channel as "benign maker liquidity — no directional exposure created" (quality
  8/100): the exact frame-import error the field case documents. Typed distillation rescued **2/2**,
  with the grader confirming the answers explicitly named the venue-frame-vs-our-frame trap. This is
  the first graded evidence for the frame-import class, and it reproduces the run-2 shape (baseline
  fails → CONSTRAINTS slot rescues) on a problem derived from real production damage.
- **The 8 public problems produced no RED at this solver tier.** Even the naive haiku baseline
  solved all 16 trials — including the 4 pattern-import puzzles it was "supposed" to template-match.
  (An earlier same-day run with the forcing-function prompt, run-1 style, was also at ceiling.) The
  published failures behind these problems (Nezhurina et al. 2024; MisguidedAttention) were recorded
  on earlier-generation models; current small models read the literal words unaided. **Negative
  result, recorded per repo policy:** the pattern-import problems currently license no claim that
  typed distillation *rescues* anything — they stay in the dataset as regression sentinels (they
  would catch a solver tier that template-matches) and as documented-in-literature class examples,
  not as evidence of skill effect. The pattern-import prose in `SKILL.md` is class-naming motivated
  by the public literature, not a red-then-green-validated rule.

---

## Run 5 — field-derived problems: the first non-ceiling set (naive haiku)

Seven problems converted from the private field-case inbox (genericized for the public dataset),
same conditions as run 4's clean arm: naive solve prompt, single reasoner, haiku, 2 trials/problem.
n=13/cell (2 dropped jobs, StructuredOutput retry cap).

| cell | n | surfaced | correct | **solved** | quality |
|---|---:|---:|---:|---:|---:|
| clean / none / single | 13 | 0.46 | 0.62 | **0.46** | 53.8 |
| clean / B / single | 13 | 0.46 | 0.46 | **0.46** | 50.5 |

The first set where the eval isn't at ceiling — and it splits cleanly:

- **Solved by both cells (3):** size-column-units, oneshot-cgroup-precondition,
  armed-claim-substrate. Their hidden constraints are *derivable by reasoning* from the prompt
  (a units cross-check, a cgroup lifetime argument, "agent reports are not infrastructure").
- **Failed by both cells (4):** px-units-misread, patience-signflip-phase-mix,
  sim-level-vs-ranking, vacuous-axis-generalization. Their constraints are **domain-tacit** — the
  mills convention, the phase-scoped mechanism value, tape-replay fill composition, rule×rule
  interaction — and are not present in the bare prompt for ANY distiller to surface. Solvers got
  partway (px: right verdict, invented a wrong unit convention to reach it) but never named the
  real constraint.
- **Typed distillation did not rescue these, and slightly hurt `correct`** (0.46 vs 0.62, small
  n): with no constraint in the material to force into text, the briefing added process and
  hedging — the px B-cells punted to "pull the schema first" instead of committing to the
  reconciliation the prompt licenses. This bounds the run-1/2 "never hurt" finding: it held where
  the tacit line was *in the material*; on constraint-from-nowhere problems distillation is
  overhead.

**What this actually measures:** in the field, every one of these cases was rescued by a corpus or
an operator sentence that CONTAINED the missing constraint ("have we considered the beginning of
the window differs from the middle?"); the eval harness currently feeds only the bare prompt, so
run 5 tested "derive the constraint from nothing" — a different, harder task than elucidate's
remit (force tacit-in-corpus constraints into text). **Future work:** feed each field case's
`raw_material` (the inbox schema already carries it) so these problems test the pipeline as the
failures actually occurred — constraint present-but-buried, not absent. Until then, the 4
domain-tacit problems stand as honest hard negatives, not as evidence against the pipeline.

---

## Run 6 — tier matrix + contamination controls (naive prompt, three solver tiers)

Motivated by an outside reviewer's hypothesis: *"current models pass the famous problems because
the corrected answers are in training; similar-but-novel problems won't pass."* Five novel
isomorphs were authored as contamination controls (`*-iso` classes in `eval/problems.json`): same
deep structure as a famous case, fresh surface story absent from public puzzle corpora. Three
runs, all naive solve prompt, clean/single, 2 trials/problem: **haiku** and **sonnet** on
famous-4 + isomorph-5; **opus** on the original car-wash family + the flat-tire isomorph; then
haiku and sonnet on the family to complete the matrix. Results: `results-run6a-haiku.json`,
`results-run6b-sonnet.json`, `results-run6c-opus.json`, `results-run6d-haiku-family.json`,
`results-run6e-sonnet-family.json`.

Solved (surfaced + correct), bare → typed distill:

| problem set | haiku | sonnet | opus |
|---|---|---|---|
| famous template puzzles (4) | 8/8 → 8/8 | 8/8 → 8/8 | — |
| novel template isomorphs (4) | 8/8 → 8/8 | 7/8 → 8/8 | — |
| flat-tire (prerequisite isomorph) | 1/2 → 2/2 | **0/2 → 2/2** | 2/2 → 2/2 |
| car-wash family (5, hidden-prerequisite) | **6/10 → 10/10** | **6/10 → 10/10** | **6/10 → 9/10** |

The family result is flat across scale to a degree we did not expect: **every tier scores exactly
0.60 bare, failing the same two problems the same way** — charger 0/2 (haiku even answered "Use
the fast charger."; sonnet and opus both "Use the slow charger.") and couch 0/2 ("Morning.") —
while car-wash, plant, and mail-neighbor (the three whose corrected forms circulate most widely)
pass 2/2 everywhere. Distillation takes all three tiers to 1.00 (opus 0.90: one couch rep
surfaced the constraint but still led with "Morning").

Findings:

1. **The contamination hypothesis fails for the template class but survives, sharpened, for the
   decision class.** Novel template isomorphs pass bare at every tier tested — template-matching
   per se is a solved failure mode for current models, famous or not. But the *decision*-shaped
   problems flip it: sonnet rode a bike with two flat tires **2/2** ("10-minute ride vs 30-minute
   walk — ride"), and opus passed the exact, now-famous car-wash prompt 2/2 while failing its
   less-famous siblings **charger 0/2** ("Use the slow charger.") and **couch 0/2** ("Morning.").
   The famous instances look patched by training; the class is not.
2. **Scale does not fix frame obedience.** Opus's bare solve rate on the family (0.67) is no
   better than sonnet's run-2 baseline (0.60), and its failures were maximally confident
   one-liners. A stronger instruction-follower is, if anything, more obedient to a false frame
   when the prompt says "answer directly."
3. **Typed distillation: 47/48 across all three tiers vs 40/48 bare.** The one distill miss was
   an opus couch rep that surfaced the fit/logistics constraint but still led with "Morning."
4. Where the value is NOT (recorded per repo policy, extending run 4's negative result): famous
   trick puzzles and their novel template variants — every tier passes bare. The skill's measured
   value at current tiers concentrates in hidden-prerequisite framed decisions (every tier),
   frame-import over real data (run 4: 0/2 → 2/2), and polluted/muddled corpora (run 2).

---

## Run 6f — opus on the pattern sets + the frame-import ceiling

Opus, naive prompt, famous-4 + template-isomorph-4 + mint-match (`results-run6f-opus-patterns.json`).
Templates: 15/16 bare → 16/16 distilled (one bare slip: answered "3" to the self-count isomorph
while its own reasoning derived 4). **Mint-match: 0/2 bare → 0/2 distilled** — the first problem
where typed distillation fails to rescue a stronger model that it rescued at a weaker tier (haiku
0/2 → 2/2, run 4). Opus reasoned *around* the briefing ("split into two books... neutral"),
re-deriving a sophisticated version of the venue's frame. Sophistication can argue past a surfaced
constraint; recorded as a negative result bounding the rescue claim by tier.

## Run 7 — cross-provider sweep (Bailian models, independent grader)

Four non-Claude models (glm-5, qwen3.7-plus, kimi-k2.5, MiniMax-M2.5), 15 problems (family-5,
famous-4, isomorph-5, mint-match), 2 trials, bare vs typed distill, graded by an independent
third-provider model. Raw records: `results-run7-bailian.json` (240 records, 0 grade-parse
failures). Solved, bare → distill (family/10, famous/8, iso/10, mint/2):

| model | family | famous | iso | mint | total /30 |
|---|---|---|---|---|---|
| qwen3.7-plus | 5→6 | 5→7 | 10→8 | 0→0 | 20→21 |
| kimi-k2.5 | 2→7 | 7→5 | 8→10 | 0→0 | 17→22 |
| glm-5 | 1→8 | 6→5 | 7→10 | 0→0 | **14→23** |
| MiniMax-M2.5 | 1→4 | 6→6 | 8→8 | 0→0 | 15→18 |
| deepseek-v4-pro | 1→6 | 6→7 | 6→10 | 0→0 | **13→23** |

deepseek-v4-pro added same-day (`results-run7-deepseek.json`; solver via its own API, thinking
off; graded by claude sonnet — the cross-provider never-self-grade principle in the other
direction). Largest lift of any model tested (+10). Its distill arm reached the correct
mint-match ACTION on both trials ("bad flow") without ever naming the frame constraint — graded
unsolved under the strict rubric, but the first non-Claude model to land the right side of the
decision.

Findings:

1. **Frame-import is the universal discriminator.** mint-match: 0/16 across all four models in
   BOTH arms. Combined with run 4 (haiku 0/2→2/2) and run 6f (opus 0/2→0/2), no model of any
   provider solves it bare, and the distill rescue has only been observed at one tier.
2. **The rescue shape replicates cross-provider — where the bare model is weak.** glm-5 goes
   0.10→0.80 on the family (steeper than Claude's 0.60→1.00); kimi 0.20→0.70. One bare
   exception: qwen3.7-plus solved charger 2/2 bare — the only model of the seven tested (three
   Claude tiers + four Bailian) to crack it without the skill.
3. **Distillation taxes strong-bare cases** — qwen iso 10→8 and charger 2→0, kimi famous 7→5.
   Same lesson as run 6f from the other direction: distill is a rescue for weak-bare, noise for
   strong-bare on trivial-twist puzzles. This bounds the run-1/2 "never hurt" finding to the
   regimes originally tested.
4. Caveats: n=2 trials per cell (±1 is noise); 3–17% bare refusal rates; grader is a single
   third-provider model.

---

## Run 8 + the unified matrix

Run 8 filled the last gap (sonnet on mint-match: bare 0/2; distilled 1/2 — one rep genuinely
surfaced the frame-import and classified bad flow; `results-run8-sonnet-mint.json`). With that,
every model has complete cells on the same 15 problems / same protocol, and the single
authoritative cross-model table is generated — not hand-assembled — by
`eval/tally_master.py` from the raw results files. The README's matrix is that script's output
verbatim. Any future run that changes a cell should re-run the script rather than edit numbers
by hand; the script hard-fails a row with a ⚠ flag if any cell has missing trials, so
inconsistent denominators can't silently reappear.

---

## Runs 9-10 — the FRAME AUDIT proposal: harness drift fixed, slot REJECTED (negative result)

A design proposal (2026-07-15) recommended adding a mandatory FRAME AUDIT typed slot to rescue
the frame-import class. Its grounding work found a real bug first: **`eval/prompts.json`'s
`distill_typed` never received the frame clause `SKILL.md`'s Step-1 prompt shipped on
2026-07-11** — the harness reads prompts.json, so every frame-import number in runs 4–8 measured
the pre-clause prompt. The drift is now closed (prompts synced; the old wording remains in each
run's args for reproducibility).

**Run 9 (step 0)** — the shipped clause alone, haiku, distill arm: px-units 0/4 (bar 0/4,
unmoved — mills now appears among its hypotheses but the reconciliation is never run);
size-column 2/4 and mint 1/3 surfaced (floors wobbled — the hedging tax is real).
`results-run9-step0-clause.json`.

**Run 10 (steps 1-2)** — FRAME AUDIT implemented as separate distill mode `F`
(`distill_typed_frame_audit` + `solve_single_frame_audit` in prompts.json, two-line branch in
workflow.js), tested against the proposal's own gates. haiku
(`results-run10-frame-audit-haiku.json`): **px-units 0/3 — no rescue** (the slot's "flag as
unresolved is a valid answer" escape hatch swallowed its own DERIVE instruction; every rep
punted to external schema docs the fixture says don't exist); **mint-match 0/4 solved AND 0/4
correct — the regression floor broke**: the slot derailed haiku off the run-4 rescue entirely
(wash-trade/self-cross misdiagnosis and unresolved-punts replaced the correct bad-flow verdict).
size-column held 3/3. opus mint with the slot (`results-run10-frame-audit-opus.json`): 1/2
solved, 2/2 right action — a modest stretch-target gain (bar was 0/2), earned via a partly
off-target wash-trade rationale; it does not offset breaking the must-hold haiku floor.

**Disposition: FRAME AUDIT is rejected — do not add the slot to SKILL.md.** Third time this
repo's red-then-green bar has killed an intuitively-appealing addition (see warrant's two
rejected checklists); the F mode stays in the harness for future iterations. Standing
conclusion, sharpened: the frame-import residue (px-units; mint at opus and cross-provider) is
not prompt-shaped. What the failures share is a missing piece of *evidence or expertise* — the
mills convention, the adverse-selection mechanism — that no slot can conjure from a bare prompt.
The live fix path remains feeding `raw_material` (the corpus that contains the tacit fact)
through the distiller, per run 5's future-work note.

---

## Honest caveats

- **Small n** (2 trials/cell, 5 problems). Directional, not publication-grade; the effects are large
  enough (0.60 → 0.90; A at 0.56) to be trustworthy as design guidance, not as precise magnitudes.
- **Single grader** (one `sonnet` call per answer). No inter-rater check; grader given the answer key,
  so grading is reliable but not adversarial.
- **One problem family** in runs 1–2. Hidden-constraint / false-premise decisions. Run 4 (2026-07-15)
  added frame-import and 8 documented public problems, but only the frame-import case produced a
  baseline failure to rescue. The *ideation* path (enumerate along VECTORS) is designed but not yet
  benchmarked — stated as a caveat in the README.
- **Pollution was mild.** One shared noise paragraph. A naive reasoner still degraded (quality +
  hallucination); a stronger stress test (long, topically-adjacent research dumps) would test the
  distill-and-reinject loop's headline use case more forcefully. Future work.
- **3 dropped jobs** total across both runs (StructuredOutput retry cap) — reflected in n<10 cells.
