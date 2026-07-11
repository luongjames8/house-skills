---
name: tabletop
description: Use when designing, finalizing, or reviewing any flow that crosses a service or vendor boundary — webhook handlers, API integrations, queue consumers, exchange/chain interactions, anything where your code and someone else's system interact under timing, token, retry, or failure semantics — BEFORE the design is handed off or implemented. Fires HARDEST when the counterparty's contract is not in hand ("in-house fork", "no docs", "we're an early customer", "TTL unknown"): an unheld contract is the moment this skill exists for, not a reason to skip it.
---

# tabletop

## The problem this solves

**Agents design correctly against contracts they hold, and confidently against contracts they
don't.** Measured (2026-07-10, 8 controlled runs): given a cross-system design task with the vendor
contract in the prompt, pointed at, or merely discoverable in the repo — 6/6 baseline runs fetched
it and derived the composition correctly (timing collision, single-use token, TOCTOU re-check, even
retry-double-enqueue). Given the SAME task with the contract genuinely unheld: 2/2 shipped the
broken design — one demoted the unknowns to "things to confirm, **not blockers**", one never
mentioned the timing contract at all. Field case: a production button handler that validated before
acking, blowing the vendor's 3-second window; the error was swallowed and the operator saw nothing.

The failure is never the derivation — it's designing against a contract that was never assembled.
So the skill is one table and one rule.

## The contract table (STEP 1, before any pseudocode)

For EVERY interface the flow touches (each vendor API, internal service, queue, chain):

| Interface | Response deadline / ack window | Token & idempotency semantics | Retry behavior | Latency (median / p99) | Failure modes & what caller sees | Source |
|---|---|---|---|---|---|---|

Every cell needs a **citation** — a doc file, vendor docs page, or a measured number. Fill it by
FETCHING, not recalling: read the vendor doc now, grep the service reference now. (Evidence: agents
that read the docs caught every trap; the doc is always cheaper than the incident.)

## The rule (this is the skill)

**A cell you cannot fill is an UNKNOWN, and an UNKNOWN in a deadline, token, retry, or failure
column is a BLOCKER — not a footnote.** The design's correctness depends on that value; obtaining
it is part of the design task, not a follow-up. Exactly two legal moves with an UNKNOWN:

1. **Block the handoff**: the deliverable's top line is "BLOCKED on <contract item> — owner: <who
   can answer>", not a finished-looking design with a confirm-later note.
2. **Design safe-under-all-values**: choose the pattern that is correct for every possible value of
   the unknown (ack first unconditionally; bound every external call with an explicit budget; treat
   timeout as fail-closed), and promote the unknown to a **MUST-VERIFY-BEFORE-SHIP gate** stated in
   the deliverable — implementation may start, shipping may not.

Also NOT negotiable by format requests: a "keep it brief" from the requester compresses the prose,
never the contract table or the grid — every interface keeps its row, every UNKNOWN stays visible;
summary on top, records underneath. (Measured on the sibling skill, 2026-07-11: brevity pressure
silently deleted the full record set, 2/2 reps.)

What is NOT legal: "worth a 2-min check with whoever owns it", "confirm before/while building",
"add if this bites in practice", "assumed handled by the platform". Every one of those phrases
appeared verbatim in a baseline run that shipped the broken design. A design handed off with an
unheld contract is not done — it is the incident, scheduled.

## After the table (cheap, do them in order)

Once contracts are co-located the rest is nearly free — measured: every agent with the table in
view derived these unprompted. Run them as a checklist anyway:

1. **Timeline with budgets** — walk the flow click-to-done; every external call gets a budget that
   fits inside the tightest enclosing deadline, with stated margin.
2. **State × event grid** — for each state, what happens on each event (including: retry of a spent
   token, duplicate delivery, late response arriving after you gave up).
3. **Invariant ledger** — every user action produces an observable outcome within the deadline
   (a "silent" cell is a design bug by inspection); every request is acked, failed, or timed out —
   the three must sum; every side effect is idempotent or deduped.

## Rationalizations (all observed verbatim; all mean STOP)

| Excuse | Reality |
|---|---|
| "Not a blocker, confirm while building" | The unknown decides the design's shape. Confirm-later = the wrong shape ships. |
| "Worth a 2-min check with the owner" | Then the 2-min check happens NOW, or the deliverable says BLOCKED. |
| "Add if it bites in practice" | For deadline/token/retry semantics, "in practice" is a production incident with a swallowed error. |
| "Assumed handled by the platform" | An assumption about an unheld contract is a guess wearing a design decision. |
| "No docs exist, so nothing to fetch" | Then move 1 or 2. No-docs raises the bar; it never lowers it. |

## Scope

Not for single-system refactors, pure functions, or UI-only changes — no foreign contract, no
tabletop. Sibling skills: **warrant** checks claims already drafted; tabletop assembles the
contracts a design's claims will rest on. A finished design that names an unverified contract
assumption is ALSO a warrant trigger (a named-but-unrun check).
