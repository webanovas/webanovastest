

## Fix: White Gap Between Welcome Section and Yoga Text

**Problem**: The Welcome section has an overlapping secondary image (positioned at `-bottom-8`) that extends below the section boundary. Combined with padding, this creates an empty white area before the "What is Yoga" text begins.

**Solution**: Two adjustments to close the gap naturally:

1. **Reduce Welcome section bottom padding** — Change `py-14 md:py-36` to `pt-14 md:pt-36 pb-6 md:pb-16` so the bottom has less whitespace while keeping the top padding intact.

2. **Add a soft background transition** to the "What is Yoga" section — Apply a subtle `bg-accent/30` (light sage tint) background with top padding to create a visual bridge instead of stark white. This gives the area a softer, more intentional feel that flows from the welcome section into the yoga text.

3. **Add subtle decorative separator** — A small decorative element (like a thin line or dot) between the sections to make the transition feel designed rather than empty.

**File**: `src/pages/Index.tsx` — Lines 322 and 373 area.

