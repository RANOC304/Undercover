# Contributing to Undercover

Open an issue with your browser or device, the game mode, the language setting, and the steps to reproduce the problem. Use sample player names and word pairs when sharing screenshots.

For a pull request, follow the [local setup](README.md#run-locally) and run `npm run build` in `undercover-app`. Describe what changed and what you tested. For gameplay or layout changes, check the affected game mode in both languages where applicable.

Edit the [bilingual word lists](undercover-app/src/app/data/words.data.ts) directly when contributing word pairs. The legacy generators at the repository root write a single-language list.
