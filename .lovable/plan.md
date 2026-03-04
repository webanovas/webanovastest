

## Plan: Auto-adopt description when renaming to existing class name

### The Problem
When editing a class's general info and changing its name to match another existing class, the description and image stay from the original class instead of adopting the target class's data.

### Solution
In the class info edit dialog, add a `useEffect` that watches `editingClassInfo.name`. When the name changes to match an existing (different) class name, automatically populate the description, image, and image position from that existing class. This gives immediate visual feedback and the user can still modify before saving.

### Technical Changes

**File: `src/pages/Schedule.tsx`**

Add a `useEffect` inside the Schedule component that:
1. Watches `editingClassInfo?.name`
2. If the name differs from `editingClassInfoOriginalName` and matches another existing class name
3. Finds the first class with that name and copies its `description`, `image_url`, and `image_position` into `editingClassInfo`

This way, as soon as the user types a name that matches an existing class, the form fields update to show that class's data. The existing save logic (which updates all rows matching the original name) continues to work correctly.

