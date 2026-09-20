# English spelling and picture-led science — 2026-09-20

## Delivered

Production application commit: 7b26b0c42ddf539b2f785d29956455668abc8539, Vercel deployment dpl_91agMWZSqyenMmx8U8tb7WcxGwFS READY. Follow-up commit adds accurate gesture hints, refreshed lexeme metadata and this report.

English remains 100 stages with existing subject/stage/reward IDs. Chapters: 1–10 explore pictures + spelling + pronunciation; 11–20 listen and find; 21–30 picture/word recognition; 31–40 same-word matching; 41–50 initial alphabet; 51–60 missing alphabet; 61–70 word assembly; 71–80 picture/word matching; 81–90 short phrases; 91–100 sentence scenes. This is 100 configured stages with reusable vocabulary/structures, not 100 unique vocabulary items.

Stage 6 contains DOG, BANANA, CAT, APPLE in shuffled order. Each has an original shaded SVG picture, large spelling, speaker symbol and supporting Korean meaning. Whole-card click explores pronunciation. Exploration does not grade. A start button begins the question; selecting a card still pronounces it; a separate confirmation grades the choice. Wrong choices pronounce the chosen word before retry guidance. Correct choices retain enlarged spelling and picture; the next-stage control appears after 1.4 seconds and requires an explicit click.

Assembly uses unique tile IDs, including both P tiles in APPLE, and accepts sequential pointer taps or dragging to the next slot. Letter-name speech is explicitly separate from whole-word pronunciation. Isolated phoneme audio/phonics recordings are not provided; letter names must not be reported as verified phoneme sounds.

Science retains 100 configured missions: senses, habitats, weather/seasons, floating/sinking, magnets, shadows, plant/animal growth, day/night and controlled light/wind comparisons. Fixed baseline and variable plant scale are both visible. Core art uses 57 original SVG illustrations with gradient lighting and contact shadows, not emoji. Existing math/Hanja/Hangul renderers and persistent save structures remain intact.

## Root causes and speech

Previously core say() returned when state.sound was false/undefined, including explicit learning listen taps. Mixed Korean story/English questions could also be sent as one en-US utterance. Shared LearningSpeech now allows explicit user-gesture listening independently of optional game sound, segments Korean/English, chooses matching installed voices, refreshes on voiceschanged, resumes paused synthesis, cancels prior speech, ignores stale callbacks, retains utterances and shows native errors/timeouts. Session teardown cancels speech.

The cloud Production browser returned native `synthesis-failed`, including on the real main URL, stage 6 whole-card taps and question speech. Actual sound output was NOT heard or verified. Neither real iPhone Safari nor physical touch/Pencil/pen hardware was available. Do not call audio normal based on mocked tests or invocation alone. No prerecorded audio fallback is included.

Old progress badges shared the top-right area with an absolute modal close button. The shared LearningHeader now has separate back/progress/44px-close grid cells and safe-area spacing.

## Automated evidence

`npm test` passed after spelling integration: existing game, saves, learning and tracing regressions; 800 stage schemas, 2,800 generated questions, 2,500 semantic Korean questions, 1,150 math missions and 29 Hanja/128 strokes. Added discovery tests cover all 200 English/science stages, 20 renderer modes, unique answers, experiment outcomes, bilingual speech queue lifecycle, explicit muted listening, voice refresh, stale event cancellation and failure feedback.

Additional focused test passed: ten English chapter modes; stage-6 vocabulary; first/missing letter correctness; all ten assembly tile multisets; duplicate P identity; letter-name separation. All 57 SVG outputs were XML-parsed earlier in this work.

Speech lifecycle tests use mocks and do not prove audible playback. Existing data/stroke tests were regression checks, not regenerated content.

## Browser evidence on deployed code

- Actual homepage -> English saved stage 2 -> normal play stages 2–5 -> stage 6. Four cards explored, question tapped, correct CAT submitted. Reload -> English 7/100. Existing star/progress data retained.
- Production isolated-save review: stage 6 all four card clicks; DOG wrong selection followed by CAT correct; enlarged CAT and next-stage control observed.
- Stage 61: actual mouse drag A tile into slot 1; pointer/click selection P, P, L, E; APPLE completion observed.
- Stage 41 initial A and stage 51 missing P completed. Stage 31 FISH/DOG/APPLE matched by piece then destination selection.
- Earlier this work: science habitat, float/sink, magnet, shadow, plant growth and condition adjustment played through. English old modes were superseded by the spelling curriculum; their previous checks are not counted as new curriculum coverage.
- Production review at 320, 390 and 430 CSS px: DOG/CAT/APPLE/BANANA all inside width, no spelling overflow; no horizontal lesson overflow; English 6/100 does not overlap X.
- Before the English extension: shared-header checks across English, science, math, Hangul, Hanja at each of 320/390/430 (15 checks) passed badge visibility and no X overlap/overflow.

These narrow-width browser checks are not physical iPhone Safari tests. Mouse drag was exercised; physical mobile touch/pen, actual audible English/Korean, all 100 stages manually, and every game played end-to-end after this change remain unverified.

## Files

Core feature: js/curriculum/english-space.js, discovery-model.js, discovery-space.js, discovery-art.js, speech.js, learning-header.js; css/discovery-space.css.
Integration: index.html; js/core.js; js/curriculum/ui.js, learning-space.js, hanja-space.js, space-curriculum.js.
Verification: tests/discovery-space.test.cjs, learning-space.test.cjs, learning-space-frame.html, learning-space-review.html; scripts/test.mjs; this report.
