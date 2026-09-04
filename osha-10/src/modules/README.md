# Training modules

Reusable mechanics live in `src/shared`. Module content and orchestration live
under `src/modules/<module-name>`.

## Building independent modules

The project has build targets for `module-1` through `module-6`. Every target
uses the shared HTML shell and shared mechanics, but Vite aliases
`@game-module` to that module's `module.js` entry file.

Each target has a matching `src/modules/module-N/module.js` entry. Module 2's
excavation implementation lives directly under `src/modules/module-2`.
Module 1 loads `Scenario1.glb`, begins with its
hazard-identification step, and then opens its module-owned trench-protection
scenario. Modules 3–6 currently have scaffold entries that can be replaced as
their scenes are implemented.

Common commands:

- `npm run dev:module-1` develops Module 1;
- `npm run dev` or `npm run dev:module-2` develops the current Module 2;
- `npm run build:module-1` writes `dist/module-1`;
- `npm run build:module-2` writes `dist/module-2`;
- `npm run build:all` writes all six independent module folders;
- `npm run preview:module-1` previews the Module 1 production build.

Every `module.js` entry exports `moduleMetadata`, `interfaceConfig`, and
`createScene(context)`. Module metadata controls the browser title and build
identity; interface configuration supplies the visible start-screen and HUD
content. The scene factory receives the shared Babylon engine, canvas, scoring
system, and module-complete callback.

## Shared interface structure

`index.html` is intentionally only an application mount and module-script
entry. It contains no learner-facing content. Each module exports an
`interfaceConfig` alongside `moduleMetadata` and `createScene`; that config
provides the start-screen, controls, mentor, statistics, placeholder, and
completion copy.

Shared view factories create the DOM needed by each interface area:

- `src/shared/ui/start-screen` owns the start screen;
- `src/shared/ui/main-interface` owns the canvas and persistent game HUD;
- `src/shared/gameplay/hazard-identification` owns hazard hints and dialogs;
- `src/shared/gameplay/utility-marking` owns the 811 interface;
- `src/shared/gameplay/comic-choice` owns comic dialogue and choices;
- `src/shared/gameplay/trench-setup` owns trench planning and reinspection.

Each area imports its own stylesheet. Generic reset rules live in
`src/shared/styles/base.css`, while shared modal styling lives in
`src/shared/ui/game-dialog`. A mechanic creates its interface only when the
module initializes that mechanic, so unused mechanic markup is not added to
the page.

## Configuring module flow

The shared `setupGameFlow` runner reads a module-owned `config/gameFlowConfig.js`
file. A module controls its event order by listing steps with stable `id`,
`mechanicId`, and `nextStepId` values. Reordering that list and its links does
not require changes to the shared runner.

Each flow step may also define:

- `activation: "manual"` when a player-facing objective opens the mechanic;
- `activationDelayMs` for delayed scenes or transitions;
- `pauseMovement: true` while the step is active;
- `preactivateNextOnBeforeComplete: true` when the next mechanic must become
  ready during the current mechanic's closing transition;
- `objective` copy and an `actionId` resolved by the module scene.

The module scene registers its mechanics by `mechanicId`. Each non-terminal
mechanic exposes `onComplete()`, and may expose `activate()`, `deactivate()`,
`isComplete()`, `isBlocking()`, or `onBeforeComplete()` as needed. Collections
such as a set of hazards can be combined with `createMechanicGroup()` and then
used as one flow step.

The runner validates duplicate and unreachable steps, unknown mechanics and
destinations, cycles, missing completion hooks, and invalid activation delays
when the module initializes.

## Reusing the 811 mechanic

Each module provides a `config/utilityMarkingConfig.js` object and passes it to
`setupUtilityMarking({ canvas, config })`. The shared mechanic owns rendering,
answer handling, progress, feedback sounds, responsive positioning, and the
completion event.

Each module config owns:

- the aerial background image and accessible description;
- call-to-action, instruction, quiz, feedback, and reminder copy;
- marker color and source-image coordinates;
- utility-answer choices and the correct answer ID;
- excavation methods;
- any number of dig zones, their source-image bounds, and correct method IDs;
- visual class names and transition timing.

Answer IDs, method IDs, and zone IDs are data keys. They do not need to match
the excavation module's names. The shared mechanic validates duplicate zone IDs,
unknown correct answers, and unknown zone methods when it is initialized.

## Reusing the comic-choice mechanic

Each module can provide a page graph like
`config/stormComicConfig.js` and pass it to
`setupComicChoiceScene({ canvas, config })`.

- `dialogue` pages contain a title, optional body, and either `nextPageId` or
  `complete: true`.
- `choice` pages contain any number of choices. A choice can use `retry: true`,
  branch with `nextPageId`, or end the story with `complete: true`.
- Pages may override the default background image or speaker portrait.
- Choices may define feedback, correctness sounds, and transition delays.
- Cycles and branches are supported, but every configuration must have at least
  one reachable completion path.

The shared mechanic provides navigation history, answer rendering, feedback,
responsive comic presentation, completion events, and configuration validation.

## Configuring trench placement

The shared trench planner receives a module-owned `trenchPlacementConfig`.
Protection and configuration buttons, device cards, dimensions, model assets,
snap points, validation rules, feedback, and button labels are generated from
that scenario data.

To vary a module:

- omit a protection or set `available: false` to remove its button;
- set `accepted` and `rejectionFeedback` for scenario-specific decisions;
- add configurations with their own prefab, dimensions, and placement rules;
- list the device IDs available and required for each protection;
- add or remove device definitions to change the placement palette;
- provide module-specific egress assets, copy, timing, and completion text.

The engine validates duplicate IDs, unknown device references, missing accepted
configurations, and missing placement definitions during initialization.
