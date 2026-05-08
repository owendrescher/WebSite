# MLB Overlay Fast Skeleton

This is the start of a cleaner rebuild path. The root of `fast-skeleton` is a full copy of the current app. This `next/` folder is the new architecture sandbox.

Goals:

- Render schedule and live scores first.
- Load expensive game details only when a game is opened.
- Use a request scheduler so one demanding pull cannot freeze every other view.
- Cache API responses with stale-while-revalidate behavior.
- Keep detailed data available, but hydrate it progressively after the first paint.

Open `index.html` directly in a browser to try the static prototype.
