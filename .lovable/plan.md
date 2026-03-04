

## Plan: Move hero text to the side and make it more prominent

Currently the hero carousel text (title, subtitle, buttons) is centered (`text-center`, `items-center`, `max-w-2xl`, `mx-auto`). I'll move it to the right side (since it's RTL) and make the text slightly more prominent.

### Changes in `src/pages/Index.tsx` (lines 277-316)

1. **Move text to the side**: Change the container from `flex-col items-center text-center` to `flex-col items-start text-right` (RTL means start = right side). Remove `mx-auto` from the inner `max-w-2xl` div and the subtitle.

2. **Make text more prominent**:
   - Increase title text shadow or add a stronger drop shadow for better contrast against images
   - Slightly increase subtitle opacity from `text-primary-foreground/80` to `text-primary-foreground/90`
   - Add text-shadow utility via inline style for the title

3. **Buttons alignment**: Change `justify-center` to `justify-start` on the buttons flex container.

4. **Badge alignment**: Keep the location badge aligned to the start instead of centered.

Single file change: `src/pages/Index.tsx`, approximately lines 277-314.

