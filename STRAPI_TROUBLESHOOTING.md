# Strapi Blog Troubleshooting Guide

## Quick Diagnosis Steps

### Step 1: Check Strapi Server Status
```bash
# Navigate to your Strapi directory
cd kuer

# Start Strapi in development mode
npm run develop

# Or if using yarn
yarn develop
```

**Expected Result**: Strapi should start on `http://localhost:1337`

### Step 2: Verify Environment Variables
Check your `.env.local` file contains:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here
```

### Step 3: Test Strapi Connection
Visit: `http://localhost:1337/admin`
- Can you access the admin panel?
- Can you see your articles in the Content Manager?

### Step 4: Check Article Content Type
In Strapi Admin:
1. Go to Content-Type Builder
2. Verify "Article" content type exists with these fields:
   - title (Text)
   - description (Text)
   - content (Rich Text or JSON)
   - slug (Text, unique)
   - category (Text)
   - game (Text, optional)
   - author (Text)
   - featured (Boolean)
   - tags (JSON)
   - image (Media, single)

### Step 5: Check Permissions
In Strapi Admin:
1. Go to Settings > Users & Permissions Plugin > Roles
2. Click on "Public" role
3. Under "Article" permissions, enable:
   - find
   - findOne
4. Under "Upload" permissions, enable:
   - upload
5. Save

## Common Issues and Solutions

### Issue 1: 404 Article Not Found

**Symptoms**: 
- Article creates successfully in admin
- But returns 404 when viewing `/blogs/article-slug`

**Diagnosis**:
1. Check if article exists in Strapi admin
2. Verify the slug matches exactly
3. Check if article is published (not draft)

**Solutions**:
```bash
# Check the article in Strapi admin
# Go to Content Manager > Article
# Verify the article exists and is published

# Check the slug format
# Ensure no special characters or spaces
```

**Code Fix**: The slug generation has been improved in the API. Check the browser console for debugging info.

### Issue 2: Images Disappearing

**Symptoms**:
- Images upload successfully during creation
- Images show in Strapi Media Library
- But images don't display on the website or revert to defaults

**Diagnosis**:
1. Check Strapi Media Library - are images there?
2. Check the article's image field in Strapi admin
3. Check browser network tab for image loading errors

**Solutions**:

1. **Check Image URL Format**:
   ```javascript
   // In browser console, check the image URL
   console.log('Image URL:', article.imageUrl);
   // Should be: http://localhost:1337/uploads/filename.jpg
   ```

2. **Verify Upload Permissions**:
   - In Strapi Admin > Settings > Users & Permissions > Public
   - Enable "upload" permission under Upload section

3. **Check Image Association**:
   - In Strapi Admin > Content Manager > Articles
   - Edit your article
   - Verify the image field has the uploaded image selected

### Issue 3: Strapi Connection Errors

**Symptoms**:
- "Cannot connect to Strapi server"
- "Strapi is not configured"

**Solutions**:
1. **Start Strapi**:
   ```bash
   cd kuer
   npm run develop
   ```

2. **Check Environment Variables**:
   ```bash
   # In your Next.js project root
   cat .env.local
   ```

3. **Test API Token**:
   ```bash
   # Test the API token
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:1337/api/articles
   ```

## Advanced Debugging

### Enable Debug Logging
The API routes now include comprehensive logging. Check your browser console and server logs for:
- Article creation details
- Image upload status
- Slug verification
- Error messages

### Manual Testing Steps

1. **Test Article Creation**:
   ```bash
   # Use curl to test article creation
   curl -X POST http://localhost:3000/api/strapi/articles/create \
     -F "title=Test Article" \
     -F "description=Test Description" \
     -F "content=Test Content" \
     -F "category=Test" \
     -F "author=Test Author"
   ```

2. **Test Article Retrieval**:
   ```bash
   # Test getting articles from Strapi directly
   curl http://localhost:1337/api/articles?populate=image
   ```

3. **Test Slug Lookup**:
   ```bash
   # Test finding article by slug
   curl "http://localhost:1337/api/articles?filters[slug][\$eq]=test-article&populate=image"
   ```

## Step-by-Step Fix Process

### For 404 Issues:
1. Create a test article in Strapi admin manually
2. Set a simple slug like "test-article"
3. Ensure it's published
4. Try accessing `/blogs/test-article`
5. Check browser console for errors

### For Image Issues:
1. Upload an image in Strapi Media Library
2. Create an article and associate the image
3. Check the article's JSON response includes image data
4. Verify the image URL is accessible directly

### For Connection Issues:
1. Ensure Strapi is running on port 1337
2. Check firewall/antivirus isn't blocking the connection
3. Verify environment variables are loaded correctly
4. Test API endpoints directly

## Getting Help

If issues persist:
1. Check the browser console for error messages
2. Check the Next.js server logs
3. Check the Strapi server logs
4. Provide the exact error messages when asking for help

## Environment Checklist

- [ ] Strapi server is running (`npm run develop` in kuer folder)
- [ ] Environment variables are set correctly
- [ ] Article content type exists with all required fields
- [ ] Permissions are configured for Public role
- [ ] API token has necessary permissions
- [ ] Images are uploading to Strapi Media Library
- [ ] Articles are being created and published in Strapi
- [ ] Network requests are successful (check browser dev tools)