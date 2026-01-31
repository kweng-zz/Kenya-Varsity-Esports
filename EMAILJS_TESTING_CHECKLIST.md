# EmailJS Testing Checklist

## Pre-Setup Checklist
- [ ] EmailJS account created
- [ ] Gmail account (events@tunzaesports.com) connected to EmailJS
- [ ] Email template created in EmailJS dashboard
- [ ] Environment variables updated in .env file
- [ ] Application restarted after .env changes

## Testing Steps

### 1. Configuration Test
Open browser console and run:
```javascript
testEmailJS()
```

Expected results:
- [ ] ✅ Configuration check shows all items as "Set"
- [ ] ✅ EmailJS initialized successfully
- [ ] ✅ Test email sent without errors
- [ ] ✅ Response status 200

### 2. Form Submission Test
Navigate to `/contact` page and submit:
- Name: Test User
- Email: test@example.com  
- Message: This is a test message to verify the email flow.

Expected results:
- [ ] ✅ Form accepts all fields
- [ ] ✅ Submit button shows "SENDING..." during submission
- [ ] ✅ Success message appears after submission
- [ ] ✅ Form fields clear after successful submission

### 3. Email Delivery Test
Check email accounts within 5 minutes of submission:

**events@tunzaesports.com Gmail:**
- [ ] ✅ Email received from EmailJS
- [ ] ✅ Subject includes "Contact Form Inquiry: Test User"
- [ ] ✅ Email body contains all form data
- [ ] ✅ Reply-to address set to test@example.com

**gmbnostudios@gmail.com:**
- [ ] ✅ Forwarded copy received
- [ ] ✅ Email content matches original
- [ ] ✅ Forwarding working correctly

**test@example.com (or your test email):**
- [ ] ✅ Auto-response received
- [ ] ✅ From address shows no-reply@tunzaesports.com
- [ ] ✅ Subject mentions thank you/contact
- [ ] ✅ Response includes acknowledgment message

### 4. Error Handling Test
Test various error scenarios:

**Invalid email format:**
- [ ] ✅ Validation error appears
- [ ] ✅ Error message is user-friendly
- [ ] ✅ Form does not submit

**Empty fields:**
- [ ] ✅ Required field validation works
- [ ] ✅ Error messages appear for each empty field
- [ ] ✅ Form does not submit

**Short message (< 10 characters):**
- [ ] ✅ Minimum length validation works
- [ ] ✅ Appropriate error message shown
- [ ] ✅ Form does not submit

## Troubleshooting Guide

### If testEmailJS() fails:
1. Check browser console for specific error messages
2. Verify environment variables are correctly set
3. Ensure EmailJS service is connected to Gmail
4. Check EmailJS template has correct variable names

### If form submission fails:
1. Check browser network tab for failed requests
2. Verify EmailJS service and template IDs
3. Check if EmailJS quota is exceeded (200 emails/month free)
4. Ensure form data matches template variables

### If email forwarding fails:
1. Check Gmail forwarding settings in events@tunzaesports.com
2. Verify forwarding was confirmed via email
3. Check if forwarding is enabled (not disabled)
4. Ensure no Gmail filters are blocking forwarding

### If auto-responder fails:
1. Check Gmail vacation responder settings
2. Ensure vacation responder is enabled
3. Verify subject and message content
4. Check if vacation responder conflicts with other filters

## Performance Considerations

### EmailJS Limits:
- Free tier: 200 emails/month
- 2 email templates maximum
- Basic customization options

### Gmail Forwarding:
- No forwarding limits for personal Gmail
- May experience slight delays (1-5 minutes)
- Keep original email copy for audit trail

### Optimization:
- Consider upgrading EmailJS for higher volume
- Monitor email delivery success rates
- Set up alerts for failed email attempts

## Production Deployment Checklist

Before deploying to production:
- [ ] Replace test credentials with production EmailJS credentials
- [ ] Verify Gmail forwarding is working in production environment
- [ ] Test with real user email addresses
- [ ] Monitor email deliverability and spam ratings
- [ ] Set up backup email service if needed
- [ ] Consider upgrading to paid EmailJS plan for reliability