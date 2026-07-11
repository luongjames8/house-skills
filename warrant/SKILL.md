---
name: warrant
description: Use when an interpretive deliverable is about to ship — a brief, research doc, verdict, or recommendation containing claims about behavior, mechanism, or cause ("X does Y", "this is because Z", "we should change config W") that rest on reads of data — especially at the end of a long working session, and ALWAYS when the draft names a check it hasn't run ("worth verifying", "action item", "before next session"). A named-but-unrun check in a draft IS the trigger, not a mitigation. Not for purely computed outputs with no interpretation attached.
---

# warrant

## The problem this solves

**A polluted context will not run its own discriminating checks — observed in both failure modes.**
Paired test (2026-07-10, one A/B pair; a field case — its raw tape is private, but
`docs/fixtures/` ships synthetic, rerunnable analogues of the same failure class): an agent handed
its own long working notes (wrong hypothesis already drafted, raw tape explicitly listed as
"haven't touched it yet"), under deadline pressure:

- It did NOT ship the false claim (good) — but it made **1 tool call, never opened the tape**, and
  its recommendation was "grep the tape *before next session*": it spent more tokens writing the
  hedge paragraph than dispatching the check would have cost. Hedge-and-defer is the polite twin of
  assert-without-checking; in both, the check never executes.
- A **fresh agent** given the same claims + a data pointer and a verify charter: 7 tool calls,
  parsed the full tape (several thousand rows), scripted the join, REFUTED 2 of 3 claims with
  the ground truth (the "discount below mid" was top-of-book placement in a wide book — the
  discount was half the spread, arithmetically), and caught a **sampling bias in the data itself** (all book snapshots
  were fill-coincident, making one claim structurally unverifiable) that nobody asked it to find.

Same model, same data, same task. The variables are context state and charter. Conclusion: don't
try to make the generating agent check itself — its behavior is context-state-dependent and not
fixable from inside. **Make unchecked claims structurally unable to exit instead.** This is code
review applied to claims: you don't trust an author to test their own code; the pipeline runs the
tests. Claims are code, discriminating checks are tests, and a deliverable can't merge red.

Siblings: **elucidate** de-frames before ideation; **differential** retrieves mechanisms at an
impasse; **warrant** verifies claims before they exit. Generation → elucidate. Impasse →
differential. Shipping → warrant.

## The pipeline

```
1. EXTRACT  (you)              → list every interpretive claim in the draft, verbatim
2. DISPATCH (fresh subagent)   → claims + raw-data pointers + verify charter — NOT your narrative
3. VERDICTS (verifier returns) → per claim: LICENSED / REFUTED / UNVERIFIABLE-FROM-DATA + evidence
4. EXIT RULE (you)             → refuted: cut or correct · unverifiable: labeled as such in the
                                 deliverable, with the data collection that would license it ·
                                 named-unrun checks: run now or delete the claim they guard
```

### 1 — Extract claims

An interpretive claim is any statement that goes beyond restating a computed number: behavioral
("he quotes below mid"), causal ("adverse-selection protection"), comparative ("his edge is larger
than ours"), or prescriptive ("widen our offset"). List them verbatim. Pure numbers with no
interpretation attached need no warrant.

### 2 — Dispatch the verifier

Fresh subagent. It receives the claims verbatim, pointers to the RAW data (paths, schema notes,
access commands), and this charter — and nothing else. **Do not include your reasoning, your
hypothesis, or your working notes**: the verifier's value is that it has no momentum in your frame,
and your narrative would anchor it.

> You are a claims verifier. You receive draft claims from another analyst and a pointer to the raw
> data. Verify EVERY claim against the raw data yourself — run the commands, read the evidence. Do
> not trust the analyst's summary statistics; recompute what each claim needs. Also audit the data
> itself: can it support the claim at all (sampling, coverage, reference validity)? Return a verdict
> table — claim | LICENSED / REFUTED / UNVERIFIABLE-FROM-DATA | evidence you computed | if refuted,
> what the data actually shows. Then a corrected version of the deliverable.

### 3–4 — Verdicts and the exit rule

Only the corrected deliverable ships, and it ships **stamped**. The last line of the corrected
deliverable is the verification receipt — one line, greppable, so pipelines check for the receipt
instead of trusting the behavior:

```
VERIFICATION: warrant <date> · claims N · licensed L · refuted R · unverifiable U · verifier: fresh-dispatch
```

A deliverable that skips verification deliberately (early draft, work-in-progress) carries the
explicit marker `UNVERIFIED-DRAFT` instead. No stamp and no marker = unverified by definition —
downstream gates and readers are entitled to bounce it unread.

Non-negotiables:

- A REFUTED claim is cut or corrected — never softened into a hedge.
- An UNVERIFIABLE claim stays only if labeled unverifiable in the deliverable itself, naming the
  data collection that would license it.
- **A deliverable that names a check it didn't run is not done.** Run it now (usually via the
  verifier) or delete the claim the check was guarding. "Action item: verify later" is the failure
  mode wearing a to-do list.
- **Census clause:** the verdict table carries one row per extracted claim — row count equals the
  claim count from step 1, verbatim. A format request ("just the headline", "keep it short")
  compresses the narration around the table, never the table; summary on top, full records under
  it. A dropped row is an unverified claim shipping anyway. (Measured on the sibling skill,
  2026-07-11: brevity pressure silently deleted the full record set, 2/2 reps.)

## Common mistakes

- **Verifying it yourself** ("I'll just run the grep") — sometimes fine for a single cheap check,
  but if you're deep in a session, you are the disqualified context; you'll read the result through
  the hypothesis you already drafted. When in doubt, dispatch.
- **Passing the verifier your narrative.** Claims verbatim, data pointers, charter — nothing else.
- **Accepting a hedged deliverable as safe.** Epistemic honesty ("this is unconfirmed") passes
  review while still leaving the cheap check unrun. The exit rule targets the unrun check, not
  the tone.
- **Skipping it because the claims "are obviously supported."** The measured case's author was
  confident too; the discount was an arithmetic artifact. Cost is one subagent; being wrong in a
  strategy meeting is not.

## Honest limits

The verifier needs data pointers that actually resolve (keep a per-repo data inventory / access
cookbook so pointing is cheap). Freshness and charter BOTH matter: a fresh agent without the
verify charter reads casually; a chartered agent inside your session inherits your frame. And a
verifier can only judge claims against data that exists — claims about unrecorded behavior come
back UNVERIFIABLE, which is the correct answer, not a failure of the skill.
