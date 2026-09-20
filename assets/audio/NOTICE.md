# 시안Hi audio provenance

The score arrays and synthesizer were written for this project. No commercial-game recording, melody, MIDI, sound sample, or external audio asset was imported. Music and effects are generated locally with Web Audio oscillators.

`voice-manifest.js` is intentionally empty: no premium/recorded voice has been generated or licensed in this change. The current runtime falls back to device speechSynthesis voices. Device availability and quality vary.

`scripts/audio/build-voice-pack.mjs` is an optional offline pack builder. Dry run plans 142 clips (1,266 text characters). No API request or paid generation was performed. Actual generation requires a server-side developer environment key, explicit --write, provider terms/pricing review, Korean/English pronunciation review and publication of the resulting files. Never put an API key in browser JavaScript. Generated speech must be disclosed as AI-generated when used.
