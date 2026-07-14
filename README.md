# house-skills

**Four drop-in files that make your AI catch itself before it hands you a confident wrong answer —
on everyday questions as much as deep work.**
Install in 30 seconds; they fire themselves when their moment appears. This is for thinking
clearly, autonomously: a casual "what's his reaction time?" in chat, a "fast charger or slow
charger?" decision, a stuck investigation, a design against an API you don't have docs for — not
just code, and not just big analyses.

Because here's the failure they're built for:

Not because the model is weak — because nothing makes it *check*. It reads a column named `maker`
and assumes that's what the column means. You say "keep it brief" and it silently deletes seven of
its ten findings. It hits a dead end and reports "nothing works" instead of finding out why. It
designs against an API whose rules it never read.

house-skills is four instruction files. Each is a Claude Code *skill* — a markdown file whose
header states when it should fire — and the text works in any AI that can read a file. Together they make
your AI **catch itself at the four moments it is most likely to fool you.** They load once and
fire themselves — no commands to learn. And they are not just for code: they work anywhere an AI
reads evidence and tells you what it means — research, data analysis, strategy memos, incident
reviews, due diligence, engineering.

## Sixty-second demo

**You: "Summarize the investigation — just the top 3 findings."**

- *Without:* three tidy bullets. Findings 4–10 — including the one that would have changed your
  decision — are gone, and nothing tells you they existed. (In both of our test runs, the
  baseline AI silently dropped its entire findings table under exactly this request.)
- *With:* the same three tidy bullets — and the full findings table underneath, every item marked
  confirmed, refuted, or untested. **Brevity compresses the story, never the evidence.**

**You: "Which support tickets are churn risks? Here's the export."**

- *Without:* "Tickets tagged `urgent` are your churn risks — prioritize those." Confident,
  actionable, wrong: `urgent` is the tag agents click to *speed up their own queue*, not a
  customer-sentiment signal. The column name lied and the AI believed it.
- *With:* a second, fresh AI re-derives the claim from the raw export first, notices `urgent` was
  set by staff not customers, and flags that the label **doesn't mean what the analysis assumed** —
  before it reaches your deck.

Both demos condense tests we actually ran; the synthetic data and results ship in this repo
(`warrant/docs/fixtures/`, `differential/docs/fixtures/`), rerunnable.

## The four skills

| Skill | Fires when your AI is… | The failure it prevents | What it does instead |
|---|---|---|---|
| [**elucidate**](elucidate/SKILL.md) | about to brainstorm or analyze | answering the wrong question because a hidden assumption went unexamined | writes the assumptions down first, then thinks in a clean context |
| [**tabletop**](tabletop/SKILL.md) | building on someone else's API, vendor, or data feed | guessing an external system's rules and finding out in production | turns every unread rule into an explicit UNKNOWN that blocks shipping |
| [**differential**](differential/SKILL.md) | stuck — "nothing works", a result nobody can explain | giving up, or latching onto the first plausible cause | lists every possible cause like a doctor, then proves the winner two independent ways |
| [**warrant**](warrant/SKILL.md) | about to hand you a conclusion | shipping a confident claim it never actually checked | has a fresh AI re-derive every claim from raw data — verified answer, or honest UNVERIFIED |

## What it fixes — and what it doesn't (measured, July 2026)

"Don't better models just figure it out?" We tested that directly: the same problems, three Claude
tiers (haiku 4.5, sonnet 4.6, opus), bare model vs. the same model with the skill, graded
independently, everything rerunnable from the fixtures in this repo. These are small paired
trials — a handful of runs per condition — so treat the numbers as *shapes*, not precise rates. Every
count below is written as "X of Y trials," never a bare percentage, so you can see exactly what ran.

### elucidate — decisions hiding a blocker, and numbers read in the wrong frame

#### Hidden prerequisite

**The trap:** the question offers two options, but a fact already on the table makes both of them
beside the point.

> Asked "fast charger or slow charger?" about an outlet stated to be blocked by a cabinet nobody
> can move: sonnet and opus both answered "Use the slow charger," on both trials; haiku said
> "fast" once and "slow" once. Every tier picked a charger speed for an outlet nobody can reach.
> With the skill, every tier gave a version of opus's answer: *"Neither charger matters yet —
> outlet access is the real blocker. Solve access first: extension cord, different outlet, or help
> moving the cabinet."*

That charger question is one of five "hidden prerequisite" problems (a couch that may not fit the
stairwell, a plant that may be overwatered rather than under-lit). Every tier failed the same two
problems bare, then the skill fixed them:

| Model | Bare (no skill) | With the skill |
|---|---|---|
| haiku 4.5 | 6/10 correct | 10/10 |
| sonnet 4.6 | 6/10 correct | 10/10 |
| opus | 6/10 correct | 9/10 |

(5 problems × 2 trials each = 10 trials per model. "Correct" = named the real blocker instead of
picking a side.)

A related isomorph on fresh material makes the same point: asked "ride or walk?" about a bike with
two flat tires, sonnet answered "ride" — the wrong call, since a fully flat tire can't be ridden —
on both trials; the skill fixed it, 2 of 2.

#### Frame-import — a number read in someone else's frame

**The trap:** a fact framed as safe by one party isn't safe for you just because they said so.

A mint mechanic crosses an UP leg against a DOWN leg in one trade; the venue tags both legs
"maker" and rebate-eligible because together the pair is fully collateralized — riskless for the
venue. (maker = the resting order that supplies liquidity and earns a rebate; taker = the order
that crosses it and pays a fee.) But the mint hands OUR desk only one of the two legs — a real
directional bet — and the trader who took the other leg tends to be the informed side, holding the
eventual winner. "Riskless for the venue" quietly got read as "riskless for us":

> *"Classify mint_match fills as benign maker liquidity (good flow)"* — bare haiku, both trials,
> booking a directional bet as safe. With the skill: *"Do not book mint_match as uniformly 'good
> flow' ... that's the venue's crossing-mechanics frame, not our risk frame,"* correctly splitting
> the exposure, 2 of 2 trials.

(Haiku only, frame-import case derived from a real production incident: 0/2 bare → 2/2 with the
skill.)

### tabletop — designing against a vendor whose contract you don't actually hold

**The trap:** an unread rule gets waved through as "confirm while building," not treated as a
blocker.

> A chat platform invalidates a button's callback token if your server doesn't answer within
> 2500 ms; the internal policy check that flow depends on has a documented p99 of 3.8 seconds
> under load — and load spikes exactly when the flow is busiest. Without the skill, the design
> shipped code that just waits inside that 2500 ms window with no bound on how long, and wrote
> off the mismatch as "confirm while building — not a blocker": 0 of 2 trials caught it. With the
> skill: 4 of 4 produced a table marking the timing gap UNKNOWN, an ack-first design that answers
> within budget regardless of how long the policy check takes, and a named checklist of what must
> be verified before shipping.

(Sonnet only. Bare: 0/2, 2026-07-10. With the skill: 4/4, 2026-07-15 — 2 trials where it was asked
for directly, 2 more where the agent recognized the situation from the skill's own description and
used it unprompted.)

### differential — "nothing works," under pressure to keep it short

**The trap:** told to keep the answer brief, the model drops the evidence along with the words.

> A different fixture: a fill-feed field literally named `maker` that actually carries the
> *taker's* address — a mislabel built into this synthetic venue's data on purpose. Asked to
> explain why "rebate income won't reconcile," under a "three bullets max" limit, bare sonnet
> reached the right prose conclusion but silently deleted its entire list of ruled-out causes — 0
> of 2 trials kept it. With the skill: 4 of 4 kept a 13-to-18-row table of every cause considered,
> each marked confirmed or refuted, confirmed the real one two independent ways (the settlement
> calldata and the fee arithmetic), and still fit the three-bullet summary on top.

(Sonnet only. Bare: 0/2 kept the analysis, 2026-07-11. With the skill: 4/4, 2026-07-15.)

### warrant — the number is right, the label is the lie

**The trap:** a claim about *what a number means* slides through unchecked because computing it
looked like a simple lookup.

> Asked casually for a trader's "median reaction speed," the gaps between his two trade legs
> (across 8 trade pairs) were 0, 0, 2, 2, 2, 4, 4, and 6 seconds — every one an exact multiple of
> 2. Without the skill firing,
> every trial shipped *"median reaction speed: 2 seconds"* — the arithmetic is correct, the claim
> is not: those timestamps are snapped to a coarse settlement clock and can't measure reaction time
> at all. With the skill, every trial refused the label, named the clock-quantization pattern, and
> said what data could actually answer the question.

(Sonnet only. Without the skill firing: 0/4 refused the label. With the skill: 4/4 refused.)

### Where bare models already win — you don't need this

Famous trick puzzles (the already-dead cat in the box, comparing 1 kg of cotton to 1 lb of
lead) *and* freshly written variants no training set has seen:

| Model | Bare (no skill) | With the skill |
|---|---|---|
| haiku 4.5 | 16/16 correct | 16/16 |
| sonnet 4.6 | 15/16 correct | 16/16 |

(8 problems × 2 trials each = 16 trials per model — 4 famous puzzles, 4 fresh variants of the same
templates. The flat-tire prerequisite problem above is deliberately excluded here: it's a
hidden-prerequisite decision, not a trick-puzzle template, and sonnet failed it bare.) If your use
of AI is Q&A over well-known gotchas, current models already handle it — this table exists so
that's on the record, not hidden.

### Where no prompt-side skill is enough

Some constraints live only in your head, never in anything you handed the model — a company's
undocumented ledger units, a simulator's unstated bias. On seven real (anonymized) cases like this,
the bare model and the skill-equipped model solved the exact same 6 of 13 trials — the skill moved
nothing. The fix isn't a better prompt; it's handing the model the document that actually states
the constraint, which is a different job than these skills do. Tracked as future work in
[`elucidate/docs/experiment-results.md`](elucidate/docs/experiment-results.md) (run 5).

### Installed skills fire themselves — sometimes without being asked

On a machine with house-skills already installed, tabletop and differential fired themselves during
what were meant to be "bare" (no-skill) test runs: the agent recognized "no docs" or "nothing
works" straight from the skill's own trigger description and used it unprompted, 2 of 2 times each.

warrant's didn't (0 of 2) — its old trigger was written for "a deliverable about to ship," and a
casual chat question plus "be direct" slipped past it. We rewrote the trigger and tested the fix
the same way the skills test everything: version 1 still didn't fire (0/2), version 2 didn't
either (0/2), version 3 — which states plainly that "be direct" shortens the explanation, never
the check — fired 2 of 2 on the same prompt. Everyday phrasing turned out to be a first-class
trigger; the full history is in warrant's receipts.

Every number above is rerunnable: elucidate's from `elucidate/eval/`, the rest from each skill's
`docs/fixtures/`. Full run-by-run detail in
[`elucidate/docs/experiment-results.md`](elucidate/docs/experiment-results.md) and the RECEIPTS
file in each skill's `docs/fixtures/` directory.

## Install — 30 seconds, Claude Code

```bash
git clone https://github.com/luongjames8/house-skills ~/code/house-skills
mkdir -p ~/.claude/skills
for d in ~/code/house-skills/*/; do
  [ -f "$d/SKILL.md" ] && ln -sfn "$d" ~/.claude/skills/"$(basename "$d")"
done
```

Done. The mechanism: Claude Code loads each skill's `description:` — its trigger conditions —
into every session, and the agent invokes the skill when the moment matches. `/warrant` etc.
works as a manual fallback.

**How often does it fire?** By design, rarely: each skill's trigger carves out what it must NOT
fire on, so the default is silence. tabletop and differential wait for genuinely uncommon moments
(a cross-system design, a stuck investigation — days can pass without one). elucidate and warrant
fire a few times per analysis-heavy session and not at all in routine back-and-forth. A firing
costs one bounded side-task — a few model calls, a minute or two — not a re-run of your session.
If a skill fires when you didn't want it, say so; the agent skips it.

### Try it yourself in 2 minutes

The tests in this repo are real files you can rerun. Point your agent at one and watch the skill work:

```
# in a fresh Claude Code session, from the repo root:
Read warrant/docs/fixtures/settlement-clock-trades.json and tell me this trader's median
reaction speed between his two legs.
```

A bare agent answers "~2 seconds." A warrant-equipped one re-derives it from the raw file, notices
every gap is an identical rounded interval — the timestamps were snapped to a coarse tick, so they
can't measure anything finer — and tells you the data *cannot* answer the question as asked. Same
file, both outcomes, on your own screen.

### What it looks like when one fires

Nothing to invoke — it just happens inline. You ask a normal question; the agent notices the
moment, runs the check, and folds the result into its answer:

```
You:  Write up why the migration keeps failing — you've got the logs.

AI:   [differential fires — "keeps failing / nobody can explain" is its trigger]
      Before concluding, ruling out every cause a failure like this can have:
      · connection-pool exhaustion  — refuted (pool never above 40%)
      · migration lock contention   — CONFIRMED (two runners held the lock; logs + pg_locks agree)
      · disk / OOM                   — refuted (headroom throughout)
      · schema drift                 — untested (no staging snapshot)
      Root cause: lock contention. One untested branch flagged, not hidden.
```

You see the extra reasoning in the reply; you don't manage it. If a skill fires when you didn't
want it, say so and the agent drops it.

**Not on Claude Code?** The skill bodies are plain process text — in three of the four, Claude
Code appears only as the worked example beside the generic equivalent. Paste them into any system
prompt, pipeline node, or agent instruction; "fresh subagent" just means a zero-history model
call. Two pieces need no LLM at all: warrant's `VERIFICATION:` receipt is a one-line grep gate
for CI, and tabletop's contract table works as a design-review template for humans.

---

## Why you can trust it

- **Every rule exists because of a real incident** in a production AI-agent operation — the
  failure was first reproduced with a baseline agent (watch it fail), then the rule was written as
  the smallest change that makes the same scenario pass — the red-then-green loop borrowed from
  test-driven development.
- **The evidence ships.** Each skill's synthetic test data and per-run results are in its
  `docs/fixtures/RECEIPTS.md` — you can rerun them. An adversarial reviewer recomputed every number
  independently and they held, before this was published.
- **Rejected rules are published too.** Proposals that couldn't be made to fail a test were
  recorded as negative results instead of shipped ([`warrant/docs/`](warrant/docs/)). If you read
  one thing to judge this repo, read those.
- **Honest limits, stated:** small paired tests, not big-n studies; elucidate has the only graded
  eval (six runs: the 0.60 → 0.90 rescue, a three-tier model matrix, contamination controls, and
  two classes recorded as *not* needing the skill); every skill says what it's *not* for.

## Genesis

Real production work, not a whiteboard: an operator running a fleet of AI agents on high-stakes
analysis kept catching them fooling themselves the same few ways. The name is a nod to the TV
diagnostician House — everybody lies (especially your own working notes), the possible causes go
on the whiteboard, and you run the tests before you treat. Four of those catches became these
four skills; each SKILL.md opens with its incident.

## The idea underneath

Models only reliably act on what's written in front of them; anything left unstated gets used
sometimes, and less as the session grows. So every skill is the same move on a different target:
**write the unstated thing down, and give it to a fresh reader.** A fresh reader catches what a
deep-in-it author can't, and a table with a completeness rule survives pressure that makes prose
silently shed its contents.
