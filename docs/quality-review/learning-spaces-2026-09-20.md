# Interactive learning spaces — Production verification, 2026-09-20

## Shipped scope

- Existing main entry cards and 100-stage map dispatch to the new math/Hanja renderers. Existing stage IDs, `sianhi-v2`, reward IDs and unrelated game engines remain in use.
- Math: 100 stages; reasoning math: 100 stages; early arithmetic: 30 stages. These are 230 connected stage missions, not 1,150 individually authored questions. Five generated variants per stage form the 1,150-case test set; normal UI currently uses variant 0.
- 30 modes: comparison, counting, ordering, position, shape classification, composition, rotation, length, weight, capacity, clock, money, patterns, two-attribute matrix, chart, fraction, area, perimeter, mirror symmetry, ratio, color classification, shared shape, odd one out, stepping paths, Venn, classification tree, pairs, strategic line completion, addition and subtraction.
- Math and reasoning each have ten progressive chapters. Objects use SVG bevels, contact shadows and CSS depth; scenery, game objects and text are separate layers. This is lightweight 2.5D, not a WebGL 3D scene.
- Hanja: 100 lessons over 29 characters and 128 strokes. Lessons 1–29: A,A,B,B,C,D; 30–58: B,C,D; 59–87: C,D; 88–100: D. A=full guide, B=dotted, C=faint, D=memory. Each lesson ends with picture/character matching after the writing rounds.
- Pointer Events share mouse/touch/pen handling; writing is scoped `touch-action:none`. Resampled stroke assessment checks direction, start/end, corridor and coverage, with child-friendly tolerance. Wrong strokes invite retry and do not award progress.
- Source: 27 characters from AnimCJK `graphicsKo.txt`; 田 manually authored; 森 composed from the Korean 木 strokes. Licenses and distinction are in `assets/learning/hanja/NOTICE.md`. The two authored entries have not received external teaching-expert review.

## Automatic gate

`npm test` passed after final UI changes. Includes existing syntax/assets, 800-stage schema, 2,800 generated questions, 2,500 Korean semantic questions, 36 runner stages, ocean, STAR_POWER, collision, claw transport/award, brick renderer and save-preservation suites. New coverage: 1,150 mission variants, Venn exclusive/intersection/neither, valid strategic lines, 128 stroke paths (normal/tremor/reverse/displaced/scribble), 100 Hanja lessons and legacy save preservation.

## Production browser interactions actually performed

Application commit tested: `4998937dfc51ad2cef4d83070dbb61c3fcc8c9ad`.
Vercel deployment `dpl_3nrpKAp9uTKB54qn2iQt1yfi79kS`: READY, production, matching SHA.

- Direct `https://sianhi.vercel.app/`: main Hanja card -> stage map -> real writing canvas. Mouse wrote 一; next writing; reload -> resumed at writing 2/6.
- Main HTML rendered in the existing mobile review frame: math card -> stage 1 -> correct comparison -> reload -> stage 1 marked complete and stage 2 unlocked. Existing other saved stars remained.
- Advanced cases used `tests/learning-space-review.html`, loading the same deployed modules with isolated memory storage. They are not customer-save mutations or forced success hooks.
- Color classification: actual mouse drag succeeded; wrong drop rejected; select-object/select-target alternative completed all pieces.
- Matrix: all six color/shape candies placed successfully.
- Venn: star-only, yellow-only, intersection and neither all completed.
- Tree: selected each object, chose shape branch, then size leaf; completed all four.
- Stepping path: four consecutive moves sharing exactly one attribute completed.
- Strategic board: wrong yellow piece rejected; red star completed the actual four-piece row.
- 一: reverse direction rejected, vertically displaced stroke rejected, normal mouse stroke accepted; all six writing rounds including memory completed, meaning matching awarded a star and unlocked lesson 2.
- 山: wrong-order stroke rejected; unrelated scribble rejected; three correct strokes accepted in order.
- Problem-listen button invoked in the real main flow. Audio output quality was not listened to on a physical device.
- Scoped CSS fixed an inherited legacy arcade !important blue shell; home itself was not redesigned.

## Mobile-width checks (Production code in browser frames, not physical Safari)

| Width | Math content horizontal overflow | Venn / strategy overflow | Hanja canvas width | Hanja tool height |
|---|---|---|---|---|
| 320 | none | none | 229 px | 44 px |
| 390 | none | none | 299 px | 44 px |
| 430 | none | none | 339 px | 44 px |

Dialogs remain inside frame width with 8 px side clearance. Tall Hanja scenes use internal vertical scrolling; reset/hint/next remain accessible. Strategy cells: 56.5×51, 63.25×61, 73.25×61 px. Screenshots were visually inspected at 390px for objects, Venn zones, handwriting and palette. No application runtime errors were seen in final checked flows; browser-extension metadata errors are unrelated.

## Explicit limits

- No physical iPhone/iPad Safari, Apple Pencil, real touch multitouch or device performance/FPS run was available. Mouse drag is actually tested; touch/pen share code but are not hardware-verified.
- Not all 230 missions or 100 Hanja lessons were manually played; generator/stroke suites cover their data. Rotation, mirror, clock, fraction and money did not receive full manual end-to-end runs in this pass.
- No child usability study proves independent nonreader comprehension. Pictures, sample objects, audio buttons and tap/drag alternatives are implemented; advanced missions still require listening or guidance.
- Writing assessment is corridor-based learning feedback, not general handwriting recognition. AnimCJK provenance does not mean every Korean pedagogical convention has been externally certified.
