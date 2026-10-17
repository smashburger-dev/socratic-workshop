# Sources and design provenance

## Video

Miles Cranmer, [How to Avoid AI Brain Rot](https://www.youtube.com/watch?v=uXC7OuCas2Q&t=1438), uploaded by [MPhil in Data Intensive Science Cambridge](https://www.youtube.com/@MPhilDISCambridge), 16 October 2026. Requested segment: **23:58 through 34:33**.

The design was informed by YouTube's timestamped English automatic captions, retrieved on 17 October 2026 using the already available `yt-dlp` metadata client and YouTube timedtext. No full video download was needed. The chapter boundaries below are derived from those captions; they are not official chapter labels. Automatic transcription can contain errors. Slides and on-screen demonstrations were not independently inspected.

| Interval | Source-grounded design input |
| --- | --- |
| [24:00–24:59](https://www.youtube.com/watch?v=uXC7OuCas2Q&t=1440) | The learner explains; the AI asks questions; gaps lead to hints, reading, and another attempt. |
| [25:00–29:10](https://www.youtube.com/watch?v=uXC7OuCas2Q&t=1500) | Ground tutoring in books and papers; recognize limitations around niche subjects and new research. |
| [29:11–31:11](https://www.youtube.com/watch?v=uXC7OuCas2Q&t=1751) | A worked discussion of L2 regularization and Gaussian priors uses one question at a time, withheld answers, and requested hints. |
| [31:12–32:34](https://www.youtube.com/watch?v=uXC7OuCas2Q&t=1872) | Interactive concept demonstrations, including the learning rate in gradient descent; generated demos can be wrong. |
| [32:35–34:33](https://www.youtube.com/watch?v=uXC7OuCas2Q&t=1955) | Visual inspection can expose implausible agent results. A fitted trajectory crosses a floor despite apparently fitting motion measurements. |

This repository paraphrases the methods and links to the source. It does not redistribute the transcript, slides, or video. The video is inspiration, not an endorsement of this skill or evidence of its learning effectiveness.

## Noa's design brief

The project owner specified learner-led explanations, requested hints, external study material, retrospective project learning, standalone HTML, a portable Workbench visualization adapter, no automated tests, and private development until approved examples and recordings exist. The private voice-note text is not bundled with the repository.

The hint ladder, small session handoff, completion criteria, optional prediction/application, spoiler boundaries inside HTML source, and illustrative promotional scenes are this skill's design choices. They should not be attributed to Cranmer as claims made in this segment.

The owner's UI feedback on 17 October 2026 added English presentation, quieter layouts, larger type, light/dark controls, immediate visual feedback, co-located actions, and optional spatial views. Those preferences are implemented in the portable adapter and copyable shell. The Spanish example replaces the initial German example. GIF capture follows approval of the HTML.

## Workbench

The bundled [portable adapter](workbench.md) credits its Argmin source and records which principles were adapted. It carries the visual approach without Argmin's project structure or automated-test workflow. The adapter is not a claim that the original skill already generalized to every subject.

The owner also identified [Anatomy by wheresryan22](https://github.com/wheresryan22/anatomy) as visual inspiration. Its upstream repository and MIT license were checked on 17 October 2026. This version credits the approach without bundling Anatomy code or making it a dependency.

## Packaging

The folder layout and frontmatter follow the [Agent Skills specification](https://agentskills.io/specification), consulted on 17 October 2026. Product-specific UI metadata is kept in `agents/openai.yaml`; the learning workflow does not depend on it.

Installation commands follow the [skills CLI](https://github.com/vercel-labs/skills). Invocation syntax follows the official [Codex skills documentation](https://developers.openai.com/codex/skills/) and [Claude Code skills documentation](https://code.claude.com/docs/en/skills), checked on 17 October 2026. The [MIT license text](https://opensource.org/license/mit) replaces the private-development notice at the owner's request.

## Browser APIs

The theme implementation follows the system preference described by [MDN's prefers-color-scheme reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme), with a user override. This implementation reference was consulted on 17 October 2026.
