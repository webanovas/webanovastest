

## Send Contact Form Emails via Resend

Both contact forms (floating button + contact page) will send emails directly to shira.pelleg@gmail.com when submitted, with WhatsApp as a secondary option.

### Changes

**1. Store the Resend API key securely**
- Save `RESEND_API_KEY` (`re_bKgWG7Xx_8bF6DBCdisKjA7KtSXgGyaVT`) as a backend secret

**2. Create backend function: `send-contact-email`**
- New file: `supabase/functions/send-contact-email/index.ts`
- Accepts POST with `{ name, phone, message }` (all optional except name+phone)
- Sends a nicely formatted email to `shira.pelleg@gmail.com` from `onboarding@resend.dev`
- Public endpoint (no JWT required -- it's a contact form)
- Proper CORS headers included

**3. Update `supabase/config.toml`**
- Add `[functions.send-contact-email]` with `verify_jwt = false`

**4. Update Floating Contact (`FloatingContact.tsx`)**
- Replace the current `mailto:` form submission with a call to the backend function
- Add a loading/sending state on the submit button
- Show success toast on completion, error toast on failure
- Keep the WhatsApp link as a secondary option (already exists below the form)

**5. Update Contact Page (`Contact.tsx`)**
- Wire the contact page form to also call the same backend function
- Add form state management (name, email, phone, message)
- Add loading state and success/error feedback
- The WhatsApp button already exists as a secondary option -- no change needed there

### How it will work for visitors
1. User fills out the form (name, phone, optional message)
2. Clicks the send button -- email is sent silently in the background
3. Success message appears: "ההודעה נשלחה בהצלחה"
4. Alternatively, they can click the WhatsApp button to message directly

