# Script Learning Studio

A browser-based learning site for three writing systems in one connected flow:

1. Arabic
2. Korean Hangul
3. Russian Cyrillic

Each script includes the same two practice modes:

1. A timed matching game that connects symbols to English sound cues.
2. A tracing mode that uses the rendered glyph as the target, plus ordered stroke tips and browser pronunciation playback.

## Running it

Open [index.html](./index.html) in a modern browser.

There is no build step or dependency install required.

## What is included

- One connected landing flow for script selection, mode selection, match play, and tracing
- Arabic with 28 core letters
- Korean with 24 basic Hangul jamo
- Cyrillic with 33 Russian letters
- 60-second Quizlet-style match rounds with score, streak, accuracy, and local leaderboards
- Guided tracing with coverage tracking and replayable stroke-order cues
- Browser speech playback per script when the local browser voices support it
- Local mastery tracking for traced characters
- A visible build label in the UI for hard-refresh checks

## Notes

- Arabic still includes Wikimedia stroke-order animation references where available.
- Korean and Cyrillic use built-in ordered stroke tips instead of external animation assets.
- The tracer is designed for recognition and early muscle memory rather than formal handwriting instruction.
