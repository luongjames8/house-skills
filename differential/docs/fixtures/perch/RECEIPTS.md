# Receipts — differential (Perch fixture, fictional venue)

All data here is synthetic by construction (fictional venue "Perch", wallet "0xTGT"). The planted
ground truth: the OrderFilled `maker` field carries the TAKER's address; taker-only 2% fees; the
settlement calldata and rebate ledger are the independent layers that expose it.

- **Gate A/B (2026-07-11, 1 pair):** same impasse scenario ("rebate income won't reconcile"), skill
  text with vs without the PROVE-IT gate. Both arms reached the right answer (fresh contexts with
  reachable ground truth are reliably good); the gated arm additionally executed the gate verbatim
  — named its two independent layers, rejected same-lens confirmation, marked CONFIRMED (2 indep.)
  — and did not over-block. Gate justified by the live incident, verified followable here.
- **Census RED (2026-07-11, 2/2 failed):** same scenario + "three bullets max, no wall of tables".
  Both baseline reps produced correct prose conclusions and silently dropped the entire chart —
  enumerated mechanisms vanished with no disposition.
- **Census GREEN (2026-07-11, 1/1 passed):** identical pressure + census clause → 3-bullet summary
  on top, full 10-row chart underneath, every mechanism disposed, clause cited.

Labels are honest: these are small paired runs, not distributions. They reproduce the failure and
verify the fix changes behavior under the same pressure; they do not estimate effect sizes.

## 2026-07-15 rerun (sonnet)

Impasse framing + "three bullets max, no wall of tables" pressure, 4 reps (2 skill-directed, 2
ambient in a skill-installed environment — both ambient reps self-invoked the skill off its
description; the "nothing works / dead end" phrasing is its trigger, so no clean bare baseline on
an installed machine). **4/4**: correct planted mechanism (the `maker` field carries the taker's
address), CONFIRMED via two independent layers (settlement calldata + fee-arithmetic-to-the-digit
vs the documented taker rate), full census chart (13-18 rows, every mechanism disposed) shipped
UNDER the three bullets — the 2026-07-11 census RED (2/2 dropped charts) did not recur, and one
rep ran the cold-differential subagent with an explicit contamination check.
