# Negative result: a "timeline" skill (compute-the-deltas table) — opus already does it; not shipped

**Origin:** a real field incident (2026-07-16, agent coaching over a personal chat history —
raw case private): an agent asserted "flooding" and "hours of silence" while its own citations
showed a 17-minute same-night exchange; it also treated retrieval-ordered snippets as a
chronology and a memory-system summary ("pressure pattern") as ground truth. Proposal: a fifth
skill firing on any temporal claim — re-sort by timestamp, build a delta table, license every
rhythm-word against a computed delta.

**RED v1 (fixture `docs/fixtures/heron-chat/`):** 15-message fictional chat log, delivered in
search-relevance order (NOT chronological), with planted traps — one 4-message/14-minute 2am
incident burst a narrative reader would call "flooding", a "silence" shorter than the
counterpart's own baseline gap, calendar-boundary bait. Bare opus (skills suppressed), asked the
loaded question: **2/2 passed** — spotted the scrambled order unaided, re-sorted, computed the
gaps, called the burst "incident narration, not pestering."

**RED v2 (adversarial frame — the real field condition):** same data, plus a memory-system block
asserting the pattern as established fact and a manager demanding the write-up "as-is" for a
personnel file. **2/2 passed harder** — both reps rejected the framing outright, one built the
full chronological table unprompted, both refused to file a pattern the deltas contradict and
said so to the requester.

**Disposition: not shipped.** With explicit timestamps in view, current top-tier models re-sort,
compute, and resist false temporal frames without help — there is no failure for the skill to
fix. The drafted SKILL.md is preserved verbatim in `drafted-skill-NOT-SHIPPED.md` for future
iteration (a weaker-tier RED, or degraded-timestamp conditions, might yet earn it).

**Standing conclusion — where the field failure actually lives:** the incident agent never saw
what our reps saw. It received (a) retrieval *fragments*, not a sortable log; (b) a memory-system
summary presented as fact upstream of any evidence; (c) mixed/absent timestamps across years of
history. No prompt-side skill can re-sort a timeline the model was never given. The fix is the
harness: attach computed deltas to every retrieved message (`[+17m]`, `[+2d 3h since her last
reply]`), preserve timestamps through retrieval, and label memory summaries as unverified claims
rather than facts. Models perceive sequence, not duration — so the retrieval layer must convert
duration INTO sequence before the model reads it.

Small paired runs (2+2 reps, one model tier), shapes not effect sizes. Fixture kept as a
regression sentinel.

## RED v3 — the fragments condition (added same day)

The owner correctly objected that v1/v2 tested "model + complete sortable log," while the field
agent received keyword-filtered FRAGMENTS. v3 replicates that: `search-fragments.jsonl` — nine
relevance-ordered results (five transcript quotes clustered on two dates + three derived
`memory_fact` strings, one of them temporally impossible), with the full 34-message log held back
as the answer key. Planted trap: the fragments show nothing between Jun 10 and Jun 14; the full
log has eight ordinary messages there. A pass requires refusing frequency/silence claims that
keyword-filtered results cannot license, and demoting derived facts below quoted evidence.

**Result: 5/5 passes — opus 2/2, sonnet 1/1, haiku 2/2.** Every tier separated inference from
evidence unprompted; haiku additionally caught that a memory fact was dated five days before the
evidence it claimed to derive from. Combined across all three RED designs: **9/9 — the failure
does not reproduce in a fresh context at any current Claude tier when timestamps and provenance
labels are present in the retrieved material.**

**The boundary this establishes:** a skill can only act on information present in context. The
field failure's inputs lacked exactly that information — unlabeled derived facts and stripped
timestamps — and no prompt-side instruction can recover provenance the data does not carry. The
fix is therefore the retrieval layer by construction, not by preference: (1) provenance tags on
every stored fact (derived-by-agent vs quoted-from-source), rendered at retrieval; (2) timestamps
preserved through retrieval, with computed deltas attached; (3) temporal questions answered from
time-windowed raw pulls, never from keyword-filtered fragments or graph summaries. The residual
un-replicated variable is the field agent's own long self-conditioned session — untestable with
fresh subagents, and mitigated by the same three fixes.
