
## Plan: Make hero carousel full-screen on mobile

**Problem**: On mobile, the hero carousel doesn't cover the full viewport height, leaving a white strip visible below it on initial load.

**Change**: In `src/pages/Index.tsx` line 283, change `min-h-[85vh]` to `min-h-screen` (or `min-h-dvh` for dynamic viewport height which accounts for mobile browser chrome).

**File**: `src/pages/Index.tsx`
- Line 283: Change `min-h-[85vh] md:min-h-screen` → `min-h-dvh md:min-h-screen`

This uses `dvh` (dynamic viewport height) which adapts to the actual visible area on mobile browsers, ensuring the carousel always fills exactly the visible screen — no white strip below.
