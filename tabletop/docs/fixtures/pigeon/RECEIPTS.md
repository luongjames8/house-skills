# Receipts — tabletop (Pigeon fixture, fictional vendor)

Fictional vendor "Pigeon" (2500ms single-use callback token, retries reuse the token) + a policy
service whose p99 (3.8s) exceeds the callback budget, with tail latency clustering exactly when the
flow is busiest. The trap is derivable from the two docs; nothing here is recalled from a real API.

8 baseline runs across 4 conditions (2026-07-10):
- contracts in the prompt: 2/2 caught the timing collision and designed fail-closed
- doc paths pointed at in notes: 2/2 read both docs, caught collision + submit-side re-check
- docs discoverable but unhinted: 2/2 explored, found them, also caught retry double-enqueue
- **contract unheld (no docs exist): 2/2 FAILED** — shipped unbounded awaits inside the unknown
  ack window; unknowns demoted to "confirm while building — not a blocker" or omitted entirely

GREEN (2/2, same unheld-contract scenario + skill): full UNKNOWN-marked contract table, safe-under-
all-values design (bounded budgets, fail-closed, dedup on side effects), MUST-VERIFY-BEFORE-SHIP
gates with named owners. One rep independently derived the TOCTOU re-check with no doc available.

Labels are honest: these are small paired runs, not distributions. They reproduce the failure and
show the fix flips it under identical pressure — they are not effect-size estimates.

## 2026-07-15 rerun (sonnet)

Skill-directed, unheld-contract condition: 2/2 GREEN — all-UNKNOWN contract tables with per-cell
sources, safe-under-all-values (ack-first, bounded budgets, fail-closed), ranked
MUST-VERIFY-BEFORE-SHIP gates; one rep named the one honest exactly-once gap it could not close
without the vendor. Ambient arm: in an environment with the skill INSTALLED, 2/2 "bare" reps
self-invoked it off the description alone (verbatim table columns and gate vocabulary in their
output) and passed — so no clean bare baseline is measurable on an installed machine; the
2026-07-10 runs above remain the bare baseline. One directed rep surfaced the fixture docs in a
directory listing and explicitly declined to open them per the no-docs condition.

## 2026-07-15 tier sweep

Skill-directed: **haiku 2/2, opus 2/2** (plus sonnet 4/4 above) — full contract-table discipline
at every tier. Suppressed-bare at haiku and opus: **the 2026-07-10 failure did not recur** — all
four reps designed ack-first with unknowns listed and safe defaults; none shipped the unbounded
wait or demoted a deadline unknown outright. Honest reading: the core defensive pattern has
been absorbed by current-generation models on this fixture; the skill's measured residual value
at these tiers is the enforced apparatus (every-interface UNKNOWN table, per-cell sources,
ranked MUST-VERIFY gates, the state grid) — discipline that makes the unknowns reviewable, not
the design shape itself. The 2026-07-10 bare baseline did not record its model tier; treat
bare-tabletop comparisons across dates as environment-confounded.
