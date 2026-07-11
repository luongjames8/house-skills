# Negative result: latent-dimension collapse needs no checklist — warrant already catches it

**Proposal (a live analysis session, 2026-07-11):** after a live incident (two-leg set analysis computed per-leg
edge vs each leg's own concurrent mid, flattening the time dimension and hiding ~$2k of gap drift
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

**Incident (live analysis session):** set-assembly analysis computed parity edge over MATCHED pairs only;
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
