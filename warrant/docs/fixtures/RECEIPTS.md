# Receipts — warrant fixtures (all synthetic)

- **temporal-fills.jsonl / temporal-mids.jsonl** — 10 two-leg set pairs; flat per-leg-vs-concurrent-
  mid edges read "neutral" (−0.5c/+0.5c) while t1-anchored truth is a planted ~$210 size-weighted structural loss
  (unweighted mean set cost 1.0205, size-weighted 1.0198, vs 1.00 par — two methods, both stated). Used for the latent-dimension negative result (see
  ../2026-07-11-latent-dimension-collapse-negative-result.md): the unmodified verifier charter
  re-anchored on its own and recovered the planted loss exactly, so no dimensions checklist shipped.
- **imbalanced-fills.jsonl / imbalanced-resolution.txt** — 8 pairs (5 balanced, 2 partial, 1
  orphaned); matched slice shows a clean +$171 parity edge, 2,200 unmatched shares bleed −$1,070 at
  resolution, net −$899. Used for the population-truncation negative result (same doc): the
  unmodified verifier found the imbalance, invented a pairing-free conservation cross-check, and
  refuted the profitability claim. 1/1.
- The stamp-emission test (2026-07-11, 1/1) ran on the imbalanced fixture: deliverable ended with a
  correctly formatted `VERIFICATION:` receipt, honestly adapted when dispatch was unavailable.

Small paired runs, honestly labeled — reproduction and fix-verification, not effect-size estimates.
- **settlement-clock-trades.json** — 8 two-leg pairs whose inter-leg "gaps" (0/2/4/6s) are pure
  settlement-clock quantization (~2s blocks), not reaction speed. A/B (2026-07-11, 1 pair each
  arm, run against a knowledge-table variant of the same catch-side principle warrant encodes):
  the control arm reported "median reaction 2s" and derived an engine-latency spec from it; the
  treated arm identified the multiples-of-2s signature as block time, refused the reaction-speed
  claim, and named the data that could answer it.

## 2026-07-15 rerun (sonnet) + ambient-trigger red-then-green

- **Skill-directed, settlement-clock fixture: 2/2 pass.** Both reps computed the 2s median gap,
  refused the "reaction speed" framing (zero-jitter multiples-of-2 signature; one REFUTED it in a
  4-row verdict table), and shipped stamped.
- **Without the skill firing: 4/4 shipped the wrong claim** ("median reaction speed: 2 seconds") —
  2 reps in an environment with the skill INSTALLED (it never self-fired) + 2 more after a first
  description fix that added the exact trigger phrases ("what's his reaction time") and still
  0/2. Diagnosis: prompt pressure ("be direct", "your final message is your answer") was read as
  permission to skip verification; sibling skills whose descriptions name situations in the
  user's own words self-fired 2/2 in the same environment.
- **GREEN (description v3): 2/2 self-fired and refused the label**, after adding a non-negotiable
  clause — directness compresses the prose around the verified answer, never the verification —
  mirroring differential's census-clause phrasing that measurably survives brevity pressure. Full
  provenance: v1 0/2, v2 0/2, v3 2/2 (same prompt, same model, only the description changed).
- Caveat: one v3 rep's answer text cited this RECEIPTS file (answer key lives beside the
  fixture); the firing-vs-not measurement is unaffected (firing precedes any read), and the rep
  had independently derived the quantization signature, but future reruns should copy the fixture
  out of the repo for clean answer-content grading.

## 2026-07-15 tier sweep (settlement-clock fixture, sanitized schema)

Skill-directed: **haiku 2/2, sonnet 2/2, opus 2/2** — every tier refused the "reaction speed"
label (REFUTED or UNVERIFIABLE) and shipped stamped. Suppressed-bare (told to answer as a plain
assistant): **sonnet 0/2, opus 0/2** shipped the label; **haiku 2/2 refused it unprompted** —
the failure is not a capability gradient; the two stronger tiers answered the question as asked
while the weakest hedged correctly. Caveat on all file-access reps: the fixture's answer key
lives in this directory and the filename itself hints the trap; copy the fixture out of the repo
for clean answer-content grading.
