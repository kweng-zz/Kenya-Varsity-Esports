import { test, expect } from '@playwright/test';

test.describe('Contact Form Validation Error Visibility', () => {
  test('should display specific validation error when message is too short', async ({ page }) => {
    // Array to capture console messages
    const consoleMessages: string[] = [];
    
    // Monitor console messages
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });

    // Navigate to contact page
    await page.goto('/contact');

    // Wait for form to be visible
    await page.waitForSelector('form');

    // Fill form with invalid data (message too short)
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Short'); // Less than 10 characters

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for error message to appear
    await page.waitForSelector('.bg-red-900\\/20', { timeout: 10000 });

    // Check if console logged the validation error
    const hasValidationError = consoleMessages.some(msg => 
      msg.includes('VALIDATION_ERROR') || msg.includes('validation')
    );
    expect(hasValidationError).toBeTruthy();

    // Check if console logged the specific validation details
    const hasDetailsLog = consoleMessages.some(msg => 
      msg.includes('Message must be at least 10 characters long') ||
      msg.includes('message') && msg.includes('characters')
    );
    expect(hasDetailsLog).toBeTruthy();

    // Check if UI displays the specific error message
    const errorDiv = await page.locator('.bg-red-900\\/20 .text-red-400');
    await expect(errorDiv).toBeVisible();
    
    const errorText = await errorDiv.textContent();
    expect(errorText).toContain('Message must be at least 10 characters');
  });

  test('should display validation error for invalid email', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });

    await page.goto('/contact');
    await page.waitForSelector('form');

    // Fill form with invalid email
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('textarea[name="message"]', 'This is a valid message with more than 10 characters');

    await page.click('button[type="submit"]');

    // Wait for error message (client-side validation should catch this)
    await page.waitForSelector('.bg-red-900\\/20', { timeout: 5000 });

    const errorDiv = await page.locator('.bg-red-900\\/20 .text-red-400');
    await expect(errorDiv).toBeVisible();
    
    const errorText = await errorDiv.textContent();
    expect(errorText).toContain('email');
  });

  test('should display validation error for short name', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });

    await page.goto('/contact');
    await page.waitForSelector('form');

    // Fill form with short name
    await page.fill('input[name="name"]', 'A');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a valid message with more than 10 characters');

    await page.click('button[type="submit"]');

    // Wait for error message
    await page.waitForSelector('.bg-red-900\\/20', { timeout: 5000 });

    const errorDiv = await page.locator('.bg-red-900\\/20 .text-red-400');
    await expect(errorDiv).toBeVisible();
    
    const errorText = await errorDiv.textContent();
    expect(errorText).toContain('Name must be at least 2 characters');
  });
});
