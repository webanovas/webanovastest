

## Replace mailto: Links with In-Site Email Sending

The contact form already sends emails directly from the site. The remaining issue is three `mailto:` links that still open Outlook. We'll replace them with inline mini-forms or redirect to the existing contact form.

### Changes

**1. Workshop Detail View (`src/pages/Workshops.tsx`)**
- Replace the `mailto:` "אימייל" link with a small inline contact form (or a button that opens the floating contact widget)
- The form will pre-fill the message with the workshop name and send via the existing `send-contact-email` edge function
- Keep the WhatsApp link as-is

**2. Contact Page info section (`src/pages/Contact.tsx`)**
- Change the `mailto:shira.pelleg@gmail.com` link to scroll down to the contact form on the same page instead of opening Outlook
- The email address still displays as info, but clicking it scrolls to the form

**3. Home Page contact section (`src/pages/Index.tsx`)**
- Same approach — change the mailto link to navigate to `/contact` page or scroll to the contact form
- Alternatively, open the floating contact widget when clicked

### Approach
- Workshop detail: replace email link with a small expandable form (name, phone, optional message, pre-filled with workshop name) that calls `send-contact-email`
- Contact page + Home page: change mailto click to scroll to the existing form / navigate to contact page

