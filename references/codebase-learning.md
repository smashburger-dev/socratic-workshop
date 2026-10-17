# Learning from an existing project

Use a project to find a concrete learning question. The learner may want to understand code they wrote months ago, inherited code, or work produced by an agent. Familiarity with the repository does not establish understanding of its mechanisms.

## Choose a slice

Ask what they find unclear. If they want suggestions, follow the environment's required discovery order. Use an available project knowledge graph first where required, symbol tools next, then narrow source reads. These are optional capabilities of the host, not dependencies of this skill. When none are available, inspect a bounded entry point and its immediate calls.

Offer a few targets tied to actual files or symbols and the idea each teaches. Examples might be tracing one request, explaining an invariant, understanding a data transformation, or comparing an implementation with its algorithm. These examples are possible targets, not claims about an uninspected repository.

Agree on one target. Use exact file/symbol locators and the current checkout as the source of truth. Check whether documentation describes another revision before grading against it. Expand context only when a missing relationship blocks the learner's explanation.

## Preserve the learner's work

Before file creation in an existing Git project, offer a separate worktree, a separate branch, or read-only study. Explain that a branch uses the current checkout while a worktree provides another directory. Respect their choice and existing authorization. Read-only discussion can start immediately.

Keep notes and HTML in the agreed learning location. A small standalone artifact should not require changes to package manifests, production source, or a build pipeline. Commits, pushes, and sharing are separate actions.

## Facilitate

Ask the learner to predict behavior or trace a small concrete input. They should explain why one step follows another. When their mental model differs from the implementation, use a locator as a hint so they can inspect it themselves. Cite the relevant source when establishing the final correction, without pasting the surrounding module.

Separate these questions:

- What does this checkout do?
- What is the intended behavior?
- Is that behavior correct for the stated requirement?

A source file can establish the first and still be wrong about the other two. Use a manually traced example or a requested visualization when useful. Continue to obey the skill's prohibition on automated tests. A discovered production bug can be noted for a separate, explicitly requested fix.
