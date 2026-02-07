# EmailJS Setup Guide with reCAPTCHA Protection

## Overview

This contact form uses EmailJS to send emails directly from the browser, protected by:
- **reCAPTCHA v3**: Invisible bot protection (MANDATORY)
- **Rate Limiting**: Client-side and EmailJS dashboard limits
- **Domain Restrictions**: Configured in EmailJS dashboard

## Security Measures Implemented

### ✅ 1. reCAPTCHA v3 (MANDATORY)
- Invisible bot protection
- Analyzes user behavior
- Returns score (0.0 = bot, 1.0 = human)
- Rejects submissions below threshold (0.5)

### ✅ 2. Rate Limiting
- **Client-side**: 3 submissions per hour (localStorage)
- **EmailJS Dashboard**: Configure additional limits
- Prevents quota exhaustion

### ✅ 3. Domain Restrictions
- Configure in EmailJS dashboard
- Prevents abuse from other domains
- Only your domain can use the service

## Setup Instructions

### Step 1: Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email

### Step 2: Create Email Service

1. Go to **Email Services** in dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended)
4. Connect your email account
5. **Copy the Service ID** (you'll need this)

### Step 3: Create Email Template

1. Go to **Email Templates** in dashboard
2. Click **Create New Template**
3. Use this template structure:

```
Subject: New Contact Form Submission from {{from_name}}

From: {{from_name}} <{{from_email}}>
Email: {{from_email}}
Message:
{{message}}

---
This email was sent from your website contact form.
```

4. Set **To Email** to: `brokemedia.io@gmail.com`
5. **Copy the Template ID** (you'll need this)

### Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find **Public Key**
3. **Copy the Public Key** (you'll need this)

### Step 5: Configure reCAPTCHA v3

1. Go to https://www.google.com/recaptcha/admin
2. Click **+ Create**
3. Fill in:
   - **Label**: Zisth Contact Form
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domains**: Add your domain (e.g., `yourdomain.com`, `www.yourdomain.com`)
   - For local testing: Add `localhost`
4. Accept terms and submit
5. **Copy the Site Key** (you'll need this)
6. **Copy the Secret Key** (keep this secret, not needed in code)

### Step 6: Update Configuration

Open `src/config/emailjs.ts` and update:

```typescript
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'your-actual-public-key-here',
  SERVICE_ID: 'your-service-id-here',
  TEMPLATE_ID: 'your-template-id-here',
  RECEIVER_EMAIL: 'brokemedia.io@gmail.com', // Already set
}

export const RECAPTCHA_CONFIG = {
  SITE_KEY: 'your-recaptcha-site-key-here',
  ACTION: 'contact_form_submit',
  SCORE_THRESHOLD: 0.5,
}
```

### Step 7: Configure Domain Restrictions (CRITICAL)

1. Go to EmailJS dashboard → **Account** → **Security**
2. Under **Allowed Domains**, add:
   - Your production domain: `yourdomain.com`
   - With www: `www.yourdomain.com`
   - **For local testing**: `localhost` (NOT `localhost:5173` - EmailJS doesn't accept ports)
3. **Save changes**

**Important**: EmailJS domain restrictions don't accept:
- ❌ Ports (e.g., `localhost:5173`)
- ❌ Protocols (e.g., `http://localhost`)
- ❌ Paths (e.g., `localhost/path`)

**For local testing**: Just use `localhost` - it will work for any port on localhost.

This prevents others from using your EmailJS keys!

### Step 8: Configure Rate Limits (CRITICAL)

1. Go to EmailJS dashboard → **Account** → **Settings**
2. Set **Rate Limits**:
   - **Per Hour**: 50-100 (adjust based on traffic)
   - **Per Day**: 200-500
3. **Save changes**

This prevents quota exhaustion from spam.

### Step 9: Install Dependencies

```bash
npm install
```

This will install `@emailjs/browser` package.

### Step 10: Test the Form

1. Start your dev server: `npm run dev`
2. Fill out the contact form
3. Submit and check `brokemedia.io@gmail.com`
4. Verify email is received

## Security Checklist

- [ ] EmailJS account created
- [ ] Email service connected
- [ ] Email template created with correct receiver email
- [ ] Public Key, Service ID, Template ID copied
- [ ] reCAPTCHA v3 site key obtained
- [ ] Configuration updated in `src/config/emailjs.ts`
- [ ] Domain restrictions configured in EmailJS dashboard
- [ ] Rate limits configured in EmailJS dashboard
- [ ] Form tested and working
- [ ] Emails received at `brokemedia.io@gmail.com`

## Important Security Notes

### ⚠️ Public Keys Are Exposed

**Issue**: EmailJS public keys are visible in client-side code.

**Mitigation**:
- ✅ Domain restrictions (configured in EmailJS dashboard)
- ✅ Rate limits (configured in EmailJS dashboard)
- ✅ reCAPTCHA v3 protection (mandatory)

**What to do**:
1. Always configure domain restrictions
2. Set appropriate rate limits
3. Monitor usage in EmailJS dashboard
4. Never share your keys publicly

### ⚠️ Spam & Abuse Risk

**Issue**: Bots can potentially call EmailJS directly.

**Mitigation**:
- ✅ reCAPTCHA v3 (analyzes behavior, blocks bots)
- ✅ Rate limiting (client-side + EmailJS)
- ✅ Domain restrictions (only your domain works)

**What to do**:
1. **reCAPTCHA is MANDATORY** - do not disable it
2. Monitor EmailJS dashboard for unusual activity
3. Adjust rate limits if needed
4. Consider upgrading EmailJS plan if you get high traffic

## Troubleshooting

### Emails Not Sending

1. **Check EmailJS configuration**
   - Verify Public Key, Service ID, Template ID are correct
   - Check EmailJS dashboard for errors

2. **Check reCAPTCHA**
   - Verify Site Key is correct
   - Check browser console for reCAPTCHA errors
   - Ensure domain is added to reCAPTCHA allowed domains

3. **Check rate limits**
   - Verify you haven't exceeded limits
   - Check EmailJS dashboard usage

4. **Check domain restrictions**
   - Ensure your domain is in allowed list
   - For local testing, add `localhost`

### reCAPTCHA Errors

- **"reCAPTCHA not loaded"**: Check Site Key and script loading
- **"Invalid site key"**: Verify Site Key matches reCAPTCHA dashboard
- **"Domain not allowed"**: Add domain to reCAPTCHA allowed domains

### Rate Limit Errors

- **"Too many submissions"**: Wait before trying again
- Check `localStorage` in browser DevTools
- Clear `emailjs_submission_times` if needed for testing

## Production Deployment

Before going live:

1. ✅ Remove `localhost` from EmailJS domain restrictions
2. ✅ Remove `localhost` from reCAPTCHA allowed domains
3. ✅ Add production domain to both
4. ✅ Test form on production domain
5. ✅ Monitor EmailJS dashboard for first few days
6. ✅ Adjust rate limits based on actual traffic

## Changing Receiver Email

To change where emails are received:

1. Update EmailJS template **To Email** field
2. Or update `RECEIVER_EMAIL` in `src/config/emailjs.ts`
3. Both should match for consistency

## Support

- EmailJS Docs: https://www.emailjs.com/docs/
- reCAPTCHA Docs: https://developers.google.com/recaptcha/docs/v3
- Check browser console for detailed error messages
