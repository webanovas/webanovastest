

## Add Boostapp Registration Button to Schedule Page

Add a prominent "Register for Class" button on the Schedule page that directs users to the Boostapp registration link.

### What Will Change

**Schedule Page** - A styled call-to-action button will be added at the top of the schedule section (below the page hero) with text like "להרשמה לשיעור" that opens `https://1pa.co/dXjqxqYBbb` in a new browser tab.

The button will:
- Be visually prominent with the site's primary color scheme
- Include a short description line above it (e.g., "להרשמה ולצפייה בלוח השעות המלא")
- Open in a new tab so users don't lose the website
- Be visible to all visitors (not just admin)
- Match the existing RTL Hebrew design of the site

### Technical Details

**File to modify:** `src/pages/Schedule.tsx`

- Add a styled CTA section between the PageHero and the day-tabs/class list
- The section will contain a brief text and a Button component wrapped in an anchor tag (`<a>`) targeting `https://1pa.co/dXjqxqYBbb` with `target="_blank"` and `rel="noopener noreferrer"`
- No database changes needed
- No new dependencies needed

