# elucidate

**A generalized, fully-automated agent skill for ideation and analysis that works by fixing the model's *inputs*, not its reasoning.**

AI ideation and subjective analysis fail in two recurring ways:

1. **Context pollution** — after long research, the working context is muddied (high signal/noise) and the model can no longer enumerate new surfaces or reason cleanly.
2. **The mental-model gap** — subjective decisions rest on tacit models with *no textual basis*, so the model reasons wrong.

> **The car-wash problem** (physical prerequisite). "I want to wash my car. Should I walk or drive?" A model says *walk* (exercise, environment) because nothing in its context states the tacit prerequisite: *the car must be present at the wash to be washed.* There is no sentence to reason against, so it reasons wrong.
>
> **The mint-match problem** (frame import). A real field case: for days a model booked an exchange's "matched, riskless" fills as *benign* — importing the *counterparty's* risk frame as its own. The fill actually handed us one directional (losing) leg: the dominant share of volume and essentially all of the bleed. The missing sentence: *"matched for the exchange is a directional play for us."* Whole classes of analysis error are this — a metric read in the wrong perspective.

`elucidate` fixes both with one move: **force the tacit into explicit typed text, then reinject it into a fresh reasoner with a clean context.** It is problem-agnostic — decisions, diagnoses, ideation, strategy.

## How it works

```
INPUT (problem + any muddled/polluted material)
  → DISTILL into a typed briefing:
        FACTS · CONSTRAINTS · PRIORITIES · ENUMERATION VECTORS · OPEN QUESTIONS
        (most effort on CONSTRAINTS — the hidden-prerequisite slot)
  → REINJECT into a FRESH reasoner (clean context = briefing + bare question)
        reason with a forcing-function instruction ("what MUST be true for this to work?")
  → OUTPUT: recommendation / ideas + the surfaced constraints
```

The typed **CONSTRAINTS** slot *is* the mental-model elicitation method: a field literally named "things that must be true, including unstated prerequisites" is the forcing function that makes the model write down *"the car must be present."* Freeform prose lets it stay tacit.

See **[`SKILL.md`](SKILL.md)** for the runnable skill (prompts + rules).

## We didn't guess — we measured it

`elucidate` was built as an experiment harness first. We tested three distillation modes (`none` / freeform `A` / typed `B`) × two reasoning modes (single / debate+judge) × clean vs. polluted input, across a family of hidden-constraint decision problems, graded by an independent model. Headline findings:

| Finding | Result |
|---|---|
| **Typed distillation (B) rescues a naive reasoner** | solve rate **0.60 → 0.90**, and pollution-proof (0.90 polluted == 0.89 clean) — the headline result |
| **Typed distillation (B) is also the ceiling** | with a strong reasoner it hits 100% and never dropped a genuine case; it *never hurt* in either regime |
| **Freeform distillation (A) is weaker and risky** | rescues a naive reasoner only to 0.80, and *hurts* a capable one (correctness 0.56 — worse than doing nothing) |
| **Debate *degrades* hidden-constraint problems** | advocates entrench the false frame; judge accepts the premise (0.60 solve). Single-agent is safer |
| **The forcing function is the mechanism** | an explicit "is this a false choice / missing prerequisite?" demand — inline or as a CONSTRAINTS slot — is what moves 0.60 → 0.90; the typed slot is its most reliable carrier |

Full analysis: **[`docs/experiment-results.md`](docs/experiment-results.md)**. Design rationale: **[`docs/design.md`](docs/design.md)**.

## Repo layout

```
SKILL.md                  the reusable agent skill (winning config + prompts + rules)
docs/design.md            thesis, hypotheses, variant matrix, methodology
docs/experiment-results.md  the measured results and what they mean
eval/problems.json        hidden-constraint problem dataset (+ hidden_constraint + correct_answer)
eval/prompts.json         distiller / reasoner / debate / grader prompts
eval/workflow.js          the harness (runs the matrix, solves, grades, aggregates)
eval/results-run1.json    raw output — run 1 (strong reasoner, forcing-function solver)
eval/results-run2.json    raw output — run 2 (naive reasoner, isolation test)
```

## Reproduce

The harness runs on the Claude Code **Workflow** tool. Launch `eval/workflow.js` with `problems`, `noise`, `prompts`, `cells`, `trials` (and optional `solverModel`) as `args`. Add your own hidden-constraint problems to `problems.json` — each needs a `hidden_constraint` and `correct_answer` for grading.

## Status

Experimental. Validated on hidden-constraint decision problems. The pollution-recovery claim and the ideation path are lightly tested — see the caveats in the results doc.
