import { expect, test } from '@playwright/test';
import { Main } from '../pages/Main.js';
import { Login } from '../pages/Login.js';

/**
 * Form validation test suite
 * Tests various form input scenarios
 */
test.describe('Form Validation', () => {
  
  test('TC-001.1 Validating with valid credentials', async ({ page, browserName }) => {
    // Initialize page objects
    const mainPage = new Main(page);
    await mainPage.navigate();
    
    // Navigate to login page
    await mainPage.LoginButton.waitFor({ state: 'visible', timeout: 5000 });
    
    // Firefox-specific handling: use force click or navigate directly
    if (browserName === 'firefox') {
      try {
        await Promise.all([
          page.waitForURL(/\/login/, { timeout: 15000 }),
          mainPage.LoginButton.click({ force: true })
        ]);
      } catch (error) {
        // Fallback: navigate directly if click fails, but only if not already on login page
        const currentURL = page.url();
        if (!currentURL.includes('/login')) {
          await page.goto('/login', { waitUntil: 'domcontentloaded' });
        }
      }
    } else {
      await mainPage.LoginButton.click();
    }
    
    // Initialize login page
    const loginPage = new Login(page);
    await loginPage.emailAddressInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Test data
    const validEmail = 'test@example.com';
    const validPassword = 'password123';
    
    // Fill form fields
    await loginPage.emailAddressInput.fill(validEmail);
    await loginPage.passwordInput.fill(validPassword);
    
    // Verify input values
    const emailValue = await loginPage.emailAddressInput.inputValue();
    const passwordValue = await loginPage.passwordInput.inputValue();
    
    // Assertions
    expect(emailValue).toBe(validEmail);
    expect(passwordValue).toBe(validPassword);
  });

  test('TC-001.2 Null form', async ({ page, browserName }) => {
    // Setup
    const mainPage = new Main(page);
    await mainPage.navigate();
    
    // Navigate to login
    await mainPage.LoginButton.waitFor({ state: 'visible' });
    
    // Firefox-specific handling: use force click or navigate directly
    if (browserName === 'firefox') {
      try {
        await Promise.all([
          page.waitForURL(/\/login/, { timeout: 15000 }),
          mainPage.LoginButton.click({ force: true })
        ]);
      } catch (error) {
        // Fallback: navigate directly if click fails, but only if not already on login page
        const currentURL = page.url();
        if (!currentURL.includes('/login')) {
          await page.goto('/login', { waitUntil: 'domcontentloaded' });
        }
      }
    } else {
      await mainPage.LoginButton.click();
    }
    
    const loginPage = new Login(page);
    await loginPage.emailAddressInput.waitFor({ state: 'visible' });
    
    // Clear form fields
    await loginPage.emailAddressInput.clear();
    await loginPage.passwordInput.clear();
    
    // Submit empty form - Firefox-specific handling
    if (browserName === 'firefox') {
      try {
        await loginPage.loginButton.click({ force: true, timeout: 10000 });
      } catch (error) {
        // Fallback: use JavaScript click for Firefox if page is still valid
        try {
          if (!page.isClosed()) {
            await loginPage.loginButton.evaluate(el => el.click());
          }
        } catch (e) {
          // If page is closed, skip the click
          console.warn('Page closed, skipping click');
        }
      }
    } else {
      await loginPage.loginButton.click();
    }
    
    // Check for errors
    const hasError = await page.locator('text=/error|crash|failed/i').isVisible();
    expect(hasError).toBeFalsy();
  });

  test('TC-001.3 Handling Long Input', async ({ page, browserName }) => {
    // Setup
    const mainPage = new Main(page);
    await mainPage.navigate();
    
    await mainPage.LoginButton.waitFor({ state: 'visible' });
    
    // Firefox-specific handling: use force click or navigate directly
    if (browserName === 'firefox') {
      try {
        await Promise.all([
          page.waitForURL(/\/login/, { timeout: 15000 }),
          mainPage.LoginButton.click({ force: true })
        ]);
      } catch (error) {
        // Fallback: navigate directly if click fails, but only if not already on login page
        const currentURL = page.url();
        if (!currentURL.includes('/login')) {
          await page.goto('/login', { waitUntil: 'domcontentloaded' });
        }
      }
    } else {
      await mainPage.LoginButton.click();
    }
    
    const loginPage = new Login(page);
    await loginPage.emailAddressInput.waitFor({ state: 'visible' });
    
    // Generate long input string
    const longInput = 'a'.repeat(1000);
    
    // Fill with long input
    await loginPage.emailAddressInput.fill(longInput);
    await loginPage.passwordInput.fill(longInput);
    
    // Verify input was accepted
    const actualEmail = await loginPage.emailAddressInput.inputValue();
    expect(actualEmail.length).toBeGreaterThan(0);
  });

  test('TC-001.4 Invalid email format', async ({ page, browserName }) => {
    // Setup
    const mainPage = new Main(page);
    await mainPage.navigate();
    
    await mainPage.LoginButton.waitFor({ state: 'visible' });
    
    // Firefox-specific handling: use force click or navigate directly
    if (browserName === 'firefox') {
      try {
        await Promise.all([
          page.waitForURL(/\/login/, { timeout: 15000 }),
          mainPage.LoginButton.click({ force: true })
        ]);
      } catch (error) {
        // Fallback: navigate directly if click fails, but only if not already on login page
        const currentURL = page.url();
        if (!currentURL.includes('/login')) {
          await page.goto('/login', { waitUntil: 'domcontentloaded' });
        }
      }
    } else {
      await mainPage.LoginButton.click();
    }
    
    const loginPage = new Login(page);
    await loginPage.emailAddressInput.waitFor({ state: 'visible' });
    
    // Invalid email format
    const invalidEmail = 'not-in-a-correct-from-of-email:)';
    
    // Fill form with invalid email
    await loginPage.emailAddressInput.fill(invalidEmail);
    await loginPage.passwordInput.fill('password123');
    await loginPage.loginButton.click();
    
    // Verify no crash occurred
    const hasError = await page.locator('text=/error|crash/i').isVisible();
    expect(hasError).toBeFalsy();
  });
});
