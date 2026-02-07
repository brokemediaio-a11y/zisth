# Local Testing Guide for EmailJS

## Quick Start

You can test the EmailJS contact form locally before deploying to production.

## Step 1: Configure EmailJS for Local Testing

### Add Localhost to Allowed Domains

1. Go to EmailJS dashboard → **Account** → **Security**
2. Under **Allowed Domains**, add: `localhost`
3. **Important**: 
   - ✅ Use: `localhost`
   - ❌ Don't use: `localhost:5173` (EmailJS doesn't accept ports)
   - ❌ Don't use: `http://localhost` (no protocols)
   - ❌ Don't use: `127.0.0.1` (use `localhost` instead)

4. **Save changes**

**Note**: `localhost` will work for any port (5173, 3000, 8000, etc.) on your local machine.

## Step 2: Configure reCAPTCHA for Local Testing

1. Go to https://www.google.com/recaptcha/admin
2. Find your reCAPTCHA site (or create a new one)
3. Click **Settings** (gear icon)
4. Under **Domains**, add: `localhost`
5. **Save changes**

**Note**: For local testing, you can use the same reCAPTCHA site key. Just add `localhost` to allowed domains.

## Step 3: Update Configuration

Make sure your `src/config/emailjs.ts` has the correct values:

```typescript
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'your-emailjs-public-key',
  SERVICE_ID: 'your-service-id',
  TEMPLATE_ID: 'your-template-id',
  RECEIVER_EMAIL: 'brokemedia.io@gmail.com',
}

export const RECAPTCHA_CONFIG = {
  SITE_KEY: 'your-recaptcha-site-key',
  ACTION: 'contact_form_submit',
  SCORE_THRESHOLD: 0.5,
}
```

## Step 4: Start Development Server

```bash
npm run dev
```

Your app will start on `http://localhost:5173` (or another port if 5173 is busy).

## Step 5: Test the Form

1. Open your browser: `http://localhost:5173`
2. Navigate to the contact form
3. Fill out all fields:
   - Name: Your name
   - Email: Your email
   - Message: Test message
4. Click "Send Message"
5. Check `brokemedia.io@gmail.com` for the email

## Troubleshooting Local Testing

### Issue: "Domain not allowed" Error

**Solution**: 
- Make sure `localhost` is added to EmailJS allowed domains
- Make sure `localhost` is added to reCAPTCHA allowed domains
- Don't include the port number

### Issue: reCAPTCHA Not Loading

**Solution**:
- Check browser console for errors
- Verify reCAPTCHA site key is correct
- Ensure `localhost` is in reCAPTCHA allowed domains
- Try clearing browser cache

### Issue: EmailJS Returns Error

**Solution**:
- Check browser console for detailed error
- Verify Public Key, Service ID, Template ID are correct
- Check EmailJS dashboard for service status
- Verify email template has correct variable names

### Issue: Rate Limit Error

**Solution**:
- You've submitted too many times (3 per hour limit)
- Clear localStorage: Open DevTools → Application → Local Storage → Delete `emailjs_submission_times`
- Or wait 1 hour

## Testing Checklist

- [ ] `localhost` added to EmailJS allowed domains
- [ ] `localhost` added to reCAPTCHA allowed domains
- [ ] Configuration updated in `src/config/emailjs.ts`
- [ ] Dev server running (`npm run dev`)
- [ ] Form submission works
- [ ] Email received at `brokemedia.io@gmail.com`
- [ ] No console errors

## Before Production Deployment

**IMPORTANT**: Before deploying to production:

1. ✅ Remove `localhost` from EmailJS allowed domains (or keep it for testing, but add production domain)
2. ✅ Add your production domain to EmailJS allowed domains
3. ✅ Remove `localhost` from reCAPTCHA allowed domains (or add production domain)
4. ✅ Test form on production domain
5. ✅ Monitor EmailJS dashboard for first few days

## Common Mistakes

### ❌ Adding Port to Domain
```
Wrong: localhost:5173
Correct: localhost
```

### ❌ Adding Protocol
```
Wrong: http://localhost
Correct: localhost
```

### ❌ Using IP Address
```
Wrong: 127.0.0.1
Correct: localhost
```

## Quick Test Script

To quickly test if everything is configured:

1. Open browser console (F12)
2. Run:
```javascript
// Check if EmailJS is loaded
console.log('EmailJS:', typeof emailjs !== 'undefined')

// Check if reCAPTCHA is loaded
console.log('reCAPTCHA:', typeof grecaptcha !== 'undefined')
```

Both should return `true` if everything is loaded correctly.

## Need Help?

- Check browser console for errors
- Check EmailJS dashboard for errors
- Verify all configuration values are correct
- Ensure domains are added correctly (no ports, no protocols)
