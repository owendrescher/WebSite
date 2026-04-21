# Animation Helper

This project now starts as a lightweight Photoshop-style layer editor in the browser so we have a stronger base for a bigger creative tool later.

## What it includes

- A document-sized layer stack with add, delete, duplicate, merge down, reorder, rename, visibility, opacity, and blend modes
- Move, pencil, brush, eraser, fill, picker, text, line, rectangle, and ellipse tools on the active layer
- Layer adjustments for grayscale, invert, sepia, blur, sharpen, brightness, and contrast
- Image import as new layers, document resize, zoom, undo/redo, and composite PNG export
- IndexedDB autosave so the current project restores after refresh or closing/reopening the page
- Smart person cutout for the active layer using a browser-loaded segmentation model

## Run it

Open [index.html](index.html) in a browser, or serve the folder with any static file server.

## Smart cutout note

The cutout feature loads TensorFlow.js and BodyPix from a CDN at runtime. That means:

- The browser needs internet access the first time the page loads those scripts
- It works best on a photo layer with one clear person
- It is a practical browser-side subject cutout, not Photoshop-quality edge refinement yet

## Good next steps

- Add marquee and lasso selections with feathering
- Add transform handles for scale, rotate, and free transform
- Add masks, clipping masks, and non-destructive adjustment layers
- Add frame/timeline tools so the layered editor can grow into animation workflows
- Split the editor into modules for document state, rendering, tools, and effects
