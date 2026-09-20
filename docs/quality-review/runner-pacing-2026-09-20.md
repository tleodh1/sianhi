# Runner pacing and learning tiles — 2026-09-20

## Cause and changes
The expansion pass replaced early lessons with 12–14 mandatory items, set 880–980px per item and repeated enemy/block bundles for each item. The ocean pass independently enlarged learning cards to 98–152px wide and 82–112px high.

stage-pacing.js now retains the full source pools in curriculumPool but selects 4–6 required items per round. IDs remain 1-1 through 9-4, 36 stages, numbered final bosses. No progress migration/reset. Shared tile dimensions are 48px high and 48px wide for 1–2 characters, 72px maximum for longer words. All nine worlds use the same renderer; long text uses two lines and measured font fitting. Ocean-specific enlargement is removed. Collected tiles briefly travel upward/fade while existing HUD, particle, voice and sound feedback continues.

Route composition separates terrain, learning, enemy, reward and special-event choices. Forest 1-1 has one enemy; ordinary routes usually have 2–3. Selected enemies alternate existing world-specific kinds/behaviors; no new monster art is claimed. Level-specific firing rates are capped for young players without changing physics speed. Existing swim, airborne, jump, charge, emerge and shooting behavior implementations remain.

Stage themes: forest introduction/growth bricks/star bridge; ocean coral/kelp-current/clam treasure; sky wings/moving clouds/wind stones; underground crystal/hidden treasure/bat route; dinosaur fossil bridge/nest/footprints; ice sliding/lookout/hidden star; fire stepping stones/bricks/timing; storm platforms/electric timing/treasure; space low gravity/lookout/ordered constellation. Ground gaps, moving optional platforms, reward bricks, growth then power star, collectible stars and coin trails are authored separately from mandatory letters. Clam and bubble current remain in ocean, wings and backup pickups remain in sky, underground water zones remain. Optional bonus-star x offset varies by 0/12/24px only; required letter locations are deterministic.

## Automated tests
npm test passes existing progression/storage, growth/damage, aim/projectile, blocks, boss and audio regressions. Legacy content fixture tests remain; the new runner-pacing.test.cjs loads the final production pacing pass and separately verifies all 36 actual stage definitions.

Input-only driver runs actual Engine.step at 120Hz. It does not set position/HP/invincibility/collected flags or remove enemies. It uses known correct boss answers (not a reading test). All 27 ordinary stages clear without death within 25–35 simulated seconds. Seeded boss shuffle makes regression reproducible; runtime shuffle stays random. Nine boss runs include approach, learning, transition, choices/projectiles, defeat and exit: 66.10, 58.17, 53.25, 62.76, 55.88, 49.94, 54.00, 49.08, 49.47 seconds. Human hesitation, mistakes, bonus detours and different shuffled choices can change these times.

## Actual Production rendered input replay
Implementation 6d5dec2b814755c23cbdddfe75e6c0f34a040c70 deployed READY. Public /tests/runner-review.html uses production adapter/assets/renderer/controls/engine with save disabled. The visible Input Route Replay button supplies movement/jump/swim/fire inputs to the live fixed-step loop. No teleport, god mode, enemy removal or collection injection was used. All six scenes rendered, collected all four mandatory tiles and reached the normal goal:

| Stage | Game clock seconds | Deaths |
|---|---:|---:|
| 1-1 | 26.83 | 0 |
| 1-2 | 26.83 | 0 |
| 1-3 | 27.52 | 0 |
| 2-1 | 26.00 | 0 |
| 2-2 | 25.84 | 0 |
| 3-1 | 27.57 | 0 |

Cloud browser rendering was throttled: wall time was longer than game-clock time. These are NOT physical iPhone or child playtime measurements. They establish production content/engine clearability and in-game timing, not a human median of 30 seconds.

At 320/390/430 CSS-pixel modal widths, no horizontal content overflow; controls remained below canvas. 390px ocean screenshot visually inspected: small readable 바다 tile, distinct character/coins and underwater scenery. 48px tile is about 29 screen pixels at 390px / 640 logical viewport; longer word maximum about44px. This is desktop responsive verification, not iPhone Safari hardware verification.

## Preserved systems and limits
Movement speeds unchanged. SMALL/BIG/STAR_POWER, Shift/F, collision/projectiles, item types, death/invulnerability, swim/flight, boss scenes, goal, audio hooks and persistent IDs remain. No new images generated or existing assets replaced.

Not directly verified: physical iPhone touch performance, actual 5–7-year-old timing/fatigue/reading comfort, all nine boss production playthroughs, all remaining ordinary stages in a rendered Production browser, and audible TTS/BGM. Boss timings above are automated engine results only. The final boss-duration adjustment affects boss approaches and leaves the six production ordinary timing results unchanged.

## Files
js/games/hangul-runner/stage-pacing.js; world-data.js; engine.js; renderer.js; ocean-expedition.js; ocean-renderer.js; index.html; tests/runner-pacing.test.cjs; tests/runner-route-driver.js; tests/runner-review.html; tests/runner-review.js; scripts/test.mjs; this report.
