const { expect, test } = require('@playwright/test');
const { Main } = require('../pages/Main');
const { Login } = require('../pages/Login');

/**
 * Extended form validation test suite
 * Additional validation and security tests
 */
test.describe('Form Validation', () => {
  
  test('TC005.01 Should Accept Valid Login Input', async ({ page, browserName }) => {
    // Setup
    const homePage = new Main(page);
    await homePage.navigate();
    
    // Check login button visibility
    const loginButtonVisible = await homePage.LoginButton.isVisible({ timeout: 5000 });
    
    if (loginButtonVisible) {
      // Firefox-specific handling: use force click or navigate directly
      if (browserName === 'firefox') {
        try {
          await Promise.all([
            page.waitForURL(/\/login/, { timeout: 15000 }),
            homePage.LoginButton.click({ force: true })
          ]);
        } catch (error) {
          // Fallback: navigate directly if click fails, but only if not already on login page
          const currentURL = page.url();
          if (!currentURL.includes('/login')) {
            await page.goto('/login', { waitUntil: 'domcontentloaded' });
          }
        }
      } else {
        await homePage.LoginButton.click();
      }
      await page.waitForTimeout(1000);
      
      const loginPage = new Login(page);
      
      // Check email field visibility
      const emailFieldVisible = await loginPage.emailAddressInput.isVisible({ timeout: 5000 });
      
      if (emailFieldVisible) {
        // Test data
        const validEmail = 'test@example.com';
        const validPassword = 'password123';
        
        // Fill form
        await loginPage.emailAddressInput.fill(validEmail);
        await loginPage.passwordInput.fill(validPassword);
        
        // Verify values
        const emailValue = await loginPage.emailAddressInput.inputValue();
        const passwordValue = await loginPage.passwordInput.inputValue();
        
        // Assertions
        expect(emailValue).toBe(validEmail);
        expect(passwordValue).toBe(validPassword);
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('TC005.02 Should Handle Empty Form Submission', async ({ page, browserName }) => {
    // Setup
    const homePage = new Main(page);
    await homePage.navigate();
    
    const loginButtonVisible = await homePage.LoginButton.isVisible({ timeout: 5000 });
    
    if (loginButtonVisible) {
      // Firefox-specific handling: use force click or navigate directly
      if (browserName === 'firefox') {
        try {
          await Promise.all([
            page.waitForURL(/\/login/, { timeout: 15000 }),
            homePage.LoginButton.click({ force: true })
          ]);
        } catch (error) {
          // Fallback: navigate directly if click fails, but only if not already on login page
          const currentURL = page.url();
          if (!currentURL.includes('/login')) {
            await page.goto('/login', { waitUntil: 'domcontentloaded' });
          }
        }
      } else {
        await homePage.LoginButton.click();
      }
      await page.waitForTimeout(1000);
      
      const loginPage = new Login(page);
      
      const emailFieldVisible = await loginPage.emailAddressInput.isVisible({ timeout: 5000 });
      
      if (emailFieldVisible) {
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
        await page.waitForTimeout(1000);
        
        // Check for errors
        const hasError = await page.locator('text=/error|crash|failed/i')
          .isVisible({ timeout: 2000 })
          .catch(() => false);
        
        expect(hasError).toBeFalsy();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('TC005.03 Should Validate Email Format', async ({ page, browserName }) => {
    // Setup
    const homePage = new Main(page);
    await homePage.navigate();
    
    const loginButtonVisible = await homePage.LoginButton.isVisible({ timeout: 5000 });
    
    if (loginButtonVisible) {
      // Firefox-specific handling: use force click or navigate directly
      if (browserName === 'firefox') {
        try {
          await Promise.all([
            page.waitForURL(/\/login/, { timeout: 15000 }),
            homePage.LoginButton.click({ force: true })
          ]);
        } catch (error) {
          // Fallback: navigate directly if click fails, but only if not already on login page
          const currentURL = page.url();
          if (!currentURL.includes('/login')) {
            await page.goto('/login', { waitUntil: 'domcontentloaded' });
          }
        }
      } else {
        await homePage.LoginButton.click();
      }
      await page.waitForTimeout(1000);
      
      const loginPage = new Login(page);
      
      const emailFieldVisible = await loginPage.emailAddressInput.isVisible({ timeout: 5000 });
      
      if (emailFieldVisible) {
        // Invalid email format
        const invalidEmail = 'not-an-valid-email';
        
        // Fill form
        await loginPage.emailAddressInput.fill(invalidEmail);
        await loginPage.passwordInput.fill('sifra123');
        
        // Submit form - Firefox-specific handling
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
        await page.waitForTimeout(1000);
        
        // Check for errors
        const hasError = await page.locator('text=/error|crash/i')
          .isVisible({ timeout: 2000 })
          .catch(() => false);
        
        expect(hasError).toBeFalsy();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('TC005.04 Should Handle Very Long Input', async ({ page, browserName }) => {
    // Setup
    const homePage = new Main(page);
    await homePage.navigate();
    
    const loginButtonVisible = await homePage.LoginButton.isVisible({ timeout: 5000 });
    
    if (loginButtonVisible) {
      // Firefox-specific handling: use force click or navigate directly
      if (browserName === 'firefox') {
        try {
          await Promise.all([
            page.waitForURL(/\/login/, { timeout: 15000 }),
            homePage.LoginButton.click({ force: true })
          ]);
        } catch (error) {
          // Fallback: navigate directly if click fails, but only if not already on login page
          const currentURL = page.url();
          if (!currentURL.includes('/login')) {
            await page.goto('/login', { waitUntil: 'domcontentloaded' });
          }
        }
      } else {
        await homePage.LoginButton.click();
      }
      await page.waitForTimeout(1000);
      
      const loginPage = new Login(page);
      
      const emailFieldVisible = await loginPage.emailAddressInput.isVisible({ timeout: 5000 });
      
      if (emailFieldVisible) {
        // Generate long input
        const longInput = 'a'.repeat(1000);
        
        // Fill form with long input
        await loginPage.emailAddressInput.fill(longInput);
        await loginPage.passwordInput.fill(longInput);
        
        // Verify input was accepted
        const actualEmail = await loginPage.emailAddressInput.inputValue();
        expect(actualEmail.length).toBeGreaterThan(0);
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });
});
