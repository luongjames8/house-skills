# house-skills

Your agent doesn't lie to you on purpose — it ships the first coherent story it finds. It reads a
field named `maker` and reports "maker." It designs against an API it never read. It answers "top
3 findings please" by silently deleting the other seven. You catch these by asking *"wait — did
you actually check?"* — on the days you remember. These four skills make that question fire
automatically, at the right moments, with teeth.

**What changes after `git clone`:**

- Conclusions reach you **pre-verified or labeled UNVERIFIED** — a fresh agent recomputes every
  claim against the raw data before it ships, and the result carries a greppable receipt.
- "Nothing works" stops being an impasse — you get every candidate mechanism with a verdict and
  evidence, not a shrug.
- Designs against external APIs arrive with the **contract table filled or explicitly BLOCKED** —
  instead of discovered in production.
- Brainstorms start from stated constraints instead of hidden assumptions.

Cost: each firing is roughly one extra model call. Each skill says what it's *not* for.

| Skill | Fires itself when | What it does |
|---|---|---|
| [**elucidate**](elucidate/SKILL.md) | about to brainstorm or analyze | distills the problem into typed slots, re-asks in a clean context — surfaces hidden premises |
| [**tabletop**](tabletop/SKILL.md) | designing against someone else's API | contract table first — an unknown deadline/retry/token rule is a blocker, not a footnote |
| [**differential**](differential/SKILL.md) | "nothing works" / unexplained anomaly | cold agent enumerates every possible mechanism, then proves the winner against independent data |
| [**warrant**](warrant/SKILL.md) | shipping a conclusion built on data | fresh verifier recomputes every claim — refuted claims die, survivors get a receipt |

## Install (Claude Code)

```bash
git clone https://github.com/luongjames8/house-skills ~/code/house-skills
mkdir -p ~/.claude/skills
for d in ~/code/house-skills/*/; do
  [ -f "$d/SKILL.md" ] && ln -sfn "$d" ~/.claude/skills/"$(basename "$d")"
done
```

That's it — no commands to learn; the skills fire themselves when the moment matches
(`/warrant` etc. works as a manual fallback).

## Not on Claude Code?

The skill *bodies* are plain process text — three of the four contain no Claude-specific mechanics
at all. Copy them into any system prompt, LangGraph node, or CLI-agent instruction. What you must
supply yourself: the auto-firing (inject the four trigger descriptions into your system prompt, or
just run the right skill at the right pipeline stage), and "fresh subagent" = any zero-history
model call. Two pieces need no LLM at all: warrant's `VERIFICATION:` receipt is a one-line grep
gate for CI, and tabletop's contract table works as a PR template for humans.

---

## Genesis

These came out of a live algorithmic-trading operation run by a fleet of AI agents, where the
operator kept catching the agents fooling themselves — the same few ways, over and over. Every
catch was reproduced with a baseline agent (RED), fixed with the smallest rule that made the
reproduction pass (GREEN), and shipped as a skill. Each has a specific incident behind it:

- **elucidate** — an analyst booked a venue's "matched, riskless" fills as benign, importing the
  exchange's risk frame as its own; the desk was actually holding the losing leg. The entire fix
  was one sentence said out loud — so the skill exists to force those sentences into text *before*
  the analysis.
- **differential** — weeks of "all candidates killed" verdicts while the actual loss mechanism sat
  unasked; a cold agent named it in under a minute once someone finally asked *why* instead of
  *whether*. Its PROVE-IT gate was added after a data field literally named `maker` was read as
  the maker *role* — and every re-read of the same feed "confirmed" it.
- **warrant** — an agent with a wrong hypothesis in its own notes wrote a hedge paragraph instead
  of dispatching the check it was deferring "to next session". Verification had to stop being the
  author's job.
- **tabletop** — a production button handler validated before acking and blew the vendor's
  3-second callback window; the error was swallowed, the user saw nothing, and hundreds of unit
  tests had passed. The design was written against a contract nobody had read.

## Evidence, honestly

The incidents accumulated over weeks of operation; the controlled reproductions were run in a
two-day hardening sprint, which is why the receipt dates cluster. What each claim rests on:

- **elucidate** is the only skill with a graded eval (`elucidate/docs/experiment-results.md`):
  0.60 → 0.90 solve-rate rescue on hidden-constraint decisions — small n (2 trials/cell, 5
  problems, one answer-key grader), directional not definitive. The ideation mode is
  field-validated only. The eval harness runs on Claude Code's Workflow tool; porting it elsewhere
  means reimplementing five small primitives.
- **differential / tabletop / warrant** carry small paired A/B runs, not distributions — each
  skill's fixtures and per-run results are in its `docs/fixtures/RECEIPTS.md`, all synthetic and
  rerunnable. They reproduce the failure and show the rule changes behavior under the same
  pressure; they don't estimate effect sizes.
- Proposed rules that **refused to fail a test were not shipped** — recorded as negative results
  in [`warrant/docs/`](warrant/docs/). If you read one thing to judge this repo, read those.

Two patterns worth stealing even if you never install anything: **catch-side beats author-side**
(asking a working agent to notice its own mistakes degrades with context length; routing output
through a fresh reader with a narrow charter caught every failure class we could reproduce) and
**structure beats prose** (deliverables are tables with a completeness rule — every mechanism /
claim / interface gets a row; one "keep it brief" request made baseline agents silently drop their
entire findings table).

Raw field cases from the originating campaign live in a private companion repo; published evidence
keeps measured result shapes with identifying specifics genericized.
