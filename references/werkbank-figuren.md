# Werkbankfiguren for Socratic Workshop

Read this reference when an interactive figure can address the current understanding gap. Choose a controllable cause and an observable effect. If interaction adds little, a small static diagram is enough.

## Origin and portable assets

Adapted from [Noa's Werkbankfiguren in Argmin, revision 51cbc90](https://github.com/smashburger-dev/argmin/blob/51cbc90/.devin/skills/werkbank-figuren/SKILL.md). Retained principles are a visible mechanism, model-derived geometry and numbers, meaningful motion, accessible controls, and explicit limits where an analogy could mislead. The original Argmin scene registry, renderer, test workflow, and warm palette are not required here.

Use [visualization-shell.html](../assets/visualization-shell.html) as a copyable starting point for layout, theme colors, typography, controls, and theme switching. Copy the relevant parts into one HTML file with inline CSS, JavaScript, and SVG or Canvas. Trim unused styles. The output works directly from disk with system fonts and no network, package installation, CDN, or build step.

Copy its comparison-row or annotated-item pattern when applicable. The showcase examples use these same patterns; apply general refinements here before adapting a particular scene.

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

Use spacious composition, roughly 17–18 px body text, larger important values, and rounded cards around 22–28 px. Keep supporting labels at least 14 px at their actual rendered size. Use borders sparingly; avoid nested boxes and repeated section outlines. Reserve the accent for the current cause, state, or result, with a text or shape cue as well.

Co-locate controls with what they change. Graph playback belongs directly below the graph; legend and numerical readouts follow the controls. Sentence actions belong below the sentence. Put interpretation in a distinct feedback panel with a short headline and, if useful, one concise explanation. Avoid scattering a verdict, a calculation, and duplicate instructions across unrelated panels.

### Alignment and space

- One datum, one row: label, mark, and value share layout tracks and a scale.
- Metadata sits above the item in reserved space, outside its content surface.
- Keep labels attached when wrapping; let content size the row instead of synchronizing separate columns with offsets or guessed heights.

Remove numbered lesson kickers, repeated 'predict then reveal' labels, draft labels, and explanatory mini-paragraphs that repeat the visible control. Keep review status in repository documentation. Additional calculations can live in a 'Calculation' disclosure. Include model assumptions only where their absence could mislead, usually in a collapsed 'Model notes' disclosure. Explain a material analogy limitation near the relevant claim rather than adding a boilerplate footer to every figure.

## Make interaction immediate and controllable

A slider must visibly change the mechanism, comparison, or an appropriate preview while it moves. Updating only its numeric label is insufficient. In hint mode, immediate feedback still respects the information boundary.

For a temporal process, offer explicit Run/Pause, Step, and Reset controls when they help. Start motion only after a user action. Pause when inputs change, on reset, and at the end of a bounded sequence. Keep displayed state, active controls, and feedback synchronized. With reduced motion, use discrete updates without travel animations. A static diagram needs no playback bar.

Use native buttons and inputs with visible labels, keyboard focus, and at least 44 px hit targets. Avoid capturing keys while someone is typing. Spatial dragging needs button or keyboard alternatives if changing the view is essential. Provide a meaningful accessible title/description and a text equivalent for visual state. Keep small-screen reading order aligned with the interaction order.

## Inspect and deliver

Create or run no automated tests, snapshot checks, coverage jobs, or benchmark suites. Inspect the model and state transitions directly. When browser access is available, manually look at light/dark themes, the permitted controls, a narrow viewport, and reduced motion. Check a hint artifact's source for later answers as well as its visible surface. A blocked browser action is not permission to use a workaround; report the missing visual review honestly.

Deliver the file link with one short exploration prompt and return to the learner's explanation. Keep GIF capture separate until the owner approves the current HTML. When feedback changes a general design rule, update this reference or the shell as well as the example. Do not encode a particular scene's labels, equations, or learning steps into the reusable shell.
