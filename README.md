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

## Details (for the curious)

**Where they came from.** Built inside a live algorithmic-trading campaign run by a fleet of AI
agents. Each skill exists because a specific expensive failure happened, was reproduced with a
baseline agent (RED), and was fixed by the change that made the reproduction pass (GREEN). Rules
that refused to fail a test were *not* shipped — they're recorded as negative results in
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
