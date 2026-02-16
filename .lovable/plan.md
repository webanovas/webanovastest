

## Fix Edit Mode, Add Recurring Classes, and Upgrade Form Design

### Problem Analysis

After reviewing the codebase, I found these issues:

1. **Edit mode not working on public pages**: The `EditableText` component exists (`src/components/admin/EditableText.tsx`) but is **never imported or used** on any page. All pages (Index, About, Contact, Schedule, Workshops) use hardcoded text. The only "edit mode" that exists is clicking cards on Schedule/Workshops to open edit dialogs -- but text on the site itself is not editable inline.

2. **No recurring vs one-time class option**: The `classes` table only has a `day` field (e.g. "ראשון"). There's no way to distinguish between a weekly recurring class and a one-time event.

3. **Forms look basic**: The edit dialogs and admin dashboard forms use plain inputs with minimal styling.

---

### What Will Change

#### 1. Fix Edit Mode - Make It Actually Work

The admin toolbar at the bottom already toggles `isEditMode`. When active, clicking on class/workshop/teacher cards on the public site opens WYSIWYG edit dialogs. This part works. The issue is that the **edit dialogs themselves may have save issues** (RLS policies) and the **contact form doesn't actually submit**.

I'll verify the database save operations work and add console logging if they fail silently.

#### 2. Add Recurring vs One-Time Classes (Alarm-Style UI)

**Database change**: Add two new columns to the `classes` table:
- `is_recurring` (boolean, default true) -- weekly recurring class
- `specific_date` (text, nullable) -- for one-time events only

**UI in the class edit dialog**: An alarm-style toggle at the top:
- **Recurring** (default): Shows day-of-week chips (Sun-Thu) where you can select multiple days, like alarm repeat settings. Each selected day creates the class on that weekday.
- **One-time**: Hides day chips, shows a calendar date picker instead.

The schedule page will show both recurring classes for the selected day AND one-time events whose date falls on that day.

#### 3. Complete Visual Upgrade of All Edit Forms

Redesign every edit dialog and admin form with:
- Glassmorphism-style card backgrounds with subtle blur
- Grouped sections with icon headers (like iOS Settings)
- Smooth animated transitions between form sections
- Better spacing, rounded corners, and soft shadows
- Color-coded field groups (time fields in blue-tinted area, location in green-tinted, etc.)
- Floating labels that animate up when focused
- Visual preview that updates in real-time as you type

---

### Technical Plan

#### Step 1: Database Migration
Add `is_recurring` (boolean DEFAULT true) and `specific_date` (text, nullable) columns to the `classes` table.

#### Step 2: Update `src/pages/Schedule.tsx`
- Update the `ClassEditPreview` component with the alarm-style recurring/one-time toggle
- Add multi-day selection for recurring classes (checkbox chips for each day)
- Add calendar date picker for one-time events
- Update the day filtering logic to include one-time events by date
- Completely redesign the edit dialog with grouped, visually distinct sections
- Use the `ClockPicker` in a polished popover

#### Step 3: Update `src/pages/Workshops.tsx`
- Redesign the `WorkshopEditPreview` with grouped sections, better spacing, and visual hierarchy
- Add section headers with icons
- Improve the time range picker layout

#### Step 4: Update `src/pages/Admin.tsx`
- Redesign all manager sections (Classes, Teachers, Workshops, Testimonials, Content) with:
  - Card-based layouts with hover effects
  - Grouped fields with section dividers
  - The same recurring/one-time toggle for classes
  - Better visual hierarchy and spacing
- Add the `ClockPicker` everywhere time is selected

#### Step 5: Verify Edit Mode Works End-to-End
- Check RLS policies allow authenticated admins to insert/update/delete
- Add error handling with meaningful toast messages
- Ensure the admin toolbar shows and toggles correctly

### Files to Modify
- `src/pages/Schedule.tsx` -- Alarm-style recurring UI + form redesign
- `src/pages/Workshops.tsx` -- Form visual upgrade
- `src/pages/Admin.tsx` -- Complete dashboard form redesign + recurring classes
- Database migration for `classes` table (add `is_recurring`, `specific_date`)

