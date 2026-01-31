# EmailJS Service Configuration for cPanel SMTP

## Current Status: 

✅ **Form Implementation Fixed** - Homepage now uses EmailJS  
⚠️ **EmailJS Service Needs Update** - Currently configured for Gmail, needs cPanel SMTP

## What Needs to be Done:

### 1. Update EmailJS Service Settings

Log into EmailJS dashboard and update your service:

**Current Service (service_r5xk0de):**
- Likely configured for Gmail
- Need to switch to Custom SMTP

**New Configuration:**
```
Service Type: Custom SMTP
Host: sbg106.truehost.cloud
Port: 587
Username: events@tunzaesports.com
Password: QaH0q,YG&fg^ivHP
Encryption: TLS/STARTTLS
From Email: events@tunzaesports.com
From Name: Tunza Esports
```

### 2. Test Connection
After updating SMTP settings, use EmailJS's test function to verify connection works.

### 3. Update Template (if needed)
Ensure your template (template_flrc99g) has the correct variables:
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email  
- `{{message}}` - User's message
- `{{to_email}}` - events@tunzaesports.com
- `{{reply_to}}` - User's email (for replies)

## Current Environment Variables (✅ Correct):
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_r5xk0de
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_flrc99g  
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=wXpvfikuqmB6iDLcW
```

## Next Steps:

1. **Log into EmailJS Dashboard**
2. **Edit service_r5xk0de** to use cPanel SMTP settings
3. **Test SMTP connection** in EmailJS dashboard
4. **Submit test form** on your website
5. **Check email delivery** to events@tunzaesports.com

## Expected Results:

After updating EmailJS service:
- ✅ Website form will send via EmailJS using cPanel SMTP
- ✅ Email arrives at events@tunzaesports.com inbox
- ✅ Forwarding sends copy to gmbnostudios@gmail.com  
- ✅ Auto-responder sends confirmation to user
- ✅ No more "/api/contact" logs appearing

## Troubleshooting:

If emails still don't arrive after updating EmailJS:
1. Check cPanel SMTP credentials in EmailJS service
2. Verify EmailJS dashboard shows successful sends
3. Check cPanel email delivery logs
4. Test cPanel email account manually by sending email to it

The key issue was that the form was calling `/api/contact` route instead of EmailJS. This has now been fixed!