# Workbench for Socratic Workshop

Read this reference when an interactive figure can address the current understanding gap. Choose a controllable cause and an observable effect. If interaction adds little, a small static diagram is enough.

## Origin and portable assets

Adapted from the Werkbankfiguren work in [Argmin](https://github.com/smashburger-dev/argmin). Retained principles are a visible mechanism, model-derived geometry and numbers, meaningful motion, accessible controls, and explicit limits where an analogy could mislead. The original Argmin scene registry, renderer, test workflow, and warm palette are not required here.

The visual approach is also inspired by [Anatomy](https://github.com/wheresryan22/anatomy), an open-source skill for interactive explanations. This adapter is standalone; Anatomy is an inspiration rather than a runtime dependency.

Use [visualization-shell.html](../assets/visualization-shell.html) as a copyable starting point for layout, theme colors, typography, controls, and theme switching. Copy the relevant parts into one HTML file with inline CSS, JavaScript, and SVG or Canvas. Trim unused styles. The output works directly from disk with system fonts and no network, package installation, CDN, or build step.

Copy its comparison-row, annotated-item, or reference-task pattern when applicable. The reference-task wrapper stretches both panels so a shorter reference can center beside the task. The showcase examples use these same patterns; apply general refinements here before adapting a particular scene.

## Preserve the learning boundary

The main skill determines the permitted scope:

| Mode | Information in the artifact | Interaction |
| --- | --- | --- |
| Hint | Only the current hint and already established information | Explore an observation or a smaller subproblem, then return to the conversation |
| Full explanation | The requested mechanism and explanation | Explore directly or predict and reveal, then explain the observation |

A hint file contains no later solution in its HTML, SVG, JavaScript, data, comments, accessible names, or computed states. Hiding content with CSS or a disabled button does not preserve this boundary. Keep sliders and previews within the permitted scope. A prediction or click cannot authorize another hint level. Add a new level only when the learner requests it.

Prediction is useful when comparing expectation with an observation. It is not a mandatory gate on every slider or every figure. For a full exploration, show the effect of changing a value immediately. In a prediction activity, keep the learner's choice visible beside a separately presented outcome. Grade only a bounded factual choice; leave open explanations for discussion rather than matching a string.

## Make the mechanism visible

Keep a small model containing inputs and derived quantities. Graph coordinates, quantitative geometry, numerical labels, and displayed calculations use that same model. Fixed layout spacing is fine; independently typed copies of scientific values are not. For language or other qualitative topics, use explicit cases rather than invented numerical measurements.

Choose the representation for the question:

- A 2D curve can make direction and step size easier to read than a perspective surface.
- An isometric process can distinguish stages, connections, and flow. Pair it with a common-scale capacity chart when the comparison matters.
- A 3D view can explain a spatial mechanism. Use SVG projection or a small Canvas renderer when sufficient; importing a 3D framework is not a default requirement. Provide view controls only when changing viewpoint helps the learner.
- Sentence tiles can make constituent movement visible while keeping the complete example readable.

These are examples, not a fixed subject catalog. Apply the same cause-and-effect reasoning to science, mathematics, language, code, planning, or business. Every visible object should carry a meaning or a control.

Use crisp vector geometry and legible HTML labels where possible. Label axes, units, and scale. Keep the scale stable during a comparison or playback so rescaling cannot disguise growth. If a value leaves the view, show that fact and the actual value rather than clamping it silently. A second chart should answer another necessary question, not decorate the first.

## Keep the interface quiet

The default surface contains a short title, at most one useful introductory sentence, the visualization, its controls, and its current result. Use English for shared examples and default interface copy; honor the learner's explicit language choice. The subject's actual language remains unchanged in a language-learning example.

Use the shell's cool white surfaces in light mode and distinct dark surfaces in dark mode. Respect the system preference initially and provide a visible toggle. Keep essential labels readable in both themes. Saving the theme is optional and must tolerate storage being unavailable. Do not persist learner answers without a request.

Use the shell's semantic type scale: title 28–32 px, panel heading 18 px, body 16 px, supporting text 14 px, key value 20 px. Size SVG text for its actual rendered width. Keep supporting labels at least 14 rendered pixels; shorten copy or reflow before shrinking it. Use rounded cards around 22–28 px and sparse borders. Reserve the accent for the current cause, state, or result, with a text or shape cue as well.

Co-locate controls with what they change. Graph playback belongs directly below the graph; legend and numerical readouts follow the controls. Reset stays inside the panel it resets. Put interpretation in a distinct feedback panel with a short headline and, if useful, one concise explanation. Avoid scattering a verdict, a calculation, and duplicate instructions across unrelated panels.

For dialogue, keep the roles in separate, consistently positioned chat panels with names and distinct subdued colors. Hold an overview long enough to read before advancing; a brief transition is not a readable introduction.

### Alignment and space

- Use the shell's shared header: title and theme toggle on one row, optional introduction below. Omit default branding and links to unrelated examples.
- Group the task's context and any item to place on one aligned row; put its question, choices, and actions together below. On narrow screens, wrap whole groups in that order.
- Center a shorter reference within its available panel when the adjacent task is taller. Keep panel headings on the same top line; do not leave the reference stranded at the top.
- One datum, one row: label, mark, and value share layout tracks and a scale.
- Metadata sits above the item in reserved space, outside its content surface.
- Keep labels attached when wrapping; let content size the row instead of synchronizing separate columns with offsets or guessed heights.
- Use one coherent set of layout rules. Replace obsolete overrides when changing the composition; do not stack compact fixes over earlier layouts.

### One frame on desktop

Target 1280×720, with the mechanism, controls, and current result visible together, including after a reveal. Budget height before adding a panel. Use columns, shorter copy, and viewport-relative scene height before shrinking labels. Keep notes collapsed. Never hide overflow, zoom, or scale the page to manufacture a fit. Mobile and opened reference details may scroll.

Remove numbered lesson kickers, repeated 'predict then reveal' labels, draft labels, and explanatory mini-paragraphs that repeat the visible control. Keep review status in repository documentation. Additional calculations can live in a 'Calculation' disclosure. Include model assumptions only where their absence could mislead, usually in a collapsed 'Model notes' disclosure. Explain a material analogy limitation near the relevant claim rather than adding a boilerplate footer to every figure.

## Make interaction immediate and controllable

A slider must visibly change the mechanism, comparison, or an appropriate preview while it moves. Updating only its numeric label is insufficient. In hint mode, immediate feedback still respects the information boundary.

For a temporal process, offer explicit Run/Pause, Step, and Reset controls when they help. Start motion only after a user action. Pause when inputs change, on reset, and at the end of a bounded sequence. Keep displayed state, active controls, and feedback synchronized. With reduced motion, use discrete updates without travel animations. A static diagram needs no playback bar.

Use native buttons and inputs with visible labels, keyboard focus, and at least 44 px hit targets. Avoid capturing keys while someone is typing. Spatial dragging needs button or keyboard alternatives if changing the view is essential. Provide a meaningful accessible title/description and a text equivalent for visual state. Keep small-screen reading order aligned with the interaction order.

## Inspect and deliver

Create or run no automated tests, snapshot checks, coverage jobs, or benchmark suites. Inspect the model and state transitions directly. When browser access is available, manually look at light/dark themes, the permitted controls, a narrow viewport, and reduced motion. Check a hint artifact's source for later answers as well as its visible surface. A blocked browser action is not permission to use a workaround; report the missing visual review honestly.

Deliver the file link with one short exploration prompt and return to the learner's explanation. Keep GIF capture separate until the owner approves the current HTML. When feedback changes a general design rule, update this reference or the shell as well as the example. Do not encode a particular scene's labels, equations, or learning steps into the reusable shell.
