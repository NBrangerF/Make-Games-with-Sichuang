# 一桌点子 / Make Games with Sichuang

The website now uses the requested bilingual name. Main navigation adds Play & learn / 玩着学, with a large Rule Lab feature below the course hero. The new `#play/zh-CN` and `#play/en` routes offer the game, the existing 24-second promotional film, and three questions for reflecting on rule changes.

The game is copied from the owner’s Rule Lab 1.8.1 source revision `7c40dcecefa50d9c7ac4d0029fb1d078765fbe27`. Source and locks, tests and test fixtures, runtime images, audio, and notices are in `games/rule-lab`. The independent sibling project was not edited. The website build produces the embedded game at `public/play/rule-lab/index.html`; generated files stay out of Git. A fresh deployment installs the game dependencies using its own lockfile.

The game starts on request. The film has native controls, a poster, `preload="none"`, Chinese captions baked into the picture, and no autoplay. English readers are told that the game and film currently use Chinese. Refreshing or leaving the game resets its current session. No new persistence or account system was added.

Brand changes cover the shared header, page titles, course/library bylines, downloads, HTML description, and bilingual README. Existing storage keys, course URLs, repository name and production hostname are retained. “落桌” meaning putting a prototype on the table remains where it is an ordinary action or historic record, rather than a brand label.

The English README presents the website with a real homepage screenshot, immediate play/read links, a concrete rule-change example, and ways to start. README.zh-CN.md gives a matching Chinese introduction. Maintainer details moved to docs/DEVELOPMENT.md; the former README is preserved separately as historical maintenance notes. GitHub description and homepage now use the new identity.

Validation: website typecheck and full build passed. Existing navigation and accessibility checks now include five entries and the new page; bilingual route round trips pass. Rule Lab’s 34 other test files passed; the presentation test initially lacked its original stage/audio fixtures, then passed all four tests after these were included. Browser checks covered 1280, 390 and 320 px, English/Chinese navigation, a played hand and the rule selection dialog. The actual same-origin framing headers, production game, and video are checked after deployment.
