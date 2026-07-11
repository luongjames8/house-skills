# elucidate — experiment results

Two workflow runs over a 5-problem family of **hidden-constraint decision problems** (car-wash,
charger, couch, plant, mail-neighbor — each hides a prerequisite or rests on a false premise). Every
candidate answer graded by an independent `sonnet` grader against the problem's known hidden
constraint + correct answer. Metrics: `surfaced` (named the hidden constraint?), `correct` (right
action / rejected false frame?), `solved` = both, `quality` 0–100.

Distillation modes: **none** (raw material → reasoner) · **A** = freeform principles · **B** = typed
slots (FACTS/CONSTRAINTS/PRIORITIES/VECTORS/OPEN-QUESTIONS). Reasoning modes: **single** vs
**debate** (pro/con + judge). Distiller + grader = `sonnet` throughout.

The two runs differ in **the reasoner under test**, which turned out to be the key variable:

- **Run 1** — reasoner = `haiku`, solve prompt *carries the forcing function* ("if the question is a false choice or omits a prerequisite, say so"). This makes the baseline artificially strong.
- **Run 2** — reasoner = `sonnet`, solve prompt is **naive** ("choose the better of the options"). This exposes real baseline failure and isolates distillation's value.

---

## Run 1 — strong reasoner (forcing-function solver, haiku)

| cell | n | surfaced | correct | **solved** | quality |
|---|---:|---:|---:|---:|---:|
| polluted / none / single | 10 | 1.00 | 1.00 | **1.00** | 94.8 |
| clean / B / single | 10 | 1.00 | 1.00 | **1.00** | 94.2 |
| polluted / B / single | 10 | 1.00 | 1.00 | **1.00** | 92.9 |
| polluted / B / debate | 9 | 1.00 | 1.00 | **1.00** | 92.0 |
| clean / none / single | 10 | 0.90 | 0.90 | **0.90** | 84.9 |
| clean / B / debate | 10 | 0.90 | 0.70 | **0.70** | 70.9 |
| clean / none / debate | 10 | 0.60 | 0.60 | **0.60** | 63.5 |
| polluted / A / single | 9 | 0.89 | 0.56 | **0.56** | 68.3 |

Read this run for the **negative** results (baseline was near-ceiling because the solve prompt already
does mental-model work):

- **Freeform distillation (A) actively hurt** — 0.89 surfaced but only **0.56 correct**, *below* the
  0.90–1.00 no-distill baseline. A lossy prose intermediate can override an already-capable reasoner:
  it re-states the situation and the reasoner commits to the framed options anyway.
- **Debate degraded hidden-constraint problems** — `clean/none/debate` fell to **0.60**. Advocates
  argue the two offered options (walk vs drive, morning vs afternoon), which *entrenches the false
  dichotomy*; the judge tends to accept the premise. Typed constraints partially rescue it
  (`polluted/B/debate` 1.00) but debate never beat single-agent.
- **Typed B held at the ceiling** (1.00 across all its single cells).
- Two `haiku` agents emitted junk ("test") outputs — a low-effort reliability artifact (it dinged
  `clean/none/single` and `clean/B/debate`), not a method effect. This motivated moving to `sonnet` in run 2.

---

## Run 2 — naive reasoner (no forcing function, sonnet) — the clean test

| cell | n | surfaced | correct | **solved** | quality |
|---|---:|---:|---:|---:|---:|
| polluted / B / single | 10 | 1.00 | 0.90 | **0.90** | 86.8 |
| clean / B / single | 9 | 1.00 | 0.89 | **0.89** | 88.2 |
| polluted / A / single | 10 | 0.80 | 0.80 | **0.80** | 77.2 |
| clean / none / single | 10 | 0.60 | 0.60 | **0.60** | 65.2 |
| polluted / none / single | 10 | 0.60 | 0.60 | **0.60** | 59.6 |

With the forcing function removed, the baseline drops to **0.60** (a capable model, left to "pick the
better option," fails charger and couch outright — it dismisses outlet access, and it just picks a
time for the couch). Now the effect is unmistakable:

- **Typed distillation (B) rescues the naive reasoner: 0.60 → ~0.90** (+0.30 absolute), and it is
  **pollution-proof** — 0.90 polluted == 0.89 clean. The typed CONSTRAINTS slot forces surfacing to
  **1.00** regardless of the reasoner's disposition.
- **Freeform (A) helps but is weaker: 0.60 → 0.80**, and surfaces only 0.80. It rescued the charger
  but never reliably forced the couch feasibility constraint.
- **Pollution** degrades a naive reasoner's *quality* (65.2 → 59.6) and induced an outright
  **hallucination** (one charger answer fabricated references to the noise — farmers market,
  insurance). Typed distillation neutralizes both.

---

## Unified conclusions

1. **Typed-slot distillation (B) is dominant in both regimes.** It is the ceiling when the reasoner is
   already strong (run 1: 1.00, never dropped a genuine case) *and* the biggest rescue when the
   reasoner is naive or the context is polluted (run 2: +0.30, pollution-proof). **It never hurt.**
   → This is the decisive answer to the A-vs-B question the project set out to settle: **B wins.**

2. **Freeform principles (A) are regime-dependent and risky.** They help a naive reasoner modestly but
   *hurt* a capable one (run 1: 0.56). Prose lets the key constraint stay soft and lets the reasoner
   fall back on the framed options. **Don't distill to freeform when correctness matters.**

3. **The forcing function is the mechanism, and the typed CONSTRAINTS slot is its most reliable
   carrier.** The same explicit demand — "what MUST be true / is this a false choice?" — moves 0.60 →
   0.90 whether it lives in the solver instruction (run 1 baseline) or in a typed slot (B). B is best
   because it *guarantees* the prerequisite gets written down (surfaced = 1.00) independent of whether
   the reasoner would have thought to ask.

4. **Debate degrades hidden-constraint problems.** It entrenches the offered framing. Use single-agent;
   reserve debate for genuine two-sided *value* tradeoffs, and even then feed it the typed CONSTRAINTS.

5. **Hardest residual case: `couch`.** Even with constraints surfaced (1.00), a naive reasoner
   sometimes still answers "which time" — surfacing a constraint does not guarantee heeding it. This is
   where an explicit reasoner instruction to *act on* the constraints still adds value on top of B.

**→ Production configuration (shipped in `SKILL.md`): typed-slot distillation → single fresh reasoner
carrying the forcing-function instruction.** Both halves of the project — the distill/reinject loop
and the mental-model elicitation — collapse into this: the typed CONSTRAINTS slot *is* the elicitation,
and the fresh single reasoner *is* the clean reinjection.

---

## Run 3 — Field validation: live head-to-head on real work

Not a synthetic problem. A live agent session in a running market-making campaign ran the **same generative
task** — "propose new MM mechanisms for a fast crypto prediction-market book" — two ways:

- **Straight** — generate directly over the polluted research corpus (a large internal research corpus).
- **Elucidated** — first distill the corpus into a **typed briefing** (25 hard constraints), then generate from it. (Raw briefing and output live in the private
  field-data repo.)

**Verdict (the session's, verbatim in spirit): the typed-distill run was net better on this task — not by
generating more exotic ideas, but by (a) refusing to propose what the constraints forbid, and (b)
catching two false premises in its *own* briefing that the straight pass never surfaced.**

Qualitatively: the straight pass's top ideas drifted toward the wrong optimization axis (away
from the briefing's ranked-#1 priority) and included proposals the engine's constraints forbid;
the elucidated pass aimed all three of its top ideas at the ranked priority, **killed seven
candidate classes on named constraints**, and **caught two false premises in its own briefing**
that the straight pass never surfaced. (Engine specifics, mechanism names, and gap figures live
in the private field-data repo.)

The two false-premise catches — the real prize:

1. **Literal-sign vs structural-positivity.** The briefing's bar ("the competitor achieves neither trading>0
   nor rebate>0") contradicted its own FACTS (he posts both positive). Left uncaught, a mediocre
   config posting +0.01% would claim false victory. The bar must be *structurally* positive, not
   literal-sign.
2. **An ungrounded judging gate.** "Passing worst-latency" was being read against a placeholder
   latency figure the briefing elsewhere admits is ungrounded — so configs "passing" pass a
   hypothesis, not a measured ceiling.

The session is carrying both catches into its go-package judging language, and folding the cheap elucidated ideas into its next in-sample batch.

**Where it did NOT help:** no wildly novel mechanism the straight pass couldn't reach; overlap on the
phase/reload idea family. **Cost:** one extra distill stage (~9 min, sonnet).

**Why this matters for the skill:** it independently reproduces the synthetic finding on real,
high-stakes work — *typed distillation earns its keep by surfacing hidden constraints and false
premises, not by out-creating.* It also demonstrated two capabilities the synthetic eval never
tested, now promoted to first-class outputs in `SKILL.md`:

- **Constraint-kill** — enumerate along VECTORS, then *reject* candidates against CONSTRAINTS and
  report each kill with the constraint that killed it. Constraints firing is the mechanism working.
- **Briefing self-audit** — before answering, check FACTS against CONSTRAINTS for internal
  contradictions and flag false premises / ungrounded placeholders in the briefing itself.

---

## Honest caveats

- **Small n** (2 trials/cell, 5 problems). Directional, not publication-grade; the effects are large
  enough (0.60 → 0.90; A at 0.56) to be trustworthy as design guidance, not as precise magnitudes.
- **Single grader** (one `sonnet` call per answer). No inter-rater check; grader given the answer key,
  so grading is reliable but not adversarial.
- **One problem family.** Hidden-constraint / false-premise decisions. The *ideation* path (enumerate
  along VECTORS) is designed but not yet benchmarked — stated as a caveat in the README.
- **Pollution was mild.** One shared noise paragraph. A naive reasoner still degraded (quality +
  hallucination); a stronger stress test (long, topically-adjacent research dumps) would test the
  distill-and-reinject loop's headline use case more forcefully. Future work.
- **3 dropped jobs** total across both runs (StructuredOutput retry cap) — reflected in n<10 cells.
