# EmailJS Setup Guide for Tunza Esports

This guide will walk you through setting up EmailJS with your cPanel SMTP server to handle contact form submissions with dual email forwarding: website → events@tunzaesports.com → gmbnostudios@gmail.com.

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service (SMTP/Custom SMTP)

1. In EmailJS dashboard, click "Email Services" → "Add New Service"
2. Choose "Custom SMTP" or "Other SMTP"
3. Configure SMTP settings with your cPanel credentials:

### SMTP Configuration:
- **Host**: `sbg106.truehost.cloud`
- **Port**: `587`
- **Username**: `events@tunzaesports.com`
- **Password**: `QaH0q,YG&fg^ivHP`
- **Encryption**: `TLS` (STARTTLS)
- **From Name**: `Tunza Esports`
- **From Email**: `events@tunzaesports.com`

4. Click "Add Service" to save the configuration
5. Note the Service ID (you'll need this for configuration)
6. Test the connection to ensure SMTP settings work

## Step 3: Create Email Template

1. Click "Email Templates" → "Create New Template"
2. Template ID: `contact_form_forward` (or any name you prefer)
3. Template Content:

### Email Template Settings:
- **From Email**: `no-reply@tunzaesports.com`
- **To Email**: `events@tunzaesports.com`
- **Reply To**: `{{from_email}}`
- **Subject**: `Contact Form Inquiry: {{from_name}}`

### Email Template Content (HTML):
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
        .field { padding: 10px 0; border-bottom: 1px solid #eee; }
        .field-label { font-weight: bold; width: 30%; display: inline-block; }
        .message-box { background-color: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #eee; font-style: italic; margin-top: 25px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Message from Website</h1>
        </div>
        
        <div class="content">
            <p>You have received a new inquiry from the Tunza Esports website.</p>
            
            <div class="field">
                <span class="field-label">Name:</span>
                {{from_name}}
            </div>
            
            <div class="field">
                <span class="field-label">User Email:</span>
                {{from_email}}
            </div>
            
            <div class="message-box">
                <p><strong>Message Content:</strong></p>
                <div>{{message}}</div>
            </div>
            
            <p style="margin-top: 30px;">You can reply directly to this email to contact the user.</p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from <a href="https://tunzaesports.com" style="color: #961c18;">Tunza Esports</a>.</p>
        </div>
    </div>
</body>
</html>
```

## Step 4: Set Up cPanel Email Forwarding

1. Log in to your cPanel dashboard (usually at yourdomain.com/cpanel)
2. Navigate to "Email" section → "Forwarders"
3. Click "Add Forwarder"
4. Configure forwarding settings:
   - **Address to forward**: `events@tunzaesports.com`
   - **Forward to email address**: `ademashirley@gmail.com`
5. Click "Add Forwarder" to save
6. **Optional**: Check "Discard with error to sender" if you don't want to keep copies

Alternative method (keep copies):
1. In cPanel → "Email" → "Forwarders"
2. Add forwarder with option "Forward to email address AND system account"
3. This keeps a copy in `events@tunzaesports.com` inbox AND forwards to `gmbnostudios@gmail.com`

## Step 5: Configure cPanel Auto-Responder (for no-reply)

1. Log in to your cPanel dashboard
2. Navigate to "Email" section → "Autoresponders"
3. Click "Add Autoresponder"
4. Configure autoresponder settings:
   - **Email**: `events@tunzaesports.com`
   - **From**: `no-reply@tunzaesports.com` (optional, will default to events@tunzaesports.com)
   - **Subject**: `Thank you for contacting Tunza Esports`
   - **Character set**: UTF-8
   - **HTML Message**: Enable this option
5. Autoresponder Body (HTML):
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
            <p>Dear User,</p>
            <p>Thank you for reaching out to Tunza Esports! We have received your message and will get back to you as soon as possible.</p>
            <p>For immediate assistance, you can also reach us through our social media channels or join our Discord community.</p>
            <p>Best regards,<br/>
            <strong>Tunza Esports Team</strong><br/>
            Kenya Varsity Esports</p>
        </div>
        <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
```
6. Set start/stop times (optional)
7. Click "Add/Modify Autoresponder"

## Step 6: Update Environment Variables

In your `.env` file, replace the placeholder values with your actual EmailJS credentials:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_actual_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=contact_form_forward
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_actual_public_key

# Your existing cPanel SMTP credentials (for reference)
SMTP_EMAIL=events@tunzaesports.com
SMTP_PASSWORD=QaH0q,YG&fg^ivHP
SMTP_FROM_EMAIL=no-reply@tunzaesports.com
SMTP_HOST=sbg106.truehost.cloud
SMTP_PORT=587
```

## Step 7: Test the Setup

1. Restart your development server
2. Go to the contact form on your website
3. Submit a test message
4. Check the following:
   - Email arrives at `events@tunzaesports.com`
   - Forwarded copy arrives at `gmbnostudios@gmail.com`
   - Auto-response is sent to the test email address
   - Form shows success message

## Important Notes:

### EmailJS Free Tier Limitations:
- 200 emails per month
- 2 email templates
- Limited customization
- For production, consider upgrading to a paid plan

### Gmail Forwarding Best Practices:
- Always keep a copy in the original inbox for audit trail
- Monitor forwarding regularly to ensure it's working
- Set up filters in Gmail to organize forwarded emails

### Security Considerations:
- Never expose EmailJS private keys in client-side code
- Only use public keys in NEXT_PUBLIC_ variables
- Regularly rotate your email service credentials

### Alternative: Use Email Routing Service
For more robust forwarding, consider services like:
- cPanel advanced email routing
- Third-party email routing services
- Custom email server configuration

### Notes on cPanel Setup:
- **EmailJS Service**: Use "Custom SMTP" with your cPanel credentials
- **Forwarding**: Set up in cPanel → Email → Forwarders
- **Auto-responder**: Configure in cPanel → Email → Autoresponders
- **Logs**: Monitor delivery in cPanel → Email → Track Delivery

## Troubleshooting:

### If emails don't send:
1. Check EmailJS dashboard for error logs
2. Verify service connection to Gmail
3. Ensure template variables match form field names
4. Check browser console for JavaScript errors

### If forwarding doesn't work:
1. Verify forwarder is created in cPanel
2. Check cPanel email logs for forwarding errors
3. Ensure both email addresses are valid
4. Test forwarding by sending a test email to events@tunzaesports.com

### If auto-responder doesn't work:
1. Check cPanel autoresponder is enabled
2. Verify HTML message is properly formatted
3. Check cPanel email logs for autoresponder issues
4. Ensure autoresponder start time has passed

### If SMTP connection fails:
1. Verify cPanel SMTP credentials are correct
2. Check firewall/ports (587 should be open)
3. Ensure SSL/TLS is properly configured
4. Test SMTP connection using cPanel email client setup

This setup ensures:
✅ Website → events@tunzaesports.com (via EmailJS + cPanel SMTP)
✅ events@tunzaesports.com → ademashirley@gmail.com (via cPanel forwarding)
✅ Auto-responder from no-reply@tunzaesports.com (via cPanel auto-responder)

### Additional Benefits with cPanel:
✅ Full control over email infrastructure
✅ No reliance on third-party email services
✅ Integrated email management in one dashboard
✅ Detailed email delivery logs and monitoring