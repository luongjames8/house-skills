# house-skills

Skills that fix *input* failures in AI reasoning — the cases where the model reasons fine but the
question, frame, or context it was handed guarantees a bad answer. Named for House MD: everybody
lies (especially your own working notes), the differential goes on the whiteboard, and you run the
tests before you treat.

| Skill | Fires when | Mechanism |
|---|---|---|
| [elucidate](elucidate/SKILL.md) | Before ideation / analysis over material you HAVE | Typed distillation (FACTS/CONSTRAINTS/…) → same question, reinjected into a clean context. Catches hidden prerequisites and frame-imports. |
| [differential](differential/SKILL.md) | At an impasse / unexplained failure — mechanism NOT in your material | Question swap + context subtraction: domain-neutral symptoms → cold exhaustive mechanism taxonomy → discriminating measurements → chart. Catches verdict-frame suppression of textbook knowledge. |
| [warrant](warrant/SKILL.md) | Before an interpretive deliverable ships — claims resting on data reads, or a draft naming a check it didn't run | Verification as a dispatch, not a discipline: claims verbatim + raw-data pointers → fresh verifier recomputes → LICENSED/REFUTED/UNVERIFIABLE verdicts → exit rule (no named-unrun checks). Catches assertion outrunning evidence you already own. |
| [tabletop](tabletop/SKILL.md) | Before a cross-system design ships — vendor APIs, webhooks, queues; fires hardest when the counterparty's contract is NOT in hand | Contract table with cited cells → UNKNOWN in a deadline/token/retry column is a BLOCKER (block the handoff, or design safe-under-all-values + MUST-VERIFY-BEFORE-SHIP gates) → timeline budgets, state×event grid, invariant ledger. Catches designing against an unheld contract. |

The dividing line: elucidate assumes the answer is present but badly framed; differential assumes
the answer was never asked for; warrant assumes the author's context is disqualified from checking
its own claims. Elucidate distills context, differential subtracts it, warrant routes around it.
Lifecycle: generation → elucidate · design → tabletop · impasse → differential · shipping → warrant.

## The law behind all four

A model acts reliably only on what is **explicit, salient, and operable in context at the moment
of action**. Everything tacit — knowledge in weights, inferences made earlier in the session,
constraints in the operator's head, structure implicit in data, contracts in unread docs —
influences behavior only probabilistically, and the probability decays with context length.

Every skill here is one move applied to a different tacit object: **find what's tacit, print it
where the next computation looks, and hand it to a reader with no momentum.** Corollary for new
failure classes: ask (1) what was tacit? (2) at what boundary should it have been printed? If a
boundary exists (shipping, design, impasse), it can be a skill or gate. If none exists (ambient
failures — dimension collapse, incompleteness), it cannot be a skill — it must become structure:
a schema column, a required template field, a routed fresh verifier, a runtime assertion.
(Evidence: every controlled fixture that pre-printed the tacit thing for a fresh reader failed to
reproduce the live failure — the recipe, pre-applied, is the cure working.)

**Corollary — deliverables are records, and brevity never negotiates the census.** Every skill's
deliverable is a set of records under a declared schema (chart, verdict table, contract table,
kill accounting) with a census constraint: rows must cover the whole population (every mechanism,
every claim, every interface, every candidate), counts matching. Datasets don't require numbers —
schema + census + evidenced cells work for claims, behaviors, and hypotheses exactly as for fills
(qualitative coding, ACH matrices, differential charts). Format pressure ("top 3 bullets", "no
wall of tables") compresses narration only: summary on top, records underneath. Measured
(2026-07-11, 2/2): a brevity request made agents silently drop the entire record set while keeping
a correct-sounding prose conclusion — a dropped row is a hidden verdict.

**Corollary — names are unheld contracts.** Every symbol that crosses a trust boundary (a field
name, an API label, a function name, a metric, a status flag) is a claim someone else made, in
their frame, printed to look pre-validated. Its semantics are tacit until validated against
BEHAVIOR on a different data layer, once, and FILED where the next reader looks (trap table,
field dictionary, tested contract). First-use of a name is ambient — no boundary, so this cannot
be a skill or a vigilance rule. Two structures cover it: catch-side, re-derivation against an
independent layer exposes a lying name without knowing which name lies (warrant / the PROVE-IT
gate, measured twice in the field); filing-side, an inline validation that isn't filed is a
validation the org pays for again.

Each skill carries its own evidence (`elucidate/docs/experiment-results.md`, the probe and
verifier-demo results in `differential/SKILL.md` and `warrant/SKILL.md`). Raw field cases from the
originating production campaign live in a private field-data repo; the published evidence keeps
the measured results with identifying specifics genericized.

## Setup (Claude Code)

Skills load from `~/.claude/skills/` at session start (user-scope: every project, every new
session). Clone anywhere and symlink each skill directory:

```bash
git clone https://github.com/luongjames8/house-skills ~/code/house-skills
mkdir -p ~/.claude/skills
for d in ~/code/house-skills/*/; do
  [ -f "$d/SKILL.md" ] && ln -sfn "$d" ~/.claude/skills/"$(basename "$d")"
done
```

Re-run the loop after pulling a version that adds a new skill. Already-running sessions won't see
changes — skill lists load at session start.
