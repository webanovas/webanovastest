
## Replace Time Chip Picker with a Clock-Face Time Picker

### What Changes
Replace the current flat grid of time chips with a two-step **analog clock-face picker**:
1. **Step 1 - Pick Hour**: A circular clock face showing hours (6-20) arranged in a circle. Tap an hour to select it.
2. **Step 2 - Pick Minutes**: The clock face transitions to show minute options (00, 05, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55) arranged in a circle. Tap a minute to confirm.

The selected time updates live in the trigger button. After picking minutes, the popover closes automatically.

### Visual Design
- Round clock face with numbers arranged in a circle (like a real clock)
- A "hand" line from center to the selected value
- Smooth transition/animation between hour and minute steps
- Active number highlighted with the primary color
- Small label at top showing "בחר שעה" / "בחר דקות" to guide the user
- The trigger button stays the same (shows clock icon + selected time)

### Files to Modify

1. **`src/pages/Admin.tsx`** - Replace the `TimeChipPicker` component (lines 93-134) with a new `ClockPicker` component that renders a circular clock face in two steps (hours then minutes) inside the existing Popover.

2. **`src/pages/Schedule.tsx`** - Replace the `TimeChipPicker` component (lines 452+) with the same `ClockPicker` component. To avoid duplication, extract the shared component to a new file.

3. **Create `src/components/ui/clock-picker.tsx`** - Shared clock-face picker component used by both Admin and Schedule pages.

### Technical Details

- The clock face will be built with pure CSS/SVG positioning (numbers placed using `transform: rotate() translate()`)
- Uses `framer-motion` for the hand animation and step transition
- Hour range: 6:00 - 20:00 (yoga studio hours), displayed as two rings if needed (inner ring 6-12, outer ring 13-20) or a single scrollable set
- Minute intervals: every 5 minutes (00, 05, 10, ... 55)
- Component state: `step` ("hour" | "minute"), `selectedHour`, `selectedMinute`
- On hour tap: set hour, transition to minute step
- On minute tap: set minute, call `onChange` with formatted time, close popover
- A "back" button on the minute step to go back to hour selection
