# 2026-09-20 mobile visual correction verification

Source: tleodh1/sianhi main, https://sianhi.vercel.app/.

Preserved: 9 worlds / 36 stages, numbered last-stage bosses, STAR_POWER,
saved progress, toy catalog, crane grip rules, brick stages and reward persistence.

Production Chrome executed current index.html and its real assets inside a same-origin
srcdoc frame at 320, 390 and 430 CSS pixels using tests/mobile-visual-review.html.
This is viewport verification, not physical iPhone Safari verification.

| viewport | world map client/scroll width | crane client/scroll width | brick dialog client/scroll width |
| --- | --- | --- | --- |
| 320 | 274/274 | 286/286 | 252/252 |
| 390 | 344/344 | 354/354 | 322/322 |
| 430 | 384/384 | 393/393 | 362/362 |

Observed 36 map stages, 36 crane toys, readable locked IDs/BOSS labels,
map remaining visible after focus/width changes, brick launch, movement,
brick removal and score increasing from 0 to 100. DROP consumed a play coin
and entered descend. Crane's complete grip/lift/release/result lifecycle is
covered by the existing deterministic simulation tests.

Automated: npm test, all existing regressions plus circle/rectangle contacts,
corner misses, bounded 7-point trail, 48-spark cap, 200 full backing-buffer
clears, DPR cap and resize, and front/back projection separation.

Limitations: no physical iPhone/Safari GPU or FPS measurement; no claim that
all eight requested motion cases were manually reproduced in Safari.
Chrome snapshots showed no persistent long smear. Screenshots are attached.
