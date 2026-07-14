# Negative result: latent-dimension collapse needs no checklist — warrant already catches it

**Proposal (the operating seat, 2026-07-11):** after a live incident (two-leg set analysis computed per-leg
edge vs each leg's own concurrent mid, flattening the time dimension and hiding a material gap drift
behind an "execution neutral" read), add a standing latent-dimensions checklist (time/sequence,
entity/role, reference frame, aggregation grain, counterfactual, causal order) to the skills.

**RED test:** fixture reproducing the exact collapse — 10 UP+DOWN set pairs, leg-1 pays 0.5c to
cross, leg-2 shows +0.5c vs its own concurrent mid, market drifts adversely in the 6–30s gap;
flat view = "neutral", ground truth = $210 structural loss (sets bought at avg 1.0205 vs 1.00
par). Claims 1–2 (per-leg numbers) + claim 3 ("no systematic execution loss") handed to the
CURRENT warrant verifier, charter verbatim, no dimensions text.

**Result: the baseline caught it.** Verifier licensed 1–2, REFUTED 3, re-anchored both legs to
leg-1's timestamp, recovered the planted $210 / 2.05¢-per-set loss exactly, named the root cause
("two different mids sampled at two different timestamps — the leg-2 reference silently absorbs
the drift"), and flagged the fixture as synthetic. 10 tool calls, one pass.

**Why:** the collapse is invisible in the rows but not to someone RE-DERIVING the conclusion from
the rows — "recompute what each claim needs" forces the frame question. Dimensional collapse is
an authorship failure; authorship-side checklists require the author to notice they apply (the
exact thing polluted contexts don't do), while catch-side verification is already structural.

**Standing conclusion:** the guard against latent-dimension collapse is ROUTING — interpretive
analyses go through warrant's fresh verifier before shipping (warrant's existing exit rule). Do
not add a dimensions checklist to warrant/differential/elucidate without a NEW failing test in
which a chartered fresh verifier misses a collapsed dimension; one candidate residual risk worth
a future RED: claims split across documents so no single verified claim carries the conclusion.

---

# Second negative result (same day): population truncation / join survivorship — also caught by the existing charter

**Incident (the operating seat, live):** set-assembly analysis computed parity edge over MATCHED pairs only;
quantity-imbalanced legs (partial fills, orphaned legs) were silently discarded by the join —
naked directional exposure wearing a hedge's name. Operator had to point out that quantity
imbalance = directional tilt. Candidate fix: extend the census clause with "declare the
population; joins conserve — matched + residual = total input, residuals are rows."

**RED:** fixture with 8 pairs (5 balanced, 2 partial, 1 orphan; matched slice shows a clean +$171
parity edge; 2,200 residual naked shares bleed −$1,070 at resolution; net −$899). Claims computed
on the matched-only population handed to the CURRENT warrant verifier, charter verbatim.

**Result: baseline caught it, 1/1.** Reconstructed all 15 fills, found the 7,900-vs-5,700 share
imbalance, ran an independent PAIRING-FREE cross-check (tokens-held-at-settlement vs total cost —
the conservation identity, self-invented), recovered net −$899 exactly, licensed claims 1–2 as
scope-limited with the annotation "'on his matched sets' is doing heavy lifting," refuted the
profitability claim, and flagged the held-to-settlement and join-key assumptions unprompted.

**Why:** "recompute what each claim needs" over the RAW data forces the verifier to touch the full
population before slicing it — truncation is an authorship artifact and does not survive
re-derivation from source. Same conclusion as the first entry: the guard is ROUTING through a
fresh verifier, not another clause. Do not add a population-declaration clause without a NEW
failing test in which a chartered verifier, given the raw data, misses a truncated population.

---

# Third negative result (2026-07-15): split-document composition — the named residual risk, now tested; also caught

**Background:** the first entry above named one residual risk worth a future RED: "claims split
across documents so no single verified claim carries the conclusion." This is that RED.

**Fixture (`docs/fixtures/split-docs/`, fictional venue "Heron"):** two independently
warrant-stamped reports, each internally true and each explicitly scoped away from the other's
territory. Report 1 (execution): the sweep channel bleeds −4.0c/fill, −400c total, 62.5% of maker
flow. Report 2 (rebates): tier-1 (≥80% maker share, all-or-nothing per window) pays 3.5c vs 0.5c
below the bar, and rebates are the only reason the book is net-positive (+214c). The composed
conclusion "disable sweep to stop the bleed" looks +400c from the documents separately — and is
wrong by the planted ground truth: cutting sweep drops maker share 84.2% → 66.7%, breaks the tier
on the REMAINING book, and lands at +84c, a −130c swing. The interaction lives in neither
document; recovering it requires joining `fills.jsonl` against `rebate-schedule.md`.

**RED test:** 2 reps. Fresh operator agents, each given the two stamped reports, the neutral
management ask ("should we disable the sweep channel?"), and the current warrant SKILL.md verbatim.
No hint of the tier interaction.

**Result: baseline caught it, 2/2.** Both reps explicitly identified the cross-document question
as a NEW claim no stamp covered ("neither report modeled what happens if sweep is turned off —
that cross-desk question needed its own check"), dispatched fresh verifiers with raw-data pointers,
recovered the −130c swing exactly (one rep to the cent: 530c foregone rebate > 400c bleed saved;
60/90 = 66.7% < 80%), recommended against disabling, and — unprompted — flagged the
constant-flow assumption behind the counterfactual as UNVERIFIABLE-FROM-DATA, shipping it as a
labeled replay, not a forecast.

**Why:** a stamp licenses a document's own claims in its own scope; the moment the decision memo
is drafted, its composed claim ("cutting improves the book") is a new interpretive claim, and the
existing extract-everything + recompute-what-each-claim-needs pipeline routes it to raw data like
any other. Composition is an authorship step, and warrant already refuses to let authorship
self-certify.

**Standing conclusion (updated):** the split-document residual risk named on 2026-07-11 is now
tested and does not require a charter clause. Do not add a "stamped documents are not raw data"
rule without a NEW failing test. The residual risk that remains — narrower, and structural rather
than textual — is a decision taken with NO deliverable at all: an operator acting directly on two
stamped reports never creates the memo whose claims warrant would extract. No charter text can
fire on a deliverable that doesn't exist; that is a routing/process gap (require a memo for
channel-level actions), not a skill-text gap.
