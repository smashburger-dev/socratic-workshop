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
- An exploded view answers "what is this made of and in which order": the object comes apart along its assembly axis, and each part explains itself on click. Read [exploded-view.md](exploded-view.md).

These are examples, not a fixed subject catalog. Apply the same cause-and-effect reasoning to science, mathematics, language, code, planning, or business. Every visible object should carry a meaning or a control.

Use crisp vector geometry and legible HTML labels where possible. Label axes, units, and scale. Keep the scale stable during a comparison or playback so rescaling cannot disguise growth. Fix the axes for the whole range of every control, not for its current value: dragging an input moves the mark across a still chart and never rescales it. If a value leaves the view, show that fact and the actual value rather than clamping it silently. A second chart should answer another necessary question, not decorate the first.

## Keep the interface quiet

The default surface contains a short title, at most one useful introductory sentence, the visualization, its controls, and its current result. Use English for shared examples and default interface copy; honor the learner's explicit language choice. The subject's actual language remains unchanged in a language-learning example.

Respect the system preference initially and provide a visible toggle. Keep essential labels readable in both themes. Saving the theme is optional and must tolerate storage being unavailable. Do not persist learner answers without a request.

### Glass

The visual language is Noa's `design-glass`, adapted for learning. In one sentence: the mechanism fills the screen, every control floats over it as frosted glass with quiet neutral type, and colour appears only where a value or the current state lives. The tokens live in the shell; this section says how to use them.

- **The work runs under the chrome.** The stage (the figure and its background field) spans the viewport. The pillar and the toolbar are docked over it; the header (title, intro and the keyboard legend in the upper third) sits directly on the work without a panel. Place the figure's plot area in the free space beside the panels, never under them, but let the stage background continue beneath them so the glass has something to blur.
- **Glass for controls, never for content.** The pillar, the toolbar, popovers, tooltips and the theme switch are glass. Marks, tiles, curves and isometric parts are content: solid, never blurred, never translucent glass. (Apple HIG, Materials: "Don't use Liquid Glass in the content layer.")
- **Chrome is docked, not floating.** Persistent chrome is fixed to the window edges, like chiasma: the control pillar runs the full height of the right edge, the toolbar runs the full width of the bottom edge (from the window's left edge to the pillar), both square-cornered, with one 1 px edge only on the side that faces the work. Groups inside them are divided by full-height (in bars) or full-width (in pillars) strong separators; soft separators inside a group stop at the inset. Only things that come and go are rounded floating glass: popovers, tooltips, notices, the theme pill. Buttons, fields and segmented controls inside the chrome keep their own radii.
- **Docked chrome reflows, it never wraps into a mess.** Bars keep one row at every width: groups never wrap onto a second line; below the width that fits, the bar scrolls horizontally inside itself. Below 900 px the pillar moves under the figure as full-width, square-cornered glass sections divided by separators, and the toolbar stays docked to the bottom edge. Check 1280 × 720, 1600 × 900, 1920 × 1080 and 390 × 844 before calling a layout done.
- **Glass is one recipe.** Tint at about half opacity, blur 6 px on docked chrome (4 px on popovers and pills), one 1 px light edge on the side facing the work, radius 0 on docked chrome and 16 on floating surfaces. No drop shadows, no gradient on the glass itself, no glass on glass.
- **Neutral by default.** Text and lines are the text colour at fixed alpha tiers, never a grey hex: 1.00 titles and active items, 0.84 values, 0.68 body and rows, 0.60 labels, 0.56 hints and axis ticks (the lowest tier for anything meant to be read), 0.31 off states. Grid lines white 0.07, axes 0.20, neutral data marks 0.74. Hierarchy comes from alpha and one weight step (regular, semibold), never from extra colours.
- **One accent, used as a gradient.** The Ember accent runs amber → coral. Its main use is the selection look (amber 0.15 → coral 0.06, edge amber 0.30) and the current value: the active mark, the slider fill, the moving part, the limiting bar. A second state of the same quantity (a preview, a prediction) uses coral as an outline. Everything else stays neutral. If a figure needs a third category, use a neutral tier and a shape cue before adding a hue.
- **The work is a calm, plain ground.** The ground is flat and neutral (`--work`), fixed to the viewport so opening a panel never moves it. No dot grid, no texture, no glow, no spot: a pattern behind a figure competes with it. Colour on the work belongs to the figure's values and to the header intro. A 3D scene gets a world instead of a pattern (see the exploded view: a floor that runs to a horizon and a round plinth under the object).
- **Marks explain themselves.** Every mark that carries meaning (the current point, a preview, a guide, a part) is a focusable button. Clicking it, or Enter, opens a small glass popover beside it: the name, one or two sentences, and its live value if it has one. Esc, a click outside, or a second click closes it. One popover at a time. The legend entries open the same popovers. A hint artifact explains only marks within the hint's scope.
- **No visible gradient steps.** Any gradient wider than about 120 px interpolates in OKLab (`linear-gradient(in oklab, …)`) and carries a fine noise dither (a tiled inline SVG `feTurbulence`, 3–4 % opacity) so 8-bit banding never shows, in light mode especially. Check the slider fill and the stage floor at 2x zoom in both themes.
- **Popovers sit beside, never on top.** A popover never covers the thing it explains. Place it 32 px from the mark's (or part's) screen bounds, trying right, left, above, below in that order, and take the first side where it fits entirely inside the free space without overlapping the mark. If no side fits (the mark fills the view), dock it to the nearest edge of the free space and keep it off the mark's visible area. A 1 px leader line (text 0.31) always joins the mark's nearest bound to the popover's nearest edge and is never shorter than 24 px; it updates every frame and never disappears while the popover is open. The side is chosen once, when the popover opens or its subject changes, and then stays locked: when the mark moves (spin, zoom, playback), the popover slides along its side with a short spring and, if that side runs out of room, docks to the free-space edge on the same side. It never flips sides while the same subject is open.
- **Readouts share one size.** Numbers that sit side by side (step, x, loss) use the same size and weight; only their labels differ.
- **Five text styles, nothing in between.** Type is Inter with system fallbacks, regular or semibold, never heavier. The ramp follows Apple's text styles at their large default size (HIG Typography: body 17 pt on iOS). Use only these, by role, so no element feels oversized next to its neighbours:

  | Style | Size / line | Weight | Roles |
  | --- | --- | --- | --- |
  | Title | 30 / 36 | semibold | page title |
  | Title 3 | 20 / 25 | semibold | section titles in the pillar |
  | Headline | 17 / 22 | semibold | feedback headline, popover title, part name |
  | Body | 17 / 22 | regular | control labels, slider values and toolbar readout values (tabular), disclosure rows, feedback text |
  | Subheadline | 15 / 20 | regular | button labels, bar status, readout labels, legend, axis ticks, popover text, hints |

  15 px is the floor for anything meant to be read. A number is one step above its own label and never larger than the text around it: toolbar readouts are Body 17 over Subheadline 15 labels.
- **One spacing scale.** Every gap is a step of 4, 8, 12, 16, 24, 32 or 48 px; no other values. Stage padding 32. Title to figure 32. Pillar sections: padding 24, divided by full-width strong separators with no gap. Section title to first control 16. Label to its control 8, control to the next label 24. Toolbar: 64 high (10 around 44 px buttons), content inset 32 from its ends, 8 between buttons, 24 on each side of a full-height separator, 32 between readout columns; the action group sits at the start, the readout group at the end. Readout label sits 4 above its value. A single-line status in a bar ("Part 2 / 8") uses the button text style (Subheadline 15, tabular) and a reserved width, not a larger readout size.
- **Rows centre their content optically.** A disclosure row (Try a prediction, See the calculation, Model notes) is exactly 52 px from its separator to the next separator (or to the panel's padding edge), with its label centred on cap height, not on the line box: use `text-box: trim-both cap alphabetic` where supported and an equivalent padding fallback. Measure it: the gap from the separator to the cap top equals the gap from the baseline to the next line, within 1 px. The chevron sits on the same optical centre at the panel's right padding. Opened content starts 8 below the row and ends 16 above the next separator.
- **Fills never touch lines.** A hover, press or selection fill is its content box plus equal padding on every side (at least 8 horizontal, 4 vertical), with the content centred inside it. It never touches or covers a separator, a panel edge or a neighbouring fill; keep at least 4 px clear. Consecutive rows have no margins between them: the space between two separators belongs to exactly one row, split equally above and below its content. Measure separator to separator, not the element's own box, and check the hover state, not only the resting state.
- **One button type everywhere.** Every button in every visualization, including the theme switch, is the same type: 44 px high, padding 0 16, radius 10, field fill and field edge at rest, Subheadline 15 label, an optional 18 px icon 8 px before the label, the shared hover/press/focus states. Primary or active = the selection look on that same shape. No pills, no one-off button styles.
- **Choices of one state are a segmented control.** Two or more mutually exclusive states (Assembled / Exploded) form one control in the button type: one field-look track (r10), equal-width segments divided by a 1 px soft separator inset 10 px top and bottom. The track has no inner padding and clips its content (`overflow: hidden`). The active segment's whole area takes the selection gradient as a plain square fill; only the track's own outer radius rounds it at the ends. There is no inner pill, no inner radius and no inner edge. The gradient fill crossfades between segments in 200 ms. Actions that are not states (Above, Eye level) stay separate buttons.
- **Toolbar controls use the room they have.** In a docked toolbar the action group fills the space up to the status group: each text control grows equally (`flex: 1 1 0`) from its content width up to 200 px (a segmented control counts as one unit per segment), and shrinks back to content width before the toolbar starts scrolling. Icon buttons never stretch; they stay 44 × 44.
- **The header has one layout.** Title, then the intro 4 px below, then the keyboard legend 8 px below that, all sharing one left edge at the stage padding (check the glyph ink, not the boxes: the title's larger size must not sit visibly indented or outdented against the lines below). The theme button sits at the top right, its centre on the title's first line. Nothing else goes in the header. The intro line is set in the Ember gradient (amber to coral, `linear-gradient(90deg in oklab, …)` clipped to the text, weight 500); it is the one decorative use of the accent. Dark theme uses the theme's amber and coral; light theme uses darker stops (`oklch(0.55 0.15 60)` to `oklch(0.52 0.17 35)`) so the text keeps at least 4.5:1 against the ground. The title stays neutral.
- **A figure that runs under the header gets a docked top bar.** When the figure fills the whole stage (3D scenes, exploded views), the header becomes a docked top bar in the same glass as the toolbar: full width, square, 1 px edge only at the bottom, padding 20 top and bottom, so the figure passes visibly under it instead of being cut off. In a docked top bar the theme button is centred vertically in the bar, not on the title line. When the figure sits beside the header (charts), the header stays on the work.
- **Icons for familiar actions.** Reset view and similar universal actions are 44 px square icon buttons (a counter-clockwise arrow for reset) with an `aria-label` and a tooltip after 500 ms hover. The icon is 18 px, 1.7 px round-capped strokes, sized by `width`/`height` attributes and CSS both, because an unsized inline SVG grows to 300 × 150 and drags its button with it. The icon button is exactly as tall as its text neighbours. Use text where the action would be ambiguous as an icon.
- **Reserve the size of anything that changes.** A box whose content changes while the learner interacts (readouts, Run/Pause, status lines, notices, popovers with live values) is sized for its longest state before the first interaction: tabular numerals, a fixed width in `ch` from the longest value the model can produce, the wider label for toggling buttons. Dragging a slider moves marks and digits, never the layout around them.
- **Readouts are centred columns.** Each readout is one fixed-width column: label above, value centred under it, 32 px between columns, the same width for every column in a row.
- **Everything clickable says so.** A learner who has never seen the page must find every control without instructions. At rest, controls look like controls: buttons have a field or selection fill, rows that open carry a chevron, marks have a visible shape and a pointer cursor. On hover, the whole hit area takes the hover fill (text 0.05) with the element's radius and the chevron rises to 0.84; on press 0.08; keyboard focus shows the amber ring. A disclosure row's hover fill spans the full row width, bleeding 8 px into the panel padding on both sides, radius 10, and stays 4 px clear of the separators above and below. Opening rotates the chevron 180° in 200 ms. Nothing clickable looks like plain text, and nothing that is plain text reacts to hover.
- **Concentric corners.** When a control sits 12 px or less from its container's edge, the container's radius is the control's radius plus that padding (HIG: concentric corners). A segmented track with 2 px padding around r8 segments is r10. Other radii: 0 docked chrome, 16 popovers and floating notices, 10 buttons and fields, 8 tiles and inset groups, 2 chart bars.
- **Marks are big enough to see at a glance.** The current mark is at least 14 px across; a preview or target mark is larger than the current one (ring 20 px across, 2.5 px stroke), so the eye finds where the change lands. An arrow stops 3 px before the mark it points at; it never runs into or under it. Hit areas stay 44 px.
- **Accessibility settings win.** With `prefers-reduced-transparency`, glass becomes an opaque tint without blur. With `prefers-contrast: more`, edges rise to 0.40 and the 0.56/0.60 tiers to 0.80. With `prefers-reduced-motion`, values jump without travel.

Size SVG text for its actual rendered width; shorten copy or reflow before shrinking it. Keep math tokens on one line (`x&nbsp;=&nbsp;3`, `η&nbsp;=&nbsp;0.25` with non-breaking spaces). Legend entries show the real mark shape next to their name. Use the accent for the current cause, state, or result, with a text or shape cue as well, so the figure still reads without colour.

Co-locate controls with what they change. Graph playback and readouts live in the docked toolbar under the figure; the legend sits on the work directly under the graph. Reset stays inside the panel it resets. Put interpretation in a distinct feedback panel with a short headline and, if useful, one concise explanation. Avoid scattering a verdict, a calculation, and duplicate instructions across unrelated panels.

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

### Motion

Every change of state moves briefly and softly; nothing teleports, nothing lingers. Motion explains where a thing came from, it never decorates.

- **Popovers and panels arrive.** A popover fades in while scaling from 0.96 and sliding 4 px from its anchor, 160 ms with `cubic-bezier(0.2, 0.8, 0.2, 1)`; it leaves in 120 ms ease-in. Disclosures open by animating their row height (`grid-template-rows: 0fr → 1fr`), 200 ms. Hover and press feedback 120 ms.
- **The model stays discrete, the drawing glides.** Slider steps and computed values stay exact. The drawn value (slider fill and thumb, the mark on the chart, a bar's length) follows its target with a critically damped spring of about 120 ms, and a new input retargets the running motion instead of queuing another. Draw the slider thumb inside the track background at `--p` and register `--p` with `@property` so fill and thumb glide together while the native input keeps its keyboard and screen-reader behaviour. Numbers the learner reads change instantly.
- **Steps travel the path the figure already shows.** A playback step moves its mark along the path drawn for that change, 320 ms ease-in-out: along the step arrow for a discrete jump (gradient descent jumps; it does not roll down the curve), along the belt for a conveyor. The arrow stays visible while the mark travels it, fades when the mark lands, and the next preview fades in. The chart scale never animates.
- **Motion guardrails.** Animations here fail in the same few ways, so build them like this:
  - Take the start and end of a motion from the model *before* changing state, and end exactly on the model's new state. Never compute the target after mutating (reading `current()` after a push gives the step after next).
  - One animation owner per value: a single `requestAnimationFrame` loop holds the drawn state. A new input cancels or retargets the running motion; a spring and a tween must never both drive the same value.
  - Integrate with the real frame time, clamped (`dt = min(now − last, 1/30 s)`), so motion runs at the same speed at 60 and 120 Hz.
  - Playback timing is longer than the travel (a step every 700 ms, travel 320 ms), so a step never starts from a half-finished one.
  - Verify with numbers, not one screenshot: log the drawn position every frame through a full Run of at least 5 steps and through a fast slider drag. Each step's positions move monotonically from the old state to the new one, land exactly on it, and never jump backward.
- **Every change of focus travels.** Moving the view or the selection from one thing to the next animates from wherever it is now, including from one selected item straight to another (not only from nothing to the first item). Camera target, distance and the popover all retarget the running motion; nothing snaps because a selection already existed. Focus changes use an ease-in-out tween of about 420 ms that starts from the current position and velocity zero; they never overshoot or bounce. Springs are only for values that follow a direct manipulation (dragging, sliding).
- **Reduced motion.** With `prefers-reduced-motion`, values and marks jump, popovers only fade (≤ 80 ms), and idle animation stops.

Use native buttons and inputs with visible labels, keyboard focus, and at least 44 px hit targets. Avoid capturing keys while someone is typing. Spatial dragging needs button or keyboard alternatives if changing the view is essential. Provide a meaningful accessible title/description and a text equivalent for visual state. Keep small-screen reading order aligned with the interaction order.

## Inspect and deliver

Create or run no automated tests, snapshot checks, coverage jobs, or benchmark suites. Inspect the model and state transitions directly. When browser access is available, manually look at light/dark themes, the permitted controls, a narrow viewport, and reduced motion. Check a hint artifact's source for later answers as well as its visible surface. A blocked browser action is not permission to use a workaround; report the missing visual review honestly. Every screenshot you rely on is captured after the last edit to the file it shows, and every claim about it describes what is visible in it, not what the code should produce. When several files share chrome (an exploded view and its examples), build them from one source so a fix cannot land in one and miss the others.

Deliver the file link with one short exploration prompt and return to the learner's explanation. Keep GIF capture separate until the owner approves the current HTML. When feedback changes a general design rule, update this reference or the shell as well as the example. Do not encode a particular scene's labels, equations, or learning steps into the reusable shell.
