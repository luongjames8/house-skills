# house-skills

**Your AI has probably already done this to you this week: dropped findings to keep an answer
brief, or shipped a number whose label was wrong — and said nothing.** Four drop-in files catch it
in the act, on everyday questions ("fast charger or slow charger?") as much as deep work (a stuck
investigation, a design against an API you don't have docs for). Install in 30 seconds; they fire
themselves when their moment appears.

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

The first demo condenses tests that ship in this repo, rerunnable
(`differential/docs/fixtures/`); the second is an everyday translation of a failure class we
measured on other data — the same label-means-something-else trap as warrant's settlement-clock
fixture and elucidate's mint-match problem, both rerunnable below.

## Install — 30 seconds, Claude Code

```bash
git clone https://github.com/luongjames8/house-skills ~/code/house-skills
mkdir -p ~/.claude/skills
for d in ~/code/house-skills/*/; do
  [ -f "$d/SKILL.md" ] && ln -sfn "$d" ~/.claude/skills/"$(basename "$d")"
done
```

Not on Claude Code, or not technical? Copy the text of any `SKILL.md` into your AI's system prompt
or a Claude Project's custom instructions — the skills are plain instructions; this script just
automates placing them. On Claude Code itself, it loads each skill's `description:` — its trigger
conditions — into every session, and invokes the skill when the moment matches. `/warrant` etc.
works as a manual fallback.

**How often does it fire?** By design, rarely — each trigger carves out what it must NOT fire on,
so the default is silence. tabletop and differential wait for genuinely uncommon moments (a
cross-system design, a stuck investigation); elucidate and warrant fire a few times per
analysis-heavy session, not at all in routine back-and-forth. A firing costs one bounded side-task
— a few model calls, a minute or two. Say so if it fires unwanted; the agent skips it.

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

## The four skills

| Skill | Fires when your AI is… | The failure it prevents | What it does instead |
|---|---|---|---|
| [**elucidate**](elucidate/SKILL.md) | about to brainstorm or analyze | answering the wrong question because a hidden assumption went unexamined | writes the assumptions down first, then thinks in a clean context |
| [**tabletop**](tabletop/SKILL.md) | building on someone else's API, vendor, or data feed | guessing an external system's rules and finding out in production | turns every unread rule into an explicit UNKNOWN that blocks shipping |
| [**differential**](differential/SKILL.md) | stuck — "nothing works", a result nobody can explain | giving up, or latching onto the first plausible cause | lists every possible cause like a doctor, then proves the winner two independent ways |
| [**warrant**](warrant/SKILL.md) | about to hand you a conclusion | shipping a confident claim it never actually checked | has a fresh AI re-derive every claim from raw data — verified answer, or honest UNVERIFIED |

## What it fixes — and what it doesn't (measured, July 2026)

"Don't better models just figure it out?" We tested that directly: same problems, three Claude
tiers (haiku 4.5, sonnet 4.6, opus), bare vs. skill-equipped, graded independently, all rerunnable
from the fixtures in this repo. Small paired trials — treat every count below as a *shape*, written
"X of Y trials," never a bare percentage.

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

In plain words: asked to pick between two offered options, the model picks one instead of asking
whether the question's premise even holds. Charger is one of five such problems (a couch that may
not fit the stairwell, a plant that may be overwatered not under-lit) — the "decision family"
column in the matrix below. A fresh isomorph makes the same point: asked "ride or walk?" about a
bike with two flat tires, sonnet answered "ride" on both trials; the skill fixed it, 2 of 2.

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

Same shape as the churn-ticket demo up top, a label trusted instead of checked. It's the
"frame-import" column in the matrix below — the hardest column on the board.

#### The matrix — eight models, one scheme

Every model below ran the **same 15 problems** under the **same protocol**: bare model vs. the
same model with the skill's distill step, naive prompt, 2 trials per problem per arm, solved only
if the answer both named the hidden issue *and* got the recommendation right, graded by a model
from a different provider family. Columns are fixed problem sets, identical denominators for every
row: decision family (charger, couch, plant, mail, car-wash — /10), famous trick puzzles (dead
cat, kg-vs-lb, sibling count, river — /8), fresh isomorphs of those puzzles (/10), and the
frame-import problem (mint-match — /2). Each cell reads **without → with** the skill. Regenerate
the whole table from the raw result files with `elucidate/eval/tally_master.py`.

One design axis to read the rows by: **who writes the briefing.** The first three Claude rows use
sonnet as the distiller (the harness default, and the production configuration — one strong
distillation feeding a cheaper reasoner); the "(self-distilled)" rows and every non-Claude row
have the model writing its own briefing. Both configurations are measured, so the pipeline effect
is isolated rather than hidden:

| Model | Decision family /10 | Famous puzzles /8 | Fresh isomorphs /10 | Frame-import /2 | Total /30 |
|---|---|---|---|---|---|
| claude haiku 4.5 | 6→10 | 8→8 | 9→10 | 0→2 | **23→30** |
| claude sonnet 4.6 | 6→10 | 8→8 | 7→10 | 0→1 | **21→29** |
| claude opus | 6→9 | 8→8 | 9→10 | 0→0 | **23→27** |
| claude haiku 4.5 (self-distilled) | 6→10 | 8→8 | 9→10 | 0→0 | **23→28** |
| claude opus (self-distilled) | 6→10 | 8→8 | 9→10 | 0→0 | **23→28** |
| deepseek-v4-pro | 1→6 | 6→7 | 6→10 | 0→0 | **13→23** |
| glm-5 | 1→8 | 6→5 | 7→10 | 0→0 | **14→23** |
| qwen3.7-plus | 5→6 | 5→7 | 10→8 | 0→0 | **20→21** |
| kimi-k2.5 | 2→7 | 7→5 | 8→10 | 0→0 | **17→22** |
| MiniMax-M2.5 | 1→4 | 6→6 | 8→8 | 0→0 | **15→18** |

What the self-distilled rows isolate: haiku briefing itself keeps the entire rescue except
mint-match — the one thing sonnet's brain added was the domain-knowledge case. And opus does
slightly *better* on its own briefing (28) than on sonnet's (27): it obeys itself where it argued
with someone else's briefing. The skill's lift is real in every configuration; only the
frame-import solve depends on who does the distilling.

What the matrix says, in words:

- **The decision family is where the skill earns its keep everywhere**: every model improves,
  and the weakest bare reasoners improve most (deepseek 1→6, glm-5 1→8 — vs Claude's 6→10).
- **Famous puzzles need nothing**: every Claude tier is perfect bare; non-Claude models miss a
  few with or without. Don't install this for riddles.
- **Frame-import is the wall**: 0/16 bare across all eight models; with the skill, only Claude
  solves it at all (haiku 2/2, sonnet 1/2, opus 0/2 — opus reasons *around* its own briefing).
  deepseek and sonnet's misses landed the right action for the wrong mechanism — close, not
  credit.
- **The skill is not free**: qwen3.7-plus had the isomorphs 10/10 bare and distilling broke two
  (10→8) — on problems a model already owns, the extra step is noise. Small n throughout: 2
  trials per cell, shapes not verdicts.

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

| Model | Without the skill | With the skill |
|---|---|---|
| haiku 4.5 | 2/2‡ | 2/2† |
| sonnet 4.6 | 0/2§ | 4/4†‖ |
| opus | 2/2‡ | 2/2† |

† pass = a table marking the timing gap UNKNOWN, an ack-first design, and named
MUST-VERIFY-BEFORE-SHIP gates.
‡ suppressed-bare (skill explicitly off): failure did not recur at haiku/opus — both designed
ack-first with unknowns listed, unprompted.
§ 2026-07-10 baseline model tier unrecorded; cross-date bare comparison environment-confounded.
‖ 2 trials asked directly, 2 more self-invoked unprompted.

Suggestive, not settled, that current models have absorbed the basic instinct; what the skill
measurably still buys is the enforced paperwork (the UNKNOWN table, sourced MUST-VERIFY gates)
that makes unknowns reviewable by someone else — the gap between a design that happens to be safe
and one that's provably safe.

### differential — "nothing works," under pressure to keep it short

**The trap:** told to keep the answer brief, the model drops the evidence along with the words.

> A different fixture: a fill-feed field literally named `maker` that actually carries the
> *taker's* address — a mislabel built into this synthetic venue's data on purpose. Asked to
> explain why "rebate income won't reconcile," under a "three bullets max" limit, bare sonnet
> reached the right prose conclusion but silently deleted its entire list of ruled-out causes — 0
> of 2 trials kept it. With the skill: 4 of 4 kept a 13-to-18-row table of every cause considered,
> each marked confirmed or refuted, confirmed the real one two independent ways (the settlement
> calldata and the fee arithmetic), and still fit the three-bullet summary on top.

Same shape as the investigation demo up top; the migration-lock walkthrough below shows a
differential firing end to end:

| Model | Without the skill | With the skill |
|---|---|---|
| haiku 4.5 | 0/2† | 2/2 |
| sonnet 4.6 | 0/2† | 4/4 |
| opus | 0/2† | 2/2 |

† pass = kept the full ruled-out-causes table under the brevity limit. Every suppressed-bare rep
still found the right mechanism two independent ways — only the paper trail was dropped.

Scale fixes the diagnosis, not the reflex that deletes the paper trail — the census failure is
tier-invariant.

### warrant — the number is right, the label is the lie

**The trap:** a claim about *what a number means* slides through unchecked because computing it
looked like a simple lookup.

> Asked casually for a trader's "median reaction speed," the gaps between his two trade legs
> (across 8 trade pairs) were 0, 0, 2, 2, 2, 4, 4, and 6 seconds — every one an exact multiple of 2.
> Without the skill firing, every trial shipped *"median reaction speed: 2 seconds"* — the
> arithmetic is correct, the claim is not: those timestamps are snapped to a coarse settlement
> clock and can't measure reaction time at all. With the skill, every trial refused the label,
> named the clock-quantization pattern, and said what data could actually answer the question.

| Model | Without the skill | With the skill |
|---|---|---|
| haiku 4.5 | 2/2‡ | 2/2† |
| sonnet 4.6 | 0/2 | 2/2† |
| opus | 0/2 | 2/2† |

† pass = refused the "reaction speed" label and named the clock-quantization signature instead of
shipping it.
‡ haiku bare refused the label unprompted — passed without the skill.

An earlier same-fixture rerun (pre-sanitized schema) found sonnet 0/4 without a directed or
self-fired invocation, 4/4 once directed or self-fired after the trigger-wording fix — see "The
honest edges" below. Not a capability gradient: the two stronger tiers answered exactly as asked;
the weakest one hedged correctly on its own.

### Where bare models already win — you don't need this

In plain words: even with zero help, models already nail famous trick puzzles (the already-dead
cat in the box, comparing 1 kg of cotton to 1 lb of lead) and freshly written variants no training
set has seen — see the "Famous puzzles" column in the matrix above: every Claude tier is 8/8
bare. If your use of AI is Q&A over well-known gotchas, current models already handle it, and we
say so rather than sell you the skill for it.

### The honest edges

Two things this skill set can't do. It can't invent a fact that's nowhere in your material: on 7
real cases where the missing constraint lived only in someone's head (an undocumented ledger unit,
a simulator's unstated bias), skill and bare model solved the exact same trials (run 5,
[`elucidate/docs/experiment-results.md`](elucidate/docs/experiment-results.md)) — that needs the
document stating the constraint, a different job than this one:

| | Trials solved |
|---|---|
| Without the skill | 6/13 |
| With the skill | 6/13 |

And an installed skill can fire on its own recognition, which cuts both ways: tabletop and
differential self-invoked off their own trigger wording during tests meant to be "bare," 2/2
each — no clean unprompted baseline exists on a machine where they're already installed.
warrant's trigger didn't, at first (0/2, then 0/2 again) until one added line — "be direct"
shortens the prose, never the verification — made it self-fire 2/2 on the same prompt. Every
number on this page is rerunnable: elucidate's from `elucidate/eval/`, the rest from each skill's
`docs/fixtures/RECEIPTS.md`.

## What it looks like when one fires

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

You see the extra reasoning in the reply; you don't manage it — say so if a skill fires unwanted
and the agent drops it. The skill bodies are plain process text (Claude Code is just the worked
example beside a generic equivalent; "fresh subagent" means a zero-history model call). Two pieces
need no LLM at all: warrant's `VERIFICATION:` receipt is a one-line grep gate for CI, and
tabletop's contract table works as a design-review template for humans.

---

## Why you can trust it

- **Every rule exists because of a real incident** in a production AI-agent operation — reproduced
  with a baseline agent first (watch it fail), then fixed with the smallest change that makes the
  same scenario pass, the red-then-green loop borrowed from test-driven development.
- **The evidence ships.** Each skill's synthetic test data and per-run results are in its
  `docs/fixtures/RECEIPTS.md` — you can rerun them. An adversarial reviewer recomputed every number
  independently and they held, before this was published.
- **Rejected rules are published too.** Proposals that couldn't be made to fail a test were
  recorded as negative results instead of shipped ([`warrant/docs/`](warrant/docs/)) — read those
  to judge this repo.
- **Honest limits, stated:** small paired tests, not big-n studies; elucidate's graded eval now
  spans a three-tier Claude matrix and a four-model cross-provider sweep; every skill says what
  it's *not* for.

## Genesis

Real production work, not a whiteboard: an operator running a fleet of AI agents on high-stakes
analysis kept catching them fooling themselves the same few ways — four of those catches became
these four skills, each SKILL.md opening with its incident. The name nods to TV diagnostician
House: everybody lies, so the causes go on the whiteboard and you run the tests before you treat.

## The idea underneath

Models only reliably act on what's written in front of them; anything left unstated gets used less
as a session grows. Every skill is the same move on a different target: **write the unstated thing
down, and hand it to a fresh reader.** A fresh reader catches what a deep-in-it author can't, and a
table with a completeness rule survives pressure that makes prose quietly shed its contents.
