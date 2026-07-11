# house-skills

**Four drop-in files that make your AI catch itself before it hands you a confident wrong answer.**
Install in 30 seconds; they fire themselves; they work for any analysis, not just code.

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
  eval (0.60 → 0.90 on hidden-constraint decisions, small n); every skill says what it's *not*
  for.

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
