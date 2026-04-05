

## Plan: Fix Resend email delivery to Shira's personal email

**Problem**: The Resend API returns a 403 error even though both the account and recipient are `shira.pelleg@gmail.com`. This likely means the API key became invalid after the account email change.

**Solution**: Generate a new API key from Resend and update it in the project secrets.

### Steps

1. **You need to do**: Go to [resend.com/api-keys](https://resend.com/api-keys), generate a new API key, and copy it
2. **I will do**: Update the `RESEND_API_KEY` secret in the project with the new key you provide

No code changes are needed — the Edge Function already sends to `shira.pelleg@gmail.com` using `onboarding@resend.dev` as the sender, which is allowed when sending to the account owner's email.

### Why this should work
With Resend's free tier (no domain verification), you can send emails **to the account owner's email** using the `onboarding@resend.dev` from address. Since the account is now on Shira's email and the recipient is also Shira, this is fully supported — you don't need a custom domain.

