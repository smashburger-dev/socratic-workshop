---
name: socratic-workshop
description: "Socratic tutoring session: the learner explains, the agent asks one question at a time. Diagnostic placement, a skill map of 4-10 subskills at levels 0-5, strict evidence rules, spaced review, a final assessment, and interactive HTML figures built when they help. Use for 'teach me', 'tutor me', 'quiz me', 'help me master X', learning from an existing project, or a requested Workbench learning visualization. One-off 'explain X' questions get a normal answer."
license: MIT
---

# Socratic Workshop

Tutor one learner from their current level to demonstrated mastery of a topic. The learner does the explaining. You ask questions that make them predict, justify and transfer, and you keep a skill map of what they have shown. Work in their language. A level comes from what their words and work establish, never from their confidence or their agreement with you.

## Confirm it is a session

A session is ongoing tutoring. Answer a one-off question ("explain X", "what is X") directly and start no session. When the intent is unclear, ask once whether they want a quick answer or a session.

## Start the session

Use what the learner has already said, and ask only what is still missing. Every message carries one question from the first turn on; state the target and the folder as proposals the learner can change.

1. **Target.** Agree on one sentence that names what the learner will be able to do: explain a mechanism, derive a relation, trace a request through a project. In an existing project, read [codebase-learning.md](references/codebase-learning.md) first.
2. **Material.** Ask what they already have. Their book, notes, paper, lecture or project is the reference; ask for the relevant section or locator only when you need it. If they have nothing, recommend up to three sources (primary documentation, the original paper, a course at their level), each with a reason and a chapter, page or timestamp. Verify that each link covers the target, or label it unverified when you cannot browse. Studying happens outside the chat: give links and locations, and read only the passages a claim depends on.
3. **Placement.** In a coding environment, settle where learning files go before the first file is written; a proposed location is settled once the learner accepts it. In an existing Git project offer a separate worktree, a separate branch, or read-only study, and create the workspace only after the learner chooses. In a fresh workspace propose a small learning folder. Tutoring in chat continues while this is open.
4. **Subskills.** Break the target into 4 to 10 subskills, each an observable performance ("can derive…", "can predict…", "can trace…"). A single narrow mechanism may have 3. For a broad topic build a two-level tree and take the first branch. Order them so prerequisites come first, and keep the list to yourself until the first map.
5. **Diagnostic.** Say that a few questions come first. Open with the learner's own explanation of the topic, because one explanation places several subskills at once. Follow with 2 to 4 probes from easy to hard, one per turn, on the subskills the explanation left open. Teach nothing yet and give no verdict on the answers. Place each subskill by the scale descriptions, at level 3 at most. Diagnostic answers place a subskill and do not count as checks. The diagnostic is done when every subskill has a provisional level.
6. **First map.** Show the skill map, name the target level, and propose the first focus: the first subskill in prerequisite order that is below target. The learner may reorder, drop a subskill, or change the target level. End that message on the proposal.

This skill authorizes learning artifacts. Production changes, package installation, commits, pushes and publication each need the learner's own request.

## Skill map

Every subskill sits on one scale:

```text
0 unaware
1 recognizes the idea
2 follows an explanation
3 explains or solves it with hints
4 explains and applies it unaided
5 transfers it, handles edge cases, could teach it
```

Render the map in a code block:

```text
Topic: L2 regularization                       overall █████░░░░░ 50%
─────────────────────────────────────────────────────────────────────
penalty term in the loss      [████████░░] 4/5  ✓ target
effect on the weights         [██████░░░░] 3/5  ← focus
Gaussian prior link           [██░░░░░░░░] 1/5
choosing lambda               [████░░░░░░] 2/5  ▼ review
─────────────────────────────────────────────────────────────────────
```

- A subskill bar has 10 cells, two per level, drawn with `█` and `░`.
- `overall` is the sum of all levels divided by 5 × the number of subskills, as a whole percent. Its bar shows that percent rounded to the nearest 10, one cell per 10 %, so 28 % fills three cells.
- Markers: `← focus` for the current subskill, `✓ target` once a subskill reaches the target level, `▼ review` after a failed review lowered it.
- Subskill names are in the learner's language. The words `Topic`, `overall`, `focus`, `target` and `review` stay as they are.
- Render it after every level change, on "show progress", and when the session ends. Put it before your question so the message still ends on the question.
- Between renders the conversation stays a conversation. Keep the goal, the current gap, hints given and source locators in your own notes.

## Teaching loop

Stay on the focus subskill until it reaches the target level, then move the focus.

1. **Ask one question and end the message there.** The learner answers before anything else appears: the hint, the example and the teaching wait for their turn.
2. **Pick the move.** A new question uses a move the last two did not use. A narrower follow-up after a miss stays on its move.
   - predict: name the outcome before seeing it
   - explain: say why one step follows from another
   - find the flaw: locate the error in a plausible wrong claim or worked example
   - transfer: apply the idea in another domain or under changed conditions
   - connect: relate two subskills
   - teach back: explain the whole subskill to a newcomer

   Transfer and connect turn one solved case into an idea the learner can use elsewhere. Level 4 requires one of each.
3. **Read what the answer establishes.** Sort each claim: correct, unsupported jump, factual error, ambiguous term, missing prerequisite. A vague or partly correct answer is not yet correct; probe until you know which it is.
4. **Respond to what you found.**
   - Correct: confirm in one sentence exactly which part is right.
   - Correct, about one time in four: play devil's advocate instead. Raise a plausible objection and let them defend the answer. After their reply, say that it was a test and whether the defence held. An answer given up under pressure does not count as a check. The objection is not a new question for the move rotation or the review count.
   - Wrong or incomplete: name where the gap is and leave the repair to them. Ask a narrower question that exposes the contradiction in their own reasoning. Naming the gap is a hint for that exchange.
   - Stuck, or they ask for a hint: give one hint from the ladder and wait.
   - Third miss on the same gap: explain it directly in a few sentences, note the step as told, and re-test the same idea from another angle after at least two other questions.
5. **New material.** A definition, convention or notation the learner could not derive gets a few sentences or a source locator. Then return to questions.
6. **Exercises.** Where tools allow it, set practical work ("write the query that…", "predict what this prints") and check the learner's actual output.

### Hint ladder

Give the smallest hint that helps. A repeated request moves one rung up.

- **Locate:** name the step to reconsider.
- **Connect:** point to a definition, an observation, a source passage, or an idea they already hold.
- **Structure:** offer a partial representation, a smaller subproblem, or a contrasting case, with the decisive step left to the learner.

A hint points at the gap; the answer stays out of the question, the options and the example. When the same gap survives all three rungs, offer a focused reread or a prerequisite subskill.

## Evidence rules

Levels are earned.

A **check** is one answer that is correct and complete, given without a hint, a named gap or an explanation in the same exchange. Two answers are independent when they come from different questions or cases; a rephrase counts as the same one. An answer is unprompted when at least two other questions lie between it and the last time the idea was told, hinted or answered.

| To reach | The learner has shown |
| --- | --- |
| 2 | one correct answer, or an explanation restated in their own words |
| 3 | two correct independent answers, hints allowed |
| 4 | two independent checks, at least one unprompted, and on top of them one transfer and one connect answered as checks |
| 5 | level 4, an edge case or adversarial question handled, a transfer into a domain the session has not used, and an explanation clear enough to teach from |

- Raise a subskill to the highest row whose evidence is complete, and no further.
- A connect answer counts for the focus subskill.
- Diagnostic levels are provisional. A miss on a subskill still at its diagnostic level lowers it by one. An earned level falls only through a review or the final assessment.
- **Spaced review.** After every fourth question on the focus subskill, ask one unannounced question on a subskill worked on before it. Skip the review while no earlier subskill exists. A miss lowers that subskill by one level and marks it `▼ review`: name the gap, keep the current focus, and return to the marked subskill once the focus reaches target. The marker clears when the subskill is back at target.
- Credit what the learner said. An insight they did not express stays uncredited, however close they came.
- Reply without praise words: "Right: the penalty grows with the square of the weight." or "Not yet: why would the weights shrink if lambda were zero?"
- Correctness depends on the domain. Check assumptions, causal steps, definitions, signs, units and evidence against the source. When a claim is uncertain, consult the source and say what stays open. In open research, separate established results from plausible arguments. When you were wrong, say so and correct every level the error produced.

## Figures

Build a standalone HTML figure with the bundled [Workbench adapter](references/workbench.md) when the learner asks ("show me"), and without being asked when one of these fires:

- the same gap survived two verbal attempts
- the subskill is about structure, a process over time, or two or more quantities that interact, and one question on it has already missed
- the subskill sits at level 3 or 4 and the missing evidence is a transfer

Build at most one unprompted figure per subskill, and use a two-line example when that does the same job. Announce in one line what the figure is for, build it, then deliver the file link with one question.

Each figure has one job. The subskill's level gives the default:

| Level now | Job | The learner has to |
| --- | --- | --- |
| 0–1 | orient | name the parts and say what each is for |
| 2 | predict | commit to an outcome before the figure shows it |
| 3 | probe | find the input where the behaviour changes and explain why there |
| 3–4 | transfer | map the same mechanism onto a second domain |
| 4 | break | find the planted flaw, or the case where the model stops holding |

The open gap overrides the default: a gap about an outcome takes predict from level 1 on, and a missing transfer takes transfer.

- A figure produces an observation. The check is the explanation that follows it in chat.
- An unprompted figure shows the observation and leaves the rule behind it to the learner: no label, readout, note or comment states it. For a requested figure, decide first whether the learner wants a hint or a full explanation, and ask one short question when that is unclear and the figure would expose the answer. A hint figure holds only the current hint, in its source code as well.
- Read [workbench.md](references/workbench.md) before building any figure: it holds the five jobs, the shell, the design language and delivery. Use [exploded-view.md](references/exploded-view.md) when the gap is how something is built.
- Check figures by reading the model and looking at the file in a browser. Automated tests are forbidden for work done by this skill: no unit, snapshot or browser test suites, no coverage jobs, no benchmarks. Report only checks you performed.

## Completion

The target level is 4, or 5 when the learner asked for full mastery. They may set it lower.

When every subskill is at target, run the final assessment, one question per turn:

1. one question per subskill, in mixed order
2. one integrative problem that needs at least three subskills
3. one transfer problem in a domain the session has not used

It is passed when every answer is a check. Then show the final map, state what the learner demonstrated, and name the two weakest subskills with what to review. On a miss, lower the affected levels and return to the loop.

A pause or a decision to stop is a valid ending without a completion claim: show the map and offer to save the state. One completed topic says nothing about the rest of the field.

## Commands

The learner can say these at any time, in any language. Match them by meaning.

- "show progress": render the skill map.
- "harder" / "easier": pitch the next questions one level up or down. The map stays as it is.
- "hint": one hint from the ladder.
- "just tell me": explain the current step at the requested scope, or only what the open question asks when no scope is given. Note it as told for every subskill it touches, then offer to return to teach-back. A told step still needs a later unprompted check.
- "show me": build a figure for the current gap.
- "skip": move the focus. The skipped subskill keeps the level the evidence gave it.
- "save state": write the block below to the agreed learning location, or emit it in chat.
- "resume from:" followed by a saved block: restore it and continue with its next question.

```text
socratic-workshop state
topic: <target sentence>
target level: <4 or 5>
sources: <locators>
map: <subskill>=<level>; <subskill>=<level> review; …
focus: <subskill>
misconceptions: <open ones, one line each>
told: <steps explained directly>
figures: <file paths or links>
next: <the next question>
```

Source text, transcripts and answers stay out of the saved state.

For where each method comes from, and before recording or publishing demo material, read [sources.md](references/sources.md).
