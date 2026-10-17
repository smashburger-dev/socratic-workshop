# Learning visualizations

These three standalone HTML drafts await Noa's review. Open a file directly in a browser; no installation, server, CDN, or framework is needed. The interface copy is English. Each example includes a light/dark toggle and uses the [shared shell](../assets/visualization-shell.html) as its starting point.

| Example | Explore | Scope |
| --- | --- | --- |
| [Gradient descent](gradient-descent.html) | Change the learning rate, inspect the next-step preview, then run, pause, or advance the trajectory. | Exact one-dimensional quadratic, fixed positive learning rate, no noise. |
| [Spanish word order](spanish-word-order.html) | Compare English and Spanish sentence tiles and predict the position of a color adjective. | Neutral color-adjective placement in the selected example, not a rule for every Spanish adjective. |
| [Process bottlenecks](bottleneck.html) | Change station capacities in an isometric chain and compare capacity with output in the accompanying chart. | Deterministic serial production with sufficient material, demand, and buffers. |

These are full-explanation showcases. A hint artifact would contain only the current hint, including in its source. They are not recordings of real tutoring sessions or evidence of learning effectiveness.

## Shared patterns

The UI revision applies Noa's feedback about excess copy, action placement, immediate feedback, English presentation, and theme choice. Its design decisions are reflected in the reusable shell and Werkbankfiguren reference rather than limited to these examples.

The capacity chart uses the shell's comparison-row pattern; the language example uses its annotated-item pattern. These are maintained reference outputs of the same components available to the skill, rather than separate display-only mockups.

## Request the same learning scope

Use the installed skill, or supply this repository's `SKILL.md` and its linked resources. These prompts specify the examples' scope; generated copy and composition may vary.

```text
Use $socratic-workshop. Create a full-explanation HTML exploration of
gradient descent on f(x) = (x - 3)^2 with live learning-rate feedback.
```

```text
Use $socratic-workshop. Create a full-explanation HTML comparison of
English and Spanish color-adjective placement using sentence tiles.
```

```text
Use $socratic-workshop. Create a full-explanation HTML exploration of
a three-stage production bottleneck, with an isometric line and capacity chart.
```

## Review and recordings

Review so far is a manual source inspection. Noa's screenshots exposed a capacity-chart alignment error; the chart was changed to shared data rows. The revised alignment, keyboard use, and print output still need visual confirmation because browser policy blocked local-file access. No automated tests or test infrastructure were created or run.

A usage GIF of gradient descent is planned only after Noa approves the HTML. No GIF has been captured and none of these drafts has approval yet. Any recording or publication remains subject to the owner's instructions.
