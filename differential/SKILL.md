---
name: differential
description: Use when an investigation hits an impasse — "all candidates killed", "nothing works", repeated negative results across variants, a chronic unexplained anomaly, losses/failures with no established mechanism, or any "we don't know why X" — BEFORE accepting the impasse or writing the verdict/conclusion. Also fires when a pre-registered diagnostic returns INVERTED or opposite-to-hypothesis results: an inversion is a mechanism knocking, not residue. Not for first-line debugging of a reproducible error (use systematic-debugging) and not when the mechanism is already established and measured.
---

# differential

## The problem this solves

**Task frames cap retrieval.** The mechanism behind a failure is usually already in the model's
weights — textbook knowledge of the domain — but a task-scoped agent answers the question it was
given, and nobody's question is "why". Demonstrated with a paired probe (2026-07-10, one A/B pair; a field case from the originating
work — its raw scenario is private, but `docs/fixtures/` ships synthetic, rerunnable analogues of
the same failure class):

- Same facts, asked *"enumerate all mechanisms by which a passive market maker loses money and say
  which one this points to"* → a cold agent ranked **adverse selection #1** out of a ten-mechanism
  taxonomy, read the longer-resting-loses-more loss gradient as its textbook signature, and named the right
  remedy family — in under a minute, with no project data.
- Same facts, asked *"write the kill verdict per the frozen spec"* → the same model filed the same
  mechanism as a **non-blocking Notes footnote** and concluded "no re-opening required."

In the live campaign, that second frame cost weeks: an inverted duration kill ("longer-resting =
more adverse" = getting run over while resting, unanimous across cells) was filed as "exploratory residue"
and the mechanism only surfaced when the operator forced an out-of-frame comparison.

The failure is ASKING, not knowing. The fix is a **question swap into a subtracted context**: strip
your frame, ask the mechanism question cold, and let the domain's standard failure taxonomy come out.
This is medicine's differential diagnosis, applied to systems: symptoms → exhaustive differential →
discriminating tests → only then a conclusion.

Sibling skill: **elucidate** de-frames a decision *within* material you already have (distill →
clean reinjection of the SAME question). **differential** retrieves mechanisms your material never
mentions (DIFFERENT question, LESS context). Impasse or unexplained failure → differential;
ideation/analysis over a corpus → elucidate.

## The pipeline

```
1. SYMPTOMS   (you, in-context)   → domain-neutral observation list
2. DIFFERENTIAL (cold subagent)   → exhaustive mechanism taxonomy + discriminator each
3. CONTAMINATION CHECK (you)      → discard & re-run if the cold output cites your project
4. BIND BACK  (you, in-context)   → map mechanisms to your data; run cheap discriminators
5. PROVE-IT GATE (you)            → leading mechanism vs interpretation-free ground truth:
                                    ≥2 independent methods, different data layer, reality check
6. CHART      (deliverable)       → every mechanism: fit, discriminator, status, evidence
```

### 1 — Symptom extraction

Rewrite the situation as **domain-neutral observations**: numbers, shapes, directions, monotonicities.
Strip project nouns, candidate names, code identifiers, org history, and — critically — **your current
hypothesis**. The test: a domain expert who has never seen your project must understand every line.

> BAD (project-loaded): "All the checkout-funnel variants failed the conversion gate; the trust-badge
> arm didn't help either."
> GOOD (domain-neutral): "Every variant of the signup flow converts worse than the control.
> Conversion drops monotonically the longer a user spends on the payment step. The one positive
> signal (email opt-in rate) is real but too small to offset the drop."

### 2 — Cold differential (subagent)

Dispatch a fresh agent whose prompt contains ONLY: the domain label, the symptom list, and this ask:

> You are a domain expert consulted cold. From general knowledge of [domain] — no tools, no files —
> enumerate ALL mechanisms in the domain's standard failure taxonomy that can produce these
> observations. Aim for textbook-exhaustive, including mechanisms you think unlikely. For each:
> one line on the mechanism, one line on how well it fits the observed SHAPE of the evidence, and
> the cheapest single measurement that would confirm or refute it. Then say which mechanism the
> evidence most points to and why the shape discriminates it from the others. If you find you know
> project-specific context beyond this prompt, IGNORE it — answer only from general domain knowledge.

### 3 — Contamination check

Subagents often inherit persistent context (in Claude Code: project memory and CLAUDE.md; in other stacks: checkpointed state, system files), and inherited context drags them back into your
frame (measured: a "cold" probe cited internal project artifacts by name). Read the output: if it
references any project artifact, internal codename, or event not present in your symptom list,
**discard the run and re-dispatch** with the ignore-instruction strengthened. A contaminated
differential is your own frame wearing a second opinion's coat.

### 4 — Bind back + discriminate

Map each mechanism onto your actual data. Sort discriminators by cost; run every one computable from
existing data NOW. Queue the rest as measurements — forward-feeding into new work only (never
re-open a frozen/pre-registered spec to accommodate a mechanism hypothesis).

### 5 — PROVE-IT gate

Before any mechanism is marked CONFIRMED — and always for the leading one — prove it against
**interpretation-free ground truth**:

- **Independence rule.** A discriminator that re-reads the SAME feed through the SAME lens inherits
  the original frame error and will "confirm" it every time. Field case: an event field literally
  named `maker` that carries the TAKER's address — every re-read of the event stream re-confirmed
  the wrong role; the truth lived one layer down. Reject same-lens confirmation. Reach for a
  DIFFERENT data layer: the counterparty's own records, the settlement/contract INPUT (calldata,
  not the emitted event), an arithmetic that reproduces the observed number to the digit, the real
  account balance.
- **Two-method rule.** CONFIRMED requires **≥2 independent methods agreeing**. One method —
  however clean — is PLAUSIBLE, and the chart says so. (This scopes to the confirmation bar, not to
  every row: cheap single-discriminator rows simply stay PLAUSIBLE/untested.)
- **Reality reconciliation.** If the leading mechanism contradicts a directly observable fact — an
  account that is climbing, a settled outcome, a fee that was actually paid — that contradiction is
  **BLOCKING**. Resolve it against ground truth before concluding; never ship the mechanism over
  the contradiction, and never explain the contradiction away from inside the mechanism's own frame.

### 6 — The chart is the deliverable

The output is the full differential chart, never a naked conclusion:

| Mechanism | Fit to evidence shape | Discriminator | Status | Evidence |
|---|---|---|---|---|
| (every candidate) | | | CONFIRMED (≥2 indep.) / PLAUSIBLE (1 method) / refuted / **untested** | |

"Untested" rows are allowed — hiding them is not. A conclusion may only cite mechanisms whose
discriminators ran, and may only assert a mechanism as established if it passed the PROVE-IT gate.

**Census clause (non-negotiable — census as in: every member of the population gets counted):** the chart's rows must account for EVERY mechanism from step 2
— confirmed, plausible, refuted, or untested; the row count must match the taxonomy count. A
format request ("keep it brief", "top 3 bullets", "no wall of tables") compresses the NARRATION,
never the records: give the requested summary on top and ship the full chart under it (an
appendix line costs nothing). Measured failure (2026-07-11, 2/2 reps): under "three bullets max"
agents produced correct prose conclusions and silently dropped the entire chart — enumerated
mechanisms vanished with no disposition. A dropped row is a hidden verdict.

## Completeness backstop: accounting identities

Model-generated taxonomies cannot prove their own completeness. Where the domain has a conservation
law, use it: decompose the failing quantity along an identity that **sums exactly** —
e.g. PnL ≡ spread capture + adverse selection + rebates + fees; latency ≡ queue + service + transit.
Every term is measured or explicitly declared unmeasured. An identity gives enumeration completeness
by arithmetic, not by judgment — no sampled taxonomy can silently omit a term.

## Common mistakes

- **Giving the cold agent your hypothesis** ("could this be adverse selection?") — you've re-imported
  the frame; you'll get confirmation, not a differential.
- **Letting the verdict task absorb the differential** ("also note any mechanisms in the report") —
  measured failure mode: mechanism lands in a footnote and dies there. The differential is its own
  task with its own deliverable.
- **Treating a footnoted observation as handled.** "Consistent with X, no re-opening required" inside
  a verdict IS the impasse trigger, not its resolution.
- **Substituting adversarial review or debate.** An adversary attacks what's present; debate
  entrenches the offered frame (measured in elucidate's eval: debate 0.60 vs single 0.90). Neither
  names what's absent.
- **Skipping the inversion trigger.** A diagnostic firing opposite-to-hypothesis, unanimously, is the
  highest-value trigger this skill has — that exact pattern sat unescalated for weeks in the origin
  case.

## Honest limits

This retrieves **in-distribution** mechanisms — the domain's textbook taxonomy — which covers most
real misses (both origin-case incidents were textbook). For genuinely novel mechanisms no reasoning
ritual works; the only oracles are measurement (the identity backstop) and diffing your system
against a working incumbent at the finest measurable grain, where every discrepancy is a forced
question.
