# Maintaining Make Games with Sichuang / 一桌点子

The visitor introduction lives in [README](../README.md) and [中文介绍](../README.zh-CN.md).

## Local development

Use Node 24 and pnpm. Install the website dependencies with `pnpm install --frozen-lockfile`. Run `pnpm game:build` once, then `pnpm dev`.

`pnpm check` checks the website types. `pnpm build` runs the content checks, builds the pinned Rule Lab source, and builds the website. On a clean machine the game build installs its locked dependencies with `npm ci` automatically. Game output at `public/play/rule-lab/` is generated and excluded from Git.

After changing content, run `pnpm search:index` and then `pnpm copy:audit` before the full build. Run `pnpm game:test` after changes to the integrated game or its build. The game retains its own test suite and dependency lockfile.

## Game and video

`games/rule-lab/UPSTREAM.md` records the upstream revision. Update the source snapshot deliberately; do not copy an unversioned dist directory. Runtime art and audio are included. The original sibling project remains independent. The game is loaded only after clicking Play, in a same-origin iframe, with a separate-tab option. It currently has Chinese UI and no persistent game session.

`public/media/rule-lab/` contains the existing game icon, video cover, and 24-second H.264 film. The video has controls, baked-in Chinese captions, and no autoplay or preload. It does not load on the course homepage.

## Publication

Repository: `NBrangerF/tabletop-design-workshop`. Vercel production branch: `main`. Existing production domain remains `luozhuo-tabletop-design.vercel.app` so saved links continue to work. The new brand does not rename storage keys or existing course URLs.

Vercel uses `vercel.json` and `pnpm build`. Only `/play/rule-lab/` allows same-origin framing; other pages retain their previous framing policy. Internal learning and search-indexing settings retain their existing scope.

## Editorial and content maintenance

- [Editorial style](revision/EDITORIAL_STYLE.md)
- [Library maintenance](handovers/2026-09-11-library-maintenance.md)
- [Previous detailed maintenance notes](handovers/2026-09-14-previous-maintainer-readme.md)

README structure references reviewed on 2026-09-14: [The Evolution of Trust](https://github.com/ncase/trust), [Excalidraw](https://github.com/excalidraw/excalidraw), and [Lichess](https://github.com/lichess-org/lila). We used the direct play link, product image, clear purpose, and language navigation patterns. No project copy or images were reused.

## Article illustrations

Use the homepage’s paper-board diagrams as the reference for explanatory visuals. Add a concrete diagram where movement, timing, resources, or a rule comparison benefits from one. Keep both languages equivalent and place each figure beside its relevant explanation. See [the illustration guide](product/article-illustration-guide.md) for coverage, editorial rules, and maintenance.
