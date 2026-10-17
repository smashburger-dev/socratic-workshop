# Socratic Workshop

Explain an idea to your AI tutor. Find the gap. Work it out yourself.

Socratic Workshop is an agent skill for learning through your own explanations. The agent listens, checks your reasoning, asks one question at a time, and gives a targeted hint when you ask for help. It can use a book, a paper, a course, or an existing project as the reference.

When a picture would help, it creates a standalone interactive HTML file using a portable adaptation of Noa's Werkbankfiguren approach. The figure should make the mechanism visible and give you something to predict, inspect, or explain.

**Status: private draft.** The repository has no public release approval. The examples are authored drafts, not evidence of learning effectiveness or confirmed user sessions.

## Start a session

Load the skill and say what you want to understand:

```text
Use $socratic-workshop. I want to understand why a Gaussian prior
leads to L2 regularization. I have a textbook chapter already.
Let me explain first; give me one hint only when I ask.
```

Or learn from a project:

```text
Use $socratic-workshop with this repository. Help me choose one part
of the request pipeline to understand. Ask me to trace it myself.
```

You can say “hint,” “I’m stuck,” “show me a visualization,” “I want a direct explanation,” or “pause here.” The conversation follows your current explanation rather than a fixed quiz. The tutor responds in your language.

## The learning loop

1. Choose one concrete learning goal and reference material.
2. Study externally if needed, then explain the idea in your own words.
3. Work through one diagnostic question or requested hint at a time.
4. Use a visualization when it addresses the gap you are working on.
5. Finish when your explanation establishes the agreed understanding.

The agent recommends links, chapters, or timestamps when you need material. It does not fill the tutoring chat with generated reading packs. An optional small handoff makes it possible to resume later.

A request for a complete explanation changes the mode. Seeing an answer is recorded separately from demonstrating that you understand it.

## Visual learning

The bundled [Werkbankfiguren adapter](references/werkbank-figuren.md) creates one HTML file with inline styles, scripts, and graphics. No build step, package installation, external font, CDN, or Argmin installation is required. It uses restrained tonal colors, meaningful interaction, readable labels, and a text alternative. Each model states its assumptions and limitations.

A hint visualization contains only the information appropriate to the current hint, including in its source. A fully explained visualization may reveal its result after your prediction. The tutor then returns to your explanation.

Explore the [three draft examples](examples/README.md):

- [Gradient descent](examples/gradient-descent.html): step size on a one-dimensional quadratic.
- [German word order](examples/german-word-order.html): finite-verb position in a main clause and a clause introduced by “weil.”
- [Process bottlenecks](examples/bottleneck.html): capacity and throughput in a simplified process.

Download an HTML file and open it directly in a browser. GitHub's file view shows source rather than running the page. These complete-explanation demos are showcases, not the content that every hint request receives.

## Use in a project

The skill asks whether you want a separate worktree, a branch, or read-only study before creating learning artifacts in an existing Git project. In a fresh coding session, agree on a learning folder. In a chat environment, use its file or artifact capability when available.

Learning a project does not authorize production edits, package installation, commits, pushes, or publication.

**No automated tests.** This skill does not write or run unit tests, snapshot tests, browser test suites, coverage jobs, or benchmarks for its learning artifacts. Model inspection and a manual browser review are the intended checks. A generated visualization can still be wrong; inspect the assumptions and what it actually shows.

## Install or load

This repository is itself the skill directory. Its root contains `SKILL.md`, with conditional references alongside it. Use it directly with an agent that can load a skill from a local folder, or place the complete folder in your host's skill discovery directory under the name `socratic-workshop`.

For Codex, the usual personal directory is `~/.codex/skills/socratic-workshop`. For Claude Code, it is `~/.claude/skills/socratic-workshop`. The repository's `agents/openai.yaml` supplies optional Codex UI metadata. Other hosts can read the core `SKILL.md` without it. Host policies and available browsing/file tools still apply.

No packages or services are required. Browsing is useful for verifying resource recommendations; a browser/file artifact capability is useful for HTML. In a text-only environment, the explanation loop remains usable.

## Before public release

Keep this repository private until the owner explicitly approves publication. The release evidence must include:

- Three visualization examples explicitly approved by Noa. The current files are drafts awaiting that review.
- Three GIFs showing Socratic learning loops, explicitly approved by Noa and cleared for sharing. There are no approved GIFs yet. Label any staged demonstration as staged rather than presenting it as a recorded user session.
- A record of which examples and recordings were approved, with dates and the scope of each approval.
- A final review of attribution, shareable content, installation instructions, and the public license.

The owner's confirmation controls each gate. Files existing in the repository, agent review, a completed chat, or a generated GIF do not imply approval. A new explicit instruction is required to change GitHub visibility.

## Credits

Inspired by Miles Cranmer's [How to Avoid AI Brain Rot](https://www.youtube.com/watch?v=uXC7OuCas2Q&t=1438), specifically 23:58–34:33, published by MPhil in Data Intensive Science Cambridge. The [source notes](references/sources.md) distinguish caption-grounded ideas from this skill's additions.

The visual approach adapts Noa's Werkbankfiguren principles from Argmin. Anatomy is a possible future comparison and is not bundled. Neither the speaker nor any upstream project endorses this skill.

Copyright 2026 smashburger-dev. All rights reserved during private development. Select the public license before release.
