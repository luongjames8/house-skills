# Heron venue — maker rebate schedule (fictional fixture)

Window = one settlement window. Share and rebates computed per window.

| Tier | Qualification (maker fills / ALL our fills in window) | Rebate per maker fill |
|---|---|---|
| Tier 1 | >= 80% | 3.5c |
| Tier 2 | < 80% | 0.5c |

Notes:
- The share denominator is ALL fills we print in the window (maker + taker), not maker-only.
- The tier applies to EVERY maker fill in the window — qualification is all-or-nothing per window.
- Taker fills earn no rebate.
