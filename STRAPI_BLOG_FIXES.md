# Strapi Blog Issues - Diagnosis and Fixes

## Issues Identified

### 1. 404 Article Not Found
**Problem**: When creating new articles, they return 404 when trying to view them.

**Root Causes**:
- Slug generation inconsistency between creation and retrieval
- Strapi v5 uses `documentId` instead of `id` for some operations
- Article might not be properly published in Strapi

### 2. Images Disappearing After Commit
**Problem**: Blog images revert to default images after committing changes.

**Root Causes**:
- Image upload to Strapi might be failing silently
- Image URLs are not being properly stored/retrieved
- Fallback image logic is overriding actual uploaded images

## Solutions

### Fix 1: Improve Slug Handling and Article Retrieval

The issue is in how articles are retrieved by slug. We need to ensure consistent slug generation and proper error handling.

### Fix 2: Fix Image Upload and Storage

The image upload process needs to be more robust with proper error handling and URL generation.

### Fix 3: Add Better Error Handling and Debugging

We need better logging to identify where the process is failing.

## Implementation Steps

1. **Update the article creation API** to ensure proper slug generation and image handling
2. **Improve the article retrieval logic** to handle both Strapi v4 and v5 formats
3. **Add comprehensive error logging** to identify issues
4. **Fix the image URL generation** to ensure images persist correctly
5. **Add validation** to ensure articles are properly published

## Quick Fixes to Try First

1. **Check Strapi Admin Panel**:
   - Verify articles are actually being created
   - Check if images are uploaded to the Media Library
   - Ensure articles are published (not draft)

2. **Check Environment Variables**:
   - Verify `NEXT_PUBLIC_STRAPI_URL` is correct
   - Verify `STRAPI_API_TOKEN` has proper permissions

3. **Check Strapi Permissions**:
   - Article content type: Create, Read, Update, Delete permissions
   - Upload plugin: Upload permissions
   - Public role should have Read permissions for articles

## Detailed Fixes Below