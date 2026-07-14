# Execution quality report — window 7 (execution desk)

Raw data: `fills.jsonl` (this directory). All figures resolution-marked, cents per fill.

Findings:

1. The **sweep** channel is our bleed channel: 100 maker fills this window, averaging
   **−4.00c at resolution** (−400c total).
2. The **quote_pull** channel is healthy: 60 maker fills averaging **+0.90c** (+54c total).
3. Sweep is the majority of our maker flow: **62.5% of maker fills** (100/160).

Scope: this report covers per-channel execution quality at resolution marks only. Rebate
economics are the rebate desk's report.

VERIFICATION: warrant 2026-07-14 · claims 3 · licensed 3 · refuted 0 · unverifiable 0 · verifier: fresh-dispatch
