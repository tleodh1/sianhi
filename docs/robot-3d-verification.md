# Robot 3D implementation — 2026-09-19

Status: NOT ACCEPTED AS COMPLETE.

Previous report incorrectly equated a 2D mirror flip and fixed drawings with a
3D builder. Those paths have been replaced by shared Three.js mesh assembly.
Maker and arena now call the same makeModel(build) function with the saved
per-slot parts and material colors. The local vendor library includes its license.

Commits: c468b10c (models/maker), 59237ecd (arena/controls).

Executed behavioral tests:
- Independent head/body materials and part replacement.
- Mesh depth and transformed front/rear coordinates after 180-degree rotation.
- Saved robot preserves other sianhi-v2 records.
- X/Z movement, weapon attack, projectile and height-aware collision.
- Jump/landing and capped victory rewards.
- Three input bind/dispose cycles; two pointer IDs, cancellation and blur.

Production URL was opened in the provided cloud browser. Updated maker loaded,
but its WebGL context creation failed. Browser returned GL_VENDOR = Disabled,
GL_RENDERER = Disabled, Error creating WebGL context. No security settings or
browser configuration were changed to bypass this restriction.

NOT verified:
- Actual production 3D rendering, visual quality, rotation, independent colors.
- Complete create/save/reload/battle/win flow in a graphics-enabled browser.
- 320/390/430px rendered layout and actual multi-touch gameplay.
- iPhone Safari / Android devices, GPU performance and context recovery.

Do not treat static or Node tests as production acceptance. Do not report the
robot maker & battle complete until the entire user-visible flow passes.
