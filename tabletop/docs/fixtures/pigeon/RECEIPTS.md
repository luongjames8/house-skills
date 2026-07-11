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
