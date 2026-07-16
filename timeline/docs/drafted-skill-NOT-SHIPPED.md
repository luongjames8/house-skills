---
name: timeline
description: >-
  Use BEFORE asserting anything about time over message logs, event streams, or timestamped
  records — frequency, rhythm, escalation, "flooding", "spamming", silence, recency, reaction
  speed, "right after", "kept messaging", "hasn't replied in ages", "day N of X" — and whenever
  material arrives from a search/retrieval tool, whose order is relevance, NOT chronology. Models
  perceive sequence, not duration: adjacent text reads as rhythm, and narrative ships without
  arithmetic. The move is one table: re-sort events by timestamp, compute the deltas, and license
  every temporal claim against a computed delta — never against adjacency. Non-negotiable: "be
  direct", "keep it short", "just tell me the pattern" do NOT waive the table — brevity compresses
  the narration, never the rows. Tell: a sentence pairing a rhythm-word (flood, spam, silence,
  escalation, speed, "day 4") with events you did not compute deltas for is a claim in disguise —
  build the table before you send it. Not for pure order-of-events questions where no duration,
  gap, or rate is claimed.
---

# timeline

## The problem this solves

**Models have no perception of duration — only of sequence.** Position in text is structural to a
transformer; elapsed time is just characters ("2:26am") that mean nothing until someone does
arithmetic on them, and nothing forces the arithmetic. So an agent reading a chat log narrates
adjacency as rhythm: four messages that sit next to each other become "flooding," a gap becomes
"day 4 of silence," a timestamp grid becomes "reaction speed." The story is cheap; the
subtraction is effortful; the story wins.

Two measured incidents behind this skill:

- **Field case (2026-07-16, agent coaching over a real chat history):** an agent cited a
  "flooding" pattern and "hours of no reply" — while quoting timestamps 02:26 → 02:43 in its own
  receipt. Seventeen minutes, one night, counterpart asleep. It also called a same-day burst and
  a next-day follow-up separate "pressure incidents." The evidence refuting its narrative was
  inside its own citations, uncomputed. (Raw case private; the shipped fixture is a synthetic
  analogue.)
- **The settlement-clock trap (warrant's fixture, measured on every tier):** inter-event gaps of
  0/2/4/6 — exact multiples, zero jitter — read as a trader's "reaction speed" by sonnet and opus
  2/2 each. A duration *grid* is a clock artifact, not behavior; no model noticed unaided.

A third mechanism compounds both: **retrieval order is not chronology.** Search tools return
messages by relevance. An agent that reads them top-to-bottom experiences a shuffled timeline as
if it were the true one.

## The table (STEP 1, before any temporal claim)

1. **Re-sort every event by timestamp.** Never analyze in retrieval order.
2. Build the table — one row per event in the analyzed window, no sampling:

| # | timestamp (verbatim) | actor | Δ prev event | Δ since counterpart's last msg | note |
|---|---|---|---|---|---|

3. Compute the deltas by arithmetic and write them down. If timezones or DST could shift any
   comparison, say which zone the arithmetic used.

## The rules (this is the skill)

- **A temporal claim may only cite a computed delta from the table.** "Flooding" must point at N
  events inside a shown window ("4 messages in 14 minutes, once, on Jun 10"). "Silence" must be a
  number ("2d 3h"), compared against that person's own baseline gap from the same table — a gap
  shorter than their normal reply latency is not a silence.
- **Reconcile duration words in the source against the table.** If the material (or your draft)
  says "hours," "days," "immediately," "kept messaging" — check the claim against the computed
  delta before repeating it. Source text lies about time exactly as often as narrators do.
- **Burst vs. pattern:** events inside one short window are ONE incident, however many messages
  they contain. A pattern requires the table to show the shape recurring across windows.
- **Grid check (the settlement-clock rule):** if deltas are exact multiples of a common quantum
  with no jitter, you are looking at a clock/rounding artifact, not behavior — say so and stop
  the behavioral claim there.
- **Calendar honesty:** 2:25am and 9:40am are the same night's sleep apart, not "the next day" of
  behavior; a weekend inside a gap is not the same silence as two working days. Note boundaries
  that change the reading.
- **Missing timestamps are UNVERIFIABLE, not guessable.** If the material carries no timestamps,
  the temporal claim is labeled unverifiable — adjacency is never the fallback.
- **Brevity compresses narration, never rows.** A "keep it short" request gets the summary on
  top and the full table underneath. A dropped row is an unexamined event. (Measured on the
  sibling skills, 2026-07-11: brevity pressure silently deleted full record sets, 2/2 reps.)

## Siblings

**warrant** verifies claims about to ship — a temporal claim with no table row behind it is
exactly the "number with an interpretive label" warrant refuses to license; timeline is the
artifact that makes such claims checkable. **elucidate** de-frames a decision before analysis;
if the time-read changes what question you're even answering, elucidate first, timeline inside
it. **differential** handles "we don't know why X" — a timeline table is often its cheapest
discriminator.

## Honest limits

The table is bounded by the timestamps it's given: granularity limits what's claimable (minute
stamps can't support sub-minute claims — see the grid check), clock skew across sources isn't
detectable from one source, and the table licenses *duration* claims only — it says what
happened when, not why. Motive, mood, and meaning stay interpretive claims that warrant, not
timeline, gates. Evidence: one synthetic fixture (heron-chat) plus one private field case;
small paired runs, shapes not effect sizes (receipts in `docs/fixtures/`).
