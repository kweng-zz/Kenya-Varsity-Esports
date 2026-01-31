# Automated No-Reply Response Setup Guide

This guide ensures your automated responses from `no-reply@tunzaesports.com` continue to work with the new EmailJS setup using cPanel email system.

## Method 1: cPanel Auto-Responder (Recommended)

### Setup Steps:

1. **Log into your cPanel dashboard**
2. **Navigate to Email** → **Autoresponders**
3. **Click Add Autoresponder**
4. **Configure settings:**

```
**Auto-Responder Settings:**
- **Email**: events@tunzaesports.com
- **From**: no-reply@tunzaesports.com
- **Subject**: Thank you for contacting Tunza Esports
- **Character set**: UTF-8
- **HTML Message**: ☑️ Enabled
- **Interval**: 12 hours (prevents spam to same sender)

**HTML Message Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #961c18; padding: 20px; text-align: center; color: white; }
        .content { padding: 30px; border: 1px solid #ddd; border-top: none; background-color: #fff; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You for Contacting Us!</h1>
        </div>
        <div class="content">
            <p>Dear Valued Contact,</p>
            <p>Thank you for reaching out to Tunza Esports! We have received your message and our team will review it shortly.</p>
            <p>We typically respond within 24-48 hours. For urgent matters, you can also reach us through our social media channels.</p>
            <p>Best regards,<br/>
            <strong>Tunza Esports Team</strong><br/>
            Kenya Varsity Esports</p>
        </div>
        <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this email.</p>
            <p>© 2024 Tunza Esports. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

**Timing Settings:**
- **Start**: Immediately (current date/time)
- **Stop**: Leave blank for ongoing
- **Interval**: 12 hours

6. Click **"Add/Modify Autoresponder"** to save

### Advantages of cPanel Auto-Responder:
- ✅ Built into your hosting control panel
- ✅ Reliable delivery through your own SMTP
- ✅ Full HTML message support
- ✅ No additional cost
- ✅ Works perfectly with EmailJS
- ✅ Configurable intervals to prevent spam

## Method 2: EmailJS Auto-Response Template

### Alternative Setup:

If you prefer EmailJS to handle both emails, create a second template:

1. **Create Auto-Response Template** in EmailJS dashboard:
   - Template ID: `auto_response_template`
   - From Email: `no-reply@tunzaesports.com`
   - To Email: `{{from_email}}`
   - Subject: `Thank you for contacting Tunza Esports`

2. **Update ContactForm.tsx** to send two emails:

```typescript
// After first email succeeds, send auto-response
try {
  await emailjs.send(serviceId, autoResponseTemplateId, {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
  });
  console.log('✅ Auto-response sent successfully');
} catch (autoError) {
  console.error('⚠️ Auto-response failed:', autoError);
  // Don't fail the entire submission if auto-response fails
}
```

### EmailJS Auto-Response Template HTML:
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #961c18; padding: 20px; text-align: center; color: white; }
        .content { padding: 30px; border: 1px solid #ddd; border-top: none; background-color: #fff; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
        .message-box { background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You for Contacting Us!</h1>
        </div>
        
        <div class="content">
            <p>Dear {{from_name}},</p>
            
            <p>We have received your message and appreciate your interest in Tunza Esports. Our team will review your inquiry and get back to you as soon as possible.</p>
            
            <div class="message-box">
                <p><strong>Your Message:</strong></p>
                <p>{{message}}</p>
            </div>
            
            <p>For immediate assistance, you can also reach us through our social media channels or join our Discord community.</p>
            
            <p>Best regards,<br/>
            <strong>Tunza Esports Team</strong><br/>
            Kenya Varsity Esports</p>
        </div>
        
        <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this email.</p>
            <p>© 2024 Tunza Esports. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

## Testing Auto-Response

### Test Method 1 (cPanel Auto-Responder):
1. Submit contact form with test email
2. Check test email inbox within 5-10 minutes
3. Verify auto-response received from `no-reply@tunzaesports.com` or `events@tunzaesports.com`
4. Check cPanel email logs for autoresponder activity
5. Verify HTML formatting renders correctly

### Test Method 2 (EmailJS Auto-Response):
1. Update ContactForm.tsx with auto-response code
2. Submit contact form with test email
3. Check test email inbox within 5 minutes
4. Verify auto-response received from `no-reply@tunzaesports.com`

## Recommended Configuration

**I recommend Method 1 (Gmail Vacation Responder)** because:
- ✅ More reliable delivery
- ✅ Better spam handling
- ✅ No additional EmailJS quota usage
- ✅ Built-in vacation responder features
- ✅ Automatic conflict resolution
- ✅ Mobile-friendly setup

## Troubleshooting Auto-Response Issues

### cPanel Auto-Responder Not Working:
1. **Check if autoresponder is enabled and active in cPanel**
2. **Verify start time has passed**
3. **Check HTML message formatting for syntax errors**
4. **Review interval settings (too short may cause issues)**
5. **Check cPanel email delivery logs for errors**
6. **Ensure email account has sufficient quota**
7. **Verify the events@tunzaesports.com account is active**

### EmailJS Auto-Response Not Working:
1. **Check EmailJS quota** (200 emails/month free tier)
2. **Verify auto-response template ID is correct**
3. **Check template variable names match**
4. **Ensure second email send is implemented in code**
5. **Monitor EmailJS dashboard for failed sends**

### Common Issues:
- **Delay in response**: Gmail may have 1-5 minute delay
- **Duplicate responses**: Check vacation responder settings
- **Spam filtering**: Whitelist your email addresses
- **Rate limiting**: Too many tests may trigger rate limits

## Final Configuration Checklist

### cPanel Auto-Responder Method:
- [ ] Auto-responder enabled in cPanel for events@tunzaesports.com
- [ ] Subject and HTML message configured properly
- [ ] Start time set to current or past date
- [ ] Interval configured (12 hours recommended)
- [ ] From address set to no-reply@tunzaesports.com or events@tunzaesports.com
- [ ] Email account has sufficient quota
- [ ] Test with real user email
- [ ] Check cPanel delivery logs for successful autoresponder sends

### EmailJS Auto-Response Method:
- [ ] Auto-response template created in EmailJS
- [ ] ContactForm.tsx updated to send second email
- [ ] Template variables configured correctly
- [ ] Error handling implemented
- [ ] EmailJS quota monitored
- [ ] Test with real user email

This ensures your automated no-reply responses work seamlessly with the new EmailJS contact form solution.