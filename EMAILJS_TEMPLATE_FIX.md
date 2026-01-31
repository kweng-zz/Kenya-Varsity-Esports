# EmailJS Template Creation Guide

## Issue Identified: Template Not Found ❌

**Error**: `The template ID not found. To find this ID, visit https://dashboard.emailjs.com/admin/templates`
**Root Cause**: Template `template_flrc99g` doesn't exist in your EmailJS account

## Immediate Fix Required

### Step 1: Create EmailJS Template

1. **Log into EmailJS Dashboard**
2. **Navigate to** Email Templates → Create New Template
3. **Template Settings:**
   - **Template ID**: `contact_form_forward` (or any name you prefer)
   - **From Email**: `events@tunzaesports.com`
   - **To Email**: `events@tunzaesports.com`
   - **Reply To**: `{{from_email}}`
   - **Subject**: `Contact Form Inquiry: {{from_name}}`

### Step 2: Template Content (HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Inquiry</title>
    <style>
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 20px; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #fff; 
            border: 1px solid #ddd; 
        }
        .header { 
            background-color: #961c18; 
            padding: 20px; 
            text-align: center; 
            color: white; 
        }
        .content { 
            padding: 30px; 
        }
        .field-row { 
            display: flex; 
            margin-bottom: 15px; 
        }
        .field-label { 
            font-weight: bold; 
            width: 120px; 
        }
        .field-value { 
            flex: 1; 
        }
        .message-box { 
            background-color: #f9f9f9; 
            padding: 15px; 
            border-radius: 4px; 
            border: 1px solid #eee; 
            margin-top: 20px; 
        }
        .footer { 
            text-align: center; 
            padding: 20px; 
            font-size: 12px; 
            color: #999; 
            border-top: 1px solid #eee; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Contact Form Inquiry</h1>
        </div>
        
        <div class="content">
            <p>You have received a new inquiry from the Tunza Esports website.</p>
            
            <div class="field-row">
                <span class="field-label">Name:</span>
                <span class="field-value">{{from_name}}</span>
            </div>
            
            <div class="field-row">
                <span class="field-label">Email:</span>
                <span class="field-value">{{from_email}}</span>
            </div>
            
            <div class="field-row">
                <span class="field-label">Type:</span>
                <span class="field-value">{{type}}</span>
            </div>
            
            <div class="message-box">
                <p><strong>Message:</strong></p>
                <div>{{message}}</div>
            </div>
            
            <p style="margin-top: 20px;">
                You can reply directly to this email to contact the user.
            </p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from <a href="https://tunzaesports.com" style="color: #961c18;">Tunza Esports</a>.</p>
        </div>
    </div>
</body>
</html>
```

### Step 3: Save Template

1. **Click "Save"** to create the template
2. **Note the Template ID** (EmailJS will assign one)
3. **Update your .env file** with the correct template ID

## Step 4: Update Environment Variables

Replace the template ID in your `.env` file:

```env
# OLD (incorrect)
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_flrc99g

# NEW (use your actual template ID)
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_actual_template_id
```

## Step 5: Test Again

1. **Restart your development server**
2. **Run `testEmailJS()`** in browser console
3. **Submit test form** on your website

## Expected Result

After fixing the template ID:
- ✅ `testEmailJS()` should succeed
- ✅ Form submissions should work
- ✅ Emails should arrive at events@tunzaesports.com
- ✅ Forwarding should work to gmbnostudios@gmail.com

## Common Template Variables

Make sure your template uses these variables:
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email address
- `{{message}}` - User's message
- `{{type}}` - Type of inquiry (partnership)
- `{{to_email}}` - Recipient email (events@tunzaesports.com)
- `{{reply_to}}` - Reply-to address (user's email)

## Alternative: Use Existing Template

If you have an existing template:
1. **Find template ID** in EmailJS dashboard
2. **Update .env** with correct ID
3. **Ensure template variables match** what your code sends

The key is making sure the template ID in your environment variables actually exists in your EmailJS account!