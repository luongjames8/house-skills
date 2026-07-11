# elucidate — design

## Thesis

AI ideation and analysis are bottlenecked not by the model's reasoning but by its **inputs**. Two failure modes:

1. **Context pollution.** After a long research/data session, the context is muddied. High signal/noise input makes the model unable to enumerate genuinely new surfaces or reason cleanly. Fix: **distill** the muddle down to a small set of explicit principles/statements, then reason in a **fresh** context seeded only with those.

2. **The mental-model gap (the hard one).** Subjective analysis rests on tacit models that have *no textual basis*, so the model reasons wrong. Canonical case — the **car-wash problem**: "Should I walk or drive to wash my car?" A naive model says *walk* (exercise/environment) because nothing in its context states the tacit constraint *"the car must be present to be washed."* Fix: force these prerequisites into **explicit text** so inference has something to grip.

`elucidate` does both, fully automated, and is problem-agnostic.

## Pipeline (fully automated)

```
INPUT: problem (+ optional muddled / polluted material)
  → DISTILL   (a "distiller" agent emits an explicit briefing)
        variant A: freeform numbered principles
        variant B: typed slots — FACTS / CONSTRAINTS / PRIORITIES / VECTORS / OPEN QUESTIONS
  → REINJECT into a FRESH reasoner (clean context = briefing + bare question only)
        REASON:
          single-agent, OR
          debate (pro/con advocates) + judge
  → GRADE / OUTPUT
```

The typed **CONSTRAINTS** slot *is* the mental-model-elicitation method: a slot literally named
"things that must be true (including unstated prerequisites)" is the forcing function that makes the
model write down "the car must be present." Freeform prose lets it stay tacit.

## Why an experiment harness, not a fixed pipeline

The user's own uncertainty ("a simple one-agent model may be OK... we'd have to just try") is a
requirement: build it so we can **swap and measure** strategies. We test the matrix below on a family
of hidden-constraint decision problems where "correct" is crisply gradeable.

### Variant matrix (cells)

Dimensions:
- **inputMode**: `clean` (bare question) vs `polluted` (question wrapped in noisy, topically-adjacent rambling)
- **distillMode**: `none` (raw material straight to reasoner) vs `A` (freeform) vs `B` (typed)
- **analysisMode**: `single` vs `debate` (pro/con + judge)

Curated cells (8), chosen to answer specific hypotheses:

| cell | tests |
|---|---|
| clean / none / single | CONTROL — naive model on a clean question |
| polluted / none / single | H1: pollution degrades reasoning |
| polluted / A / single | H1: freeform distill recovers from pollution |
| polluted / B / single | H1+H2: typed distill recovers + surfaces constraints |
| clean / B / single | H2: typed distill helps even with no pollution (isolates mental-model value) |
| clean / none / debate | H3: does debate help/hurt on hidden-constraint problems? |
| polluted / B / debate | H3×H2 interaction |
| clean / B / debate | H3×H2 interaction |

Each cell × 5 problems × 2 trials.

### Models (methodology)

To expose the method's effect we test a **weak reasoner** that actually fails the naive case:
- distiller = `sonnet` (smart preprocessing is the up-front investment)
- reasoner/solver/debaters/judge = `haiku` (weak enough to show lift)
- grader = `sonnet` (grading must be reliable)

Using a top model as the solver would mask the effect (it may solve car-wash even naively).

### Metrics
- `surfaced_constraint` — did the answer explicitly name the hidden prerequisite/false premise?
- `correct_recommendation` — did it reach the right action (or reject the false framing)?
- `solved` = surfaced AND correct (headline)
- `mean_quality` — grader 0–100

## Deliverable
The winning configuration is packaged as `SKILL.md` (the reusable agent skill). The harness
(`eval/`), dataset, prompts, and results ship in the repo so the comparison is reproducible.
