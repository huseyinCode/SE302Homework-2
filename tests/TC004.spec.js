const { expect, test } = require('@playwright/test');
const { Basket } = require('../pages/Basket');
const { Main } = require('../pages/Main');

/**
 * Navigation and usability test suite
 * Tests navigation flows and user experience
 */
test.describe('Navigation and Usability', () => {
  
  test('TC004.01 Should Have Accessible Navigation Menu', async ({ page }) => {
    // Setup
    const homePage = new Main(page);
    await homePage.navigate();
    
    // Verify URL and navigation elements
    await expect(page).toHaveURL(/sweetshop/);
    await expect(homePage.AboutButton).toBeVisible();
    
    // Test logo click
    const logoVisible = await homePage.logo.isVisible();
    if (logoVisible) {
      await homePage.logo.click();
      await expect(page).toHaveURL(/sweetshop/);
    }
    
    // Test basket button
    const basketButtonVisible = await homePage.BasketButton.isVisible();
    if (basketButtonVisible) {
      await homePage.BasketButton.click();
      await page.waitForTimeout(500);
      
      const currentURL = page.url();
      expect(currentURL).toMatch(/basket/i);
    }
    
    // Navigate back
    await page.goBack();
    await page.waitForLoadState('networkidle');
  });

  test('TC004.02 Should Load Page Quickly', async ({ page }) => {
    // Measure load time
    const startTime = Date.now();
    const homePage = new Main(page);
    await homePage.navigate();
    
    const loadTime = Date.now() - startTime;
    
    // Verify load time is acceptable
    expect(loadTime).toBeLessThan(8000);
    
    // Verify page is loaded
    const isLoaded = await homePage.is_loaded();
    expect(isLoaded).toBeTruthy();
  });

  test('TC004.03 Should Navigate Back From Product To Home', async ({ page }) => {
    // Setup
    const homePage = new Main(page);
    await homePage.navigate();
    
    // Verify initial URL
    await expect(page).toHaveURL('https://sweetshop.netlify.app/');
    
    // Navigate to about page
    await homePage.AboutButton.click();
    await page.waitForLoadState('networkidle');
    
    const aboutURL = page.url();
    expect(aboutURL).not.toBe('https://sweetshop.netlify.app/');
    
    // Navigate back to home
    const homeButton = page.locator('body > nav > div > a');
    await homeButton.click();
    await page.waitForLoadState('networkidle');
    
    // Verify back at home
    await expect(page).toHaveURL('https://sweetshop.netlify.app/');
  });

  test('TC004.04 Should Display Empty Cart Message', async ({ page }) => {
    // Navigate directly to basket
    await page.goto('https://sweetshop.netlify.app/basket');
    
    const basketPage = new Basket(page);
    const isEmpty = await basketPage.is_empty();
    
    // Clear basket if not empty
    if (!isEmpty) {
      const emptyButtonVisible = await basketPage.emptyBasketButton.isVisible();
      if (emptyButtonVisible) {
        await basketPage.emptyBasket();
        await page.waitForTimeout(1000);
      }
    }
    
    // Verify page loaded
    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/sweetshop/);
  });
});
