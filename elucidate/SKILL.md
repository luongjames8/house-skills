---
name: elucidate
description: >-
  Run this BEFORE you (the agent) ideate or analyze — those two tasks ARE the trigger. Any time you
  are about to generate ideas, brainstorm, enumerate options or angles, rank candidates, or make a
  subjective analysis or evaluation, run elucidate FIRST, INSTEAD OF reasoning directly: it distills
  the problem into typed slots (FACTS, CONSTRAINTS, PRIORITIES, ENUMERATION VECTORS, OPEN QUESTIONS) —
  forcing hidden prerequisites and false premises into text — then reasons in a clean reinjection. Do
  NOT wait to be asked, and do NOT try to judge whether your context is "polluted": a muddied context
  is exactly what you cannot assess from inside it, so never build the trigger on noticing. The task
  verb is enough — if it is ideation or analysis, distill first. It never hurts a clean task and
  rescues a muddied one. Two failure classes it catches: PHYSICAL-PREREQUISITE (car-wash problem:
  "walk or drive to wash my car?" ignores that the car must be present) and FRAME-IMPORT (a metric
  stated in a counterparty's frame read as yours — an exchange's "matched, riskless" fill booked as
  benign when it actually hands you a directional loser). Also fires on user phrases like "help me
  decide", "what am I missing", "brainstorm angles", "analyze this". NOT for quantitative or verifiable
  work (a backtest number, a test result, a typecheck, a lookup) — that is not analysis; skip it there.
---

## When to fire (you are the actor)

**The trigger is the task, not your mental state: if you are about to ideate or analyze, distill
first.** That covers generating ideas, brainstorming, enumerating options or angles, ranking
candidates, and any subjective evaluation or judgment call. Do not wait to be asked, and do **not** try
to assess whether your context is "polluted" — a muddied context is precisely the thing you cannot
judge from inside it, so the trigger must never depend on noticing. The verb is enough: it never hurts
a clean task (typed distillation matched or beat the raw baseline in every eval cell) and it rescues a
muddied one.

The only carve-out is the negative trigger: a purely **quantitative or verifiable** call — a number, a
test result, a lookup — is not analysis. Skip it there. Everything else that is ideation or analysis:
distill first.

One exception lives inside the carve-out: if the quantitative result is an IMPASSE — repeated
negative results, an unexplained anomaly, a diagnostic firing inverted/opposite-to-hypothesis — that
is the sibling skill **differential**'s trigger (same package). Reporting the number is exempt;
accepting the impasse is not.

# elucidate

## The problem this solves

AI ideation and analysis fail not because the model reasons badly, but because the **inputs** are wrong in two ways:

1. **Context pollution.** After long research, the working context is muddied (high signal/noise). The model can no longer enumerate new surfaces or reason cleanly.
2. **The mental-model gap.** Subjective decisions rest on tacit models with *no textual basis*. Two canonical classes:
   - **Physical-prerequisite** — **the car-wash problem**: "Should I walk or drive to wash my car?" A model answers *walk* (exercise) because nothing in context states the tacit prerequisite *"the car must be present to be washed."*
   - **Frame-import** — a figure or label read in the wrong perspective. Field case (from a live trading campaign): for days a model booked "mint-match" fills as *benign maker liquidity* because the venue calls them *matched/riskless* — importing the **exchange's** risk frame as **ours**. The mint actually hands the desk one directional leg, disproportionately the losing one — the large majority of maker volume and nearly all of the bleed. The fix was one sentence the operator said aloud — *"matched for the exchange is a directional play for us"* — exactly the tacit line a CONSTRAINTS slot is meant to force into text. *"Whose frame is this stated in, and is it ours?"*

The fix for both is the same move: **force the tacit into explicit text, then reason in a fresh context seeded only with it.**

## What the evidence says (see `docs/experiment-results.md`)

Two graded workflow runs on a family of hidden-constraint decision problems. The findings that drive this skill's design:

- **Typed-slot distillation (with an explicit CONSTRAINTS slot) rescues a naive reasoner from 0.60 → 0.90 solve rate, and is pollution-proof** (0.90 polluted ≈ 0.89 clean). With a strong reasoner it hits the 100% ceiling and never dropped a genuine case. It *never hurt* in either regime.
- **Freeform "principles" distillation is weaker and risky** — it rescues a naive reasoner only to 0.80, and with a capable reasoner it actively *hurts* (correctness 0.56, *worse than no distillation*): a lossy prose intermediate lets the reasoner fall back on the framed options.
- **Debate (pro/con + judge) *degrades* hidden-constraint problems** — advocates entrench the false dichotomy and the judge tends to accept the premise (solve rate 0.60). Typed constraints only partially rescue it. Single-agent is safer.
- **The forcing function is the real lever.** The explicit "is this a false choice / missing prerequisite?" demand moves 0.60 → 0.90 whether applied inline in the solver *or* carried as a typed CONSTRAINTS slot — and the typed slot is its most reliable carrier because it *guarantees* the prerequisite gets written down (surfacing = 1.00).

**Winning configuration: typed-slot distillation → single fresh reasoner with a forcing-function instruction.** Simplest and best.

## The pipeline (fully automated)

```
INPUT: problem (+ any muddled / polluted material or research)
  │
  ├─ 1. DISTILL  (subagent) → typed briefing:
  │        FACTS · CONSTRAINTS · PRIORITIES · ENUMERATION VECTORS · OPEN QUESTIONS
  │        (spend most effort on CONSTRAINTS — the hidden-prerequisite slot)
  │
  ├─ 2. REINJECT into a FRESH reasoner (clean context = typed briefing + bare question only)
  │        REASON with the forcing-function instruction
  │
  └─ 3. OUTPUT: recommendation / enumerated ideas
           + the surfaced constraints
           + KILLED candidates (each with the constraint that killed it)
           + BRIEFING SELF-AUDIT (false premises / ungrounded placeholders found in the briefing)
```

Run it with subagents (the Agent tool) or the `eval/workflow.js` harness. Never let the raw muddled material leak into the reasoning step — the whole point is a clean reinjection.

### Step 1 — Distiller prompt (typed; this IS the mental-model elicitation)

> You are a distiller. You will be given raw material describing a problem. It may contain a lot of irrelevant noise. Produce a distilled briefing for a FRESH reasoner who will answer with NO other context. Fill these labeled slots, each as a short list of statements:
> - **FACTS**: what is known to be true.
> - **CONSTRAINTS**: things that MUST hold for any valid solution — ESPECIALLY physical or logical prerequisites usually left unstated (e.g. a thing must be physically present before it can be acted on; a stated choice may rest on a false premise; a figure or label may be stated in a counterparty's frame rather than ours — ask "whose perspective is this stated from, and is it OURS?"). Be exhaustive about hidden prerequisites a naive reasoner would overlook.
> - **PRIORITIES**: what matters most, ranked.
> - **ENUMERATION VECTORS**: distinct angles along which options should be generated.
> - **OPEN QUESTIONS**: what remains uncertain.
> Do NOT solve the problem. Spend most of your effort on CONSTRAINTS.

### Step 2 — Reasoner prompt (fresh context; forcing function)

> You are answering using ONLY the briefing below (plus the question). Before choosing, ask what MUST be true for any answer to actually work. If the question presents a false choice, or omits a necessary prerequisite, say so explicitly rather than picking one of the offered options. Give a clear recommendation and brief reasoning.

### The two modes

**(a) DECISION** — a hidden prerequisite or false choice. The reasoner above answers directly.

**(b) IDEATION / EVALUATION** — a polluted corpus you must enumerate or judge over (the mode agents
most often miss). Keep the same distiller; have the fresh reasoner enumerate along the ENUMERATION
VECTORS, one cluster per vector — but two steps are non-negotiable, and are where the field value came
from (see `docs/experiment-results.md`, Run 3):

> After enumerating, **KILL** every candidate that any CONSTRAINT forbids, and report each kill *with
> the constraint that killed it* — a constraint firing is the mechanism working, not a failure. The
> output must account for EVERY enumerated candidate — kept or killed, counts matching — and a
> brevity request compresses the prose, never the candidate accounting; a silently dropped
> candidate is an unexamined one. Then
> rank survivors by the ranked PRIORITIES, not by novelty or by PnL sign.
>
> Before all of that, **AUDIT THE BRIEFING ITSELF**: check the FACTS against the CONSTRAINTS for
> internal contradictions, and flag any bar or gate that rests on an ungrounded placeholder. If a
> stated constraint contradicts the facts (e.g. "the competitor achieves neither X nor Y" when the
> facts say both are positive), say so — a false premise in the briefing silently corrupts everything
> downstream, and catching it is often worth more than any idea generated.

## Rules of use

- **Default to single-agent.** Do not reach for debate on hidden-constraint or false-premise problems — it entrenches the frame.
- **If you use debate** (only for genuine two-sided *value* tradeoffs, not hidden-prerequisite puzzles), the judge and both advocates MUST receive the typed CONSTRAINTS. Never debate on the bare question.
- **Never distill to freeform prose** when correctness matters. Use the typed slots. Prose is lossy and can bias the reasoner toward the framed options.
- **Keep the reasoning context clean.** The fresh reasoner sees the typed briefing + the bare question — never the original muddled dump.
- **Constraints are output, not just input.** Report what the constraints *killed* and why. In field use this "constraint-kill" was a top source of value — it stops the reasoner proposing what the engine forbids.
- **Always self-audit the briefing.** A false premise or ungrounded placeholder inside the distilled briefing corrupts everything downstream; catching it beat idea-generation as the highest-value output in field use.
- **Iterate** for large problems: distill → enumerate → feed new findings back into a second distill pass. Multiple muddled sessions collapse into one clean principle set.
- **Model choice:** distiller and reasoner run well on **sonnet**; reserve heavier models for genuinely hard synthesis. Grading/eval uses sonnet.

## Reproduce / extend the evidence

`eval/workflow.js` is the harness; `eval/problems.json` the dataset (add your own hidden-constraint problems with a `hidden_constraint` + `correct_answer`); `eval/prompts.json` the prompts. Re-run via the Workflow tool with those as `args` (optional `solverModel` overrides the reasoner-under-test). Raw output lands in `eval/results-run*.json`, analysis in `docs/experiment-results.md`.
