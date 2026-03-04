

## Redesign Focal Point Picker - Mobile-Style Crop Preview

The current picker shows the full image with a crosshair dot and separate small preview strips below. The user wants it redesigned to work like mobile photo editors: the full image is shown dimmed/dark, with a bright "crop window" rectangle floating over it that shows exactly what will be visible. Dragging moves the visible area around.

### How It Will Work

The image is displayed at full width. Over it, a dark overlay covers everything. A "window" cut out of the overlay shows the bright, unmasked portion — this is the visible crop area. The user drags to reposition which part of the image is visible through the window.

Three aspect ratio options (wide 16:9, square 1:1, tall 3:4) let the user switch the crop shape to preview different contexts. The crop window stays centered on screen; dragging moves the image behind it (or equivalently, moves the focal point).

### Technical Approach

**Single file change: `src/components/admin/FocalPointPicker.tsx`**

1. **Replace the current UI** with a mobile-style crop view:
   - Full image rendered inside a container
   - CSS overlay using `clip-path` or 4 semi-transparent dark `div` panels around a bright center rectangle
   - The center rectangle represents the crop — its aspect ratio changes based on the selected preview mode (16:9, 1:1, 3:4)
   - The bright rectangle shows the actual image underneath (no dimming), while everything outside is darkened with ~60% black overlay

2. **Aspect ratio selector**: Three toggle buttons at the top (wide / square / tall) to switch the crop preview shape

3. **Drag interaction**: User clicks/drags on the image to move the focal point. The crop rectangle stays centered in the container. As the focal point moves, the bright window shifts to show what will be visible at that position — giving an accurate real-time preview

4. **Implementation detail**: 
   - Use CSS `clip-path: inset()` on a bright copy of the image layered on top of a dimmed copy
   - Calculate the inset values based on the focal point position and the selected aspect ratio relative to the image's natural aspect ratio
   - The crop rectangle size is determined by fitting the selected aspect ratio inside the image bounds

5. **Keep**: sticky bottom bar with save/reset/cancel buttons

