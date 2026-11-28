# CLAUDE.md

React + TypeScript + Tailwind resume site built with Vite. See [README.md](README.md) for structure, scripts and the `resume.json` editing rules.

## Commands

- `npm run test` is watch mode and never exits. Use `npm run test:run` or `npm run test:coverage`.
- Before calling a change done, run what CI runs: `npm run lint`, `npm run test:coverage`, `npm run build`.

## Gotchas

- Coverage thresholds in `vite.config.ts` (95% statements/lines, 90% branches, 85% functions) fail the run. New components need tests in `src/tests/`.
- Component tests use their own fixtures. `src/tests/resumeData.test.ts` validates the real `src/data/resume.json`, and `src/tests/App.test.tsx` renders it, so keep App test assertions tolerant of content edits (`getAllByText`, not `getByText`).
- Changing the name or tagline in `resume.json` means updating the title, description and Open Graph tags in `index.html`, and the link-preview image `public/og-image.png` (it shows the name, role and key skills).
- Renaming the CV files in `public/assets/cv/` means updating the links in `src/components/DownloadButtons.tsx`.
- `tsc` is TypeScript 7, installed under the alias `@typescript/native`. The `typescript` entry is an alias for TypeScript 6 (`@typescript/typescript6`) that only exists because typescript-eslint's peer range stops below 6.1. Don't `npm i -D typescript@latest`; once typescript-eslint supports TypeScript 7, replace both aliases with a plain `typescript` dependency.
- The mobile menu closes on the backdrop's click, not on a document `mousedown`. Closing on mousedown removes the backdrop mid-tap and the click lands on the page underneath.

## Workflow

- Commit directly to `develop`. No feature branches.
