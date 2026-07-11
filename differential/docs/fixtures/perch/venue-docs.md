# Perch CLOB — event + fee reference (excerpts)
## Fees
Fees are charged to the TAKER only, 2% of notional, deducted at fill time and recorded in the fill's `fee` field on the taker's leg. Makers pay no fees; maker rebates are credited via the daily rebate ledger (see rebates feed), never on fills.
## Events
OrderFilled(maker, taker, side, price, size, fee) — emitted once per fill LEG.
## Settlement
All matches settle through PerchSettlement.matchOrders(takerOrder, makerOrders[]) on-chain; calldata is public.
