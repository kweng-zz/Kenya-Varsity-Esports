# cPanel Email Configuration Guide

This guide specifically covers setting up email forwarding and auto-responders using your cPanel hosting.

## cPanel Access Information

- **Host**: sbg106.truehost.cloud
- **Email Domain**: tunzaesports.com
- **Email Account**: events@tunzaesports.com
- **cPanel URL**: https://tunzaesports.com/cpanel (or your hosting provider's cPanel URL)

## Step 1: Access cPanel

1. Open your web browser
2. Navigate to your cPanel login URL
3. Log in with your cPanel credentials (not email credentials)
4. You should see the cPanel dashboard

## Step 2: Set Up Email Forwarding

### Forwarding Setup:
1. In cPanel dashboard, find "Email" section
2. Click on **"Forwarders"**
3. Click **"Add Forwarder"** button
4. Configure forwarder:

```
Address: events@tunzaesports.com
Forward to: ademashirley@gmail.com
```
Address: events@tunzaesports.com
Forward to: ademashirley@gmail.com
```

5. **Important Options**:
   - ☐ **Discard with error to sender** - LEAVE UNCHECKED
   - ☑️ **Forward to email address** - SELECT THIS
   - ☐ **Pipe to a program** - DON'T USE

6. Click **"Add Forwarder"** to save

### Advanced Option (Keep Copies):
If you want to keep copies in the events@tunzaesports.com inbox:
1. In Forwarders section, create forwarder with **"Forward to email address AND system account"**
2. This ensures emails are stored AND forwarded

## Step 3: Set Up Auto-Responder

### Auto-Responder Setup:
1. In cPanel dashboard, find the "Email" section
2. Click on **"Autoresponders"**
3. Click **"Add Autoresponder"**
4. Configure settings:

**Basic Settings:**
- **Email**: events@tunzaesports.com
- **From**: no-reply@tunzaesports.com
- **Subject**: Thank you for contacting Tunza Esports
- **Character set**: UTF-8
- **Interval**: 12 hours (prevent spam)

**Message Content (HTML):**
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
- **Interval**: 12 hours (prevents multiple auto-responses to same person)

5. Click **"Add/Modify Autoresponder"** to save

## Step 4: Verify Email Account Settings

### Check Email Account:
1. In cPanel → "Email" → **"Email Accounts"**
2. Find `events@tunzaesports.com` in the list
3. Verify status is **Active**
4. Check storage quota (should have space available)
5. Click **"Check Email"** to verify webmail access

### SMTP Settings Verification:
Your current SMTP settings should work with EmailJS:
- **Host**: sbg106.truehost.cloud
- **Port**: 587
- **Username**: events@tunzaesports.com
- **Password**: QaH0q,YG&fg^ivHP
- **Encryption**: TLS/STARTTLS

## Step 5: Test Email Configuration

### Test Forwarding:
1. Send a test email to events@tunzaesports.com
2. Check if it arrives at gmbnostudios@gmail.com
3. Check if copy remains in events@tunzaesports.com inbox

### Test Auto-Responder:
1. Send test email to events@tunzaesports.com
2. Check if auto-response is sent to the test email
3. Verify the formatting and content appear correctly

### Test EmailJS Integration:
1. Update your EmailJS service with SMTP credentials
2. Submit contact form on website
3. Verify the complete email flow works

## Troubleshooting Common cPanel Issues

### Forwarding Not Working:
1. Check cPanel → **"Track Delivery"** for email logs
2. Verify forwarder is active (green status)
3. Ensure destination email address is valid
4. Check if emails are being marked as spam

### Auto-Responder Not Working:
1. Verify autoresponder is enabled and active
2. Check start time has passed
3. Ensure HTML message is properly formatted
4. Review interval settings (too short may cause issues)

### SMTP Connection Issues:
1. Verify cPanel SMTP credentials in EmailJS
2. Check firewall allows port 587
3. Ensure SSL/TLS is enabled in EmailJS SMTP settings
4. Test with cPanel webmail to confirm account works

### Email Quota Issues:
1. Check email account storage usage in cPanel
2. Clean up old emails if quota is full
3. Increase email quota if needed
4. Set up email retention policies

## cPanel Email Management Tips

### Best Practices:
1. **Regular monitoring**: Check email quotas and usage
2. **Spam filtering**: Configure spam filters appropriately
3. **Security**: Use strong passwords and enable two-factor if available
4. **Backups**: Regularly backup email accounts
5. **Logging**: Monitor email delivery logs for issues

### Recommended Settings:
- **Forwarding**: Keep copy + forward (for audit trail)
- **Auto-responder**: 12-hour interval
- **Spam**: Medium protection level
- **Quota**: Monitor regularly, set alerts at 80%

## Support Resources

If you encounter issues:
1. **cPanel Documentation**: Official cPanel email guides
2. **Hosting Provider Support**: Contact Truehost Cloud for technical issues
3. **EmailJS Support**: For SMTP integration problems
4. **Server Logs**: Use cPanel's error logs for troubleshooting

This completes your cPanel email configuration for the EmailJS contact form solution.