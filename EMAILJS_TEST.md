# EmailJS Test Configuration

This file contains test credentials to verify the EmailJS integration works.

## Test Environment Variables (add to your .env file temporarily):

```env
# EmailJS Test Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_test123
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_test456
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=test_public_key_789
```

## Test Data for Manual Testing:

### Test Form Submission:
- Name: Test User
- Email: test@example.com
- Message: This is a test message to verify the email flow works correctly.

### Expected Flow:
1. Form submission → EmailJS → events@tunzaesports.com
2. Gmail forwarding → gmbnostudios@gmail.com
3. Auto-responder → test@example.com

### Test Checklist:
- [ ] Form accepts submission
- [ ] EmailJS processes without errors
- [ ] Email arrives at events@tunzaesports.com
- [ ] Forwarded copy arrives at gmbnostudios@gmail.com
- [ ] Auto-responder sent to test@example.com
- [ ] Success message shown on form

## Debug Steps if Issues Occur:

1. **Check browser console** for EmailJS errors
2. **Check EmailJS dashboard** for send logs
3. **Check Gmail forwarding settings** in events@tunzaesports.com
4. **Check Gmail vacation responder** settings
5. **Verify environment variables** are loaded correctly

## Common Error Messages and Solutions:

### "EmailJS configuration missing"
- Solution: Verify environment variables are set correctly

### "EmailJS returned non-200 status"
- Solution: Check EmailJS service connection and template setup

### "No email received"
- Solution: Check Gmail forwarding is enabled and confirmed

### "No auto-response received"
- Solution: Check Gmail vacation responder is enabled