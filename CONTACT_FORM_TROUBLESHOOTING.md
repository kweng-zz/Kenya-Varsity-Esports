# Contact Form Troubleshooting Guide

## Issue: "Failed to send message" Error

### What I Fixed
✅ Added comprehensive error logging to the contact API
✅ Added SMTP connection verification
✅ Improved error messages for better debugging
✅ Updated ContactForm component to handle responses properly

## How to Debug

### Step 1: Check Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Fill out the contact form and submit
4. Look for logs like:
   - `📤 Submitting contact form...`
   - `📊 Response status: 200`
   - `✅ Form submitted successfully` (success) or `❌ Form submission failed:` (error)

### Step 2: Check Server Logs
When you submit the form, you should see server logs like:
```
📧 Contact form submission received: { name: '...', email: '...' }
🔌 Creating Zoho SMTP transporter...
🧪 Testing SMTP connection...
✅ SMTP connection verified
📤 Sending email to KUER...
✅ Email sent to KUER: <message-id>
📤 Sending confirmation email to user...
✅ Confirmation email sent: <message-id>
✅ Contact form processed successfully
```

### Step 3: Verify Zoho Credentials

Check that your `.env` file has these variables:
```
ZOHO_EMAIL=info@kuer.co.ke
ZOHO_PASSWORD=Kuer@2024
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=587
```

**Important:** The `ZOHO_PASSWORD` should be an **app-specific password**, not your account password.

### Step 4: Common Issues and Solutions

#### Issue 1: "Server configuration error - missing email credentials"
**Cause:** Environment variables are not set
**Solution:**
1. Check `.env` file has all Zoho variables
2. Restart the development server: `npm run dev`
3. Verify variables are loaded: Check server logs on startup

#### Issue 2: "Email service connection failed"
**Cause:** SMTP connection cannot be established
**Solution:**
1. Verify Zoho credentials are correct
2. Check if Zoho SMTP port 587 is open (not blocked by firewall)
3. Ensure you're using an app-specific password (not account password)
4. Try connecting from a different network to rule out firewall issues

#### Issue 3: "Failed to send email. Please check your email and try again."
**Cause:** Email sending failed after connection succeeded
**Solution:**
1. Check if `info@kuer.co.ke` is a valid Zoho email address
2. Verify the email address has permission to send emails
3. Check Zoho Mail settings for any restrictions
4. Look at Zoho Mail logs for bounce/rejection reasons

#### Issue 4: Form submits but no email received
**Cause:** Email might be going to spam or blocked
**Solution:**
1. Check spam/junk folder in `info@kuer.co.ke`
2. Check Zoho Mail quarantine
3. Verify sender email is whitelisted
4. Check Zoho Mail security settings

## Testing the Form

### Test 1: Basic Submission
1. Go to `/rankings` page
2. Scroll to "CONTACT US ABOUT POTENTIAL PARTNERSHIP" section
3. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Message: "This is a test message"
4. Click "SUBMIT"
5. Check for success message

### Test 2: Verify Emails
1. Check `info@kuer.co.ke` for the inquiry email
2. Check `test@example.com` for the confirmation email
3. Verify both emails contain correct information

### Test 3: Error Handling
1. Try submitting with empty fields (should show error)
2. Try submitting with invalid email (should show error)
3. Try submitting with very long message (should work)

## Enhanced Logging

The updated API now logs:
- ✅ Form submission received
- ✅ SMTP transporter creation
- ✅ SMTP connection verification
- ✅ Email sending to KUER
- ✅ Confirmation email sending
- ✅ Success/failure status

All logs are prefixed with emojis for easy identification:
- 📧 = Form submission
- 🔌 = Connection setup
- 🧪 = Testing
- 📤 = Sending
- ✅ = Success
- ❌ = Error
- ⚠️ = Warning

## Zoho Mail Setup Checklist

- [ ] Zoho Mail account created
- [ ] SMTP enabled in Zoho Mail settings
- [ ] App-specific password generated
- [ ] ZOHO_EMAIL set in .env
- [ ] ZOHO_PASSWORD set in .env (app-specific password)
- [ ] ZOHO_SMTP_HOST set to smtp.zoho.com
- [ ] ZOHO_SMTP_PORT set to 587
- [ ] Development server restarted after .env changes
- [ ] Test email sent successfully
- [ ] Confirmation email received

## Contact Form Response Format

### Success Response
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Specific error message"
}
```

## Next Steps

1. **Check server logs** - Look for the emoji-prefixed logs to identify where it's failing
2. **Verify Zoho credentials** - Ensure all environment variables are correct
3. **Test SMTP connection** - The API now tests the connection before sending
4. **Check email addresses** - Verify both sender and recipient emails are valid
5. **Review Zoho settings** - Check Zoho Mail for any restrictions or security settings

## Support

If the form still doesn't work after checking all these items:
1. Check the server logs for specific error messages
2. Verify Zoho Mail account is active and has SMTP enabled
3. Ensure the app-specific password is correct
4. Check firewall/network settings for SMTP port 587
5. Contact Zoho support if SMTP connection fails

The enhanced logging should help identify exactly where the issue is occurring!
