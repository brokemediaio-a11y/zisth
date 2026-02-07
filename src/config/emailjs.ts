/**
 * EmailJS Configuration
 * 
 * IMPORTANT SECURITY NOTES:
 * 
 * 1. Public Keys Are Exposed:
 *    - EmailJS public keys are visible in client-side code
 *    - Anyone can view and potentially abuse them
 *    - Mitigation: Domain restrictions and rate limits in EmailJS dashboard
 * 
 * 2. Spam & Abuse Risk:
 *    - Bots can call EmailJS directly
 *    - No server-side validation
 *    - Mitigation: reCAPTCHA v3 is MANDATORY
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create EmailJS account: https://www.emailjs.com/
 * 2. Create an email service (Gmail, Outlook, etc.)
 * 3. Create an email template
 * 4. Get your credentials from EmailJS dashboard
 * 5. Update the values below
 * 6. Configure domain restrictions in EmailJS dashboard
 * 7. Set up rate limits in EmailJS dashboard
 * 8. Get reCAPTCHA v3 site key from Google
 * 
 * DOMAIN RESTRICTIONS (EmailJS Dashboard):
 * - Go to Account → Security
 * - Add your production domain
 * - This prevents abuse from other domains
 * 
 * RATE LIMITS (EmailJS Dashboard):
 * - Go to Account → Settings
 * - Configure rate limits per hour/day
 * - Prevents quota exhaustion
 */

export const EMAILJS_CONFIG = {
  // Your EmailJS Public Key (found in EmailJS dashboard → Account → General)
  PUBLIC_KEY: 'iVzdMD0Oc5wuajDWS',
  
  // Your EmailJS Service ID (found in EmailJS dashboard → Email Services)
  SERVICE_ID: 'service_7fwfl9a',
  
  // Your EmailJS Template ID (found in EmailJS dashboard → Email Templates)
  TEMPLATE_ID: 'template_gmeyuaf',
  
  // Receiver email (where form submissions are sent)
  RECEIVER_EMAIL: 'saadbutt4597@gmail.com',
}

// reCAPTCHA v3 Configuration
export const RECAPTCHA_CONFIG = {
  // Your reCAPTCHA v3 Site Key (get from https://www.google.com/recaptcha/admin)
  SITE_KEY: '6LcAGmQsAAAAANbPQDVSaouyJRNyaGAforQFVNWi',
  
  // reCAPTCHA v3 action name (can be any string)
  ACTION: 'contact_form_submit',
  
  // Minimum score threshold (0.0 to 1.0)
  // 0.0 = likely bot, 1.0 = likely human
  // Recommended: 0.5 for contact forms
  SCORE_THRESHOLD: 0.5,
}
