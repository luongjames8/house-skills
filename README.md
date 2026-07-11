# house-skills

Four [Claude Code skills](https://code.claude.com/docs/en/skills) that fix **input failures** in
AI reasoning — the cases where the model reasons fine but the question, frame, or context it was
handed guarantees a bad answer. Named for House MD: everybody lies (especially your own working
notes), the differential goes on the whiteboard, and you run the tests before you treat.

**You don't call these — they fire themselves.** Each skill's trigger description is loaded into
every session, and the agent invokes the skill when the moment matches: about to brainstorm →
elucidate fires; investigation stuck at "nothing works" → differential fires; about to ship a
conclusion built on data → warrant fires; designing against someone else's API → tabletop fires.
The trigger conditions are the product as much as the pipelines are — each one is written from a
measured failure moment, not from a category name. Explicit invocation (`/differential`, …) works
too, but it's the fallback, not the design.

They were built inside a live algorithmic-trading campaign run by a fleet of AI agents: each
skill exists because a specific, expensive failure happened, was reproduced under controlled
conditions, and was fixed with the change that made the reproduction pass. Every rule in these
files has a failing test behind it — and proposed rules that *couldn't* be made to fail are
recorded as negative results instead of shipped (`warrant/docs/`).

## The four skills

| Skill | Fires itself when | What you get |
|---|---|---|
| [**elucidate**](elucidate/SKILL.md) | You're about to ideate or analyze over material you already have | Typed distillation (FACTS / CONSTRAINTS / PRIORITIES / VECTORS / OPEN QUESTIONS) → the same question re-asked in a clean context. Catches hidden prerequisites and imported frames. |
| [**tabletop**](tabletop/SKILL.md) | A cross-system design is about to ship (vendor APIs, webhooks, queues) — hardest when the counterparty's contract is **not in hand** | A contract table with cited cells. An UNKNOWN in a deadline/token/retry column is a **blocker**: block the handoff, or design safe-under-all-values with must-verify-before-ship gates. Then timeline budgets, a state×event grid, an invariant ledger. |
| [**differential**](differential/SKILL.md) | An investigation hits an impasse — "nothing works", "all candidates killed", a chronic anomaly, or a diagnostic firing *opposite* to hypothesis | Domain-neutral symptoms → a cold agent enumerates the domain's failure taxonomy with a discriminator per mechanism → PROVE-IT gate (≥2 independent methods, different data layer) → a verdict chart covering every mechanism. |
| [**warrant**](warrant/SKILL.md) | An interpretive deliverable is about to ship — claims resting on data reads, or a draft naming a check it didn't run | Claims verbatim + raw-data pointers → a **fresh verifier** recomputes everything → LICENSED / REFUTED / UNVERIFIABLE verdicts → the corrected deliverable ships with a greppable `VERIFICATION:` receipt. |

The dividing line: elucidate assumes the answer is present but badly framed; differential assumes
the answer was never asked for; warrant assumes the author's context is disqualified from checking
its own claims. Elucidate distills context, differential subtracts it, warrant routes around it.
Lifecycle: **generation → elucidate · design → tabletop · impasse → differential · shipping → warrant.**

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
schema + census + evidenced cells work for claims, behaviors, and hypotheses exactly as for
numeric rows (qualitative coding, ACH matrices, differential charts). Format pressure ("top 3
bullets", "no wall of tables") compresses narration only: summary on top, records underneath.
Measured (2/2): a brevity request made agents silently drop the entire record set while keeping a
correct-sounding prose conclusion — a dropped row is a hidden verdict.

**Corollary — names are unheld contracts.** Every symbol that crosses a trust boundary (a field
name, an API label, a function name, a metric, a status flag) is a claim someone else made, in
their frame, printed to look pre-validated. Its semantics are tacit until validated against
BEHAVIOR on a different data layer, once, and FILED where the next reader looks (trap table,
field dictionary, tested contract). First-use of a name is ambient — no boundary, so this cannot
be a skill or a vigilance rule. Two structures cover it: catch-side, re-derivation against an
independent layer exposes a lying name without knowing which name lies (warrant / the PROVE-IT
gate, measured twice in the field); filing-side, an inline validation that isn't filed is a
validation the org pays for again.

## How these were built (and how to extend them)

Skill-writing here is test-driven: reproduce the failure with a baseline agent (RED), write the
minimal rule that makes the same scenario pass (GREEN), and record what *refused* to fail as a
negative result so it never gets re-proposed on vibes. Two patterns fell out of that discipline:

- **Catch-side beats author-side.** Rules that ask the working agent to notice something
  mid-session degrade with context length; routing the output through a *fresh* reader with a
  narrow charter (warrant's verifier, differential's cold pass) caught every failure class we
  could reproduce — including several we tried to write author-side checklists for first.
- **Structure beats prose.** Where no trigger boundary exists, the fix went into the shape of the
  deliverable (required tables, census counts, receipt stamps) rather than into more instructions.

Evidence lives beside each skill: `elucidate/docs/experiment-results.md` (a graded eval of the
distill-and-reinject pipeline), the measured baselines quoted inside each SKILL.md, and the
negative results in `warrant/docs/`. Raw field cases from the originating campaign live in a
private companion repo; published evidence keeps the measured result shapes with identifying
specifics genericized.

## Setup (Claude Code)

Skills load from `~/.claude/skills/` (user-scope: every project, every session). Clone anywhere
and symlink each skill directory:

```bash
git clone https://github.com/luongjames8/house-skills ~/code/house-skills
mkdir -p ~/.claude/skills
for d in ~/code/house-skills/*/; do
  [ -f "$d/SKILL.md" ] && ln -sfn "$d" ~/.claude/skills/"$(basename "$d")"
done
```

That's the whole install — from the next matching moment on, the skills fire on their own.
Re-run the loop after pulling a version that adds a new skill; recent Claude Code versions pick
up skill changes mid-session, older ones load the list at session start.
