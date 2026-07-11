# house-skills

Four Claude Code skills that catch the ways AI fools itself: bad framing, unverified conclusions,
stuck investigations, designs built on APIs it never read. Everybody lies — especially your own
working notes — so the differential goes on the whiteboard and you run the tests before you treat.

**No commands to learn — the skills fire themselves** when the moment matches:

| Skill | Fires itself when | What it does |
|---|---|---|
| [**elucidate**](elucidate/SKILL.md) | about to brainstorm or analyze | distills the problem into typed slots, re-asks in a clean context — surfaces hidden premises |
| [**tabletop**](tabletop/SKILL.md) | designing against someone else's API | forces the contract table first — an unknown deadline/retry/token rule is a blocker, not a footnote |
| [**differential**](differential/SKILL.md) | "nothing works" / unexplained anomaly | cold agent enumerates every possible mechanism, then proves the winner against independent data |
| [**warrant**](warrant/SKILL.md) | shipping a conclusion built on data | a fresh verifier recomputes every claim before it ships — refuted claims die, survivors get a receipt |

## Install

```bash
git clone https://github.com/luongjames8/house-skills ~/code/house-skills
mkdir -p ~/.claude/skills
for d in ~/code/house-skills/*/; do
  [ -f "$d/SKILL.md" ] && ln -sfn "$d" ~/.claude/skills/"$(basename "$d")"
done
```

That's it. Works in every project, every session. Re-run the loop after pulling new skills.

---

## Genesis

These came out of a live algorithmic-trading operation run by a fleet of AI agents, where the
operator kept catching the agents fooling themselves — the same few ways, over and over. Instead
of complaining at them (which doesn't survive a long session), every catch was reproduced with a
baseline agent (RED), fixed with the smallest rule that made the reproduction pass (GREEN), and
shipped as a skill. Each one has a specific incident behind it:

- **elucidate** — an analyst booked a venue's "matched, riskless" fills as benign, importing the
  exchange's risk frame as its own; the desk was actually holding the losing leg. The entire fix
  was one sentence said out loud — so the skill exists to force those sentences into text *before*
  the analysis.
- **differential** — weeks of "all candidates killed" verdicts while the actual loss mechanism sat
  unasked; a cold agent named it in under a minute once someone finally asked *why* instead of
  *whether*. Its PROVE-IT gate was added after a data field literally named `maker` was read as
  the maker *role* — and every re-read of the same feed "confirmed" it.
- **warrant** — an agent with a wrong hypothesis in its own notes spent more tokens writing a
  hedge paragraph than the thirty-second check it was deferring "to next session" would have
  cost. Verification had to stop being the author's job.
- **tabletop** — a production button handler validated before acking and blew the vendor's
  3-second callback window; the error was swallowed, the user saw nothing, and 405 unit tests had
  passed. The design was written against a contract nobody had read.

Rules that refused to fail a test were *not* shipped — they're recorded as negative results in
[`warrant/docs/`](warrant/docs/). Eval data for elucidate is in
[`elucidate/docs/experiment-results.md`](elucidate/docs/experiment-results.md).

**The one law behind all four.** A model acts reliably only on what is explicit and in front of
it at the moment of action; everything tacit (earlier inferences, unread docs, unstated
constraints, structure hidden in data) influences it only probabilistically, decaying with
context length. Every skill is the same move on a different object: *find what's tacit, print it
where the next computation looks, and hand it to a reader with no momentum.*

**Two patterns worth stealing even if you never install anything:**
- *Catch-side beats author-side.* Asking a working agent to notice its own mistakes degrades with
  context length. Routing output through a fresh reader with a narrow charter caught every
  failure class we could reproduce.
- *Structure beats prose.* Deliverables are tables with a completeness rule (every mechanism /
  claim / interface gets a row), not narratives. Measured: one "keep it brief, top 3 bullets"
  request made agents silently drop their entire findings table — brevity compresses narration,
  never the rows.

Lifecycle if you like maps: generation → elucidate · design → tabletop · impasse → differential ·
shipping → warrant. Explicit invocation (`/warrant` etc.) works as a fallback. Raw field cases
live in a private companion repo; published evidence keeps measured results with identifying
specifics genericized.
