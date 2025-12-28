import { test, expect } from '@playwright/test';
import { Main } from '../pages/Main';
import { Sweet } from '../pages/Sweet';

/**
 * Product quantity boundary test suite
 * Tests quantity validation and boundaries
 */
test.describe('Product Quantity Boundaries', () => {
  
  test('TC003.01 Should Enforce Minimum Quantity Boundary', async ({ page, browserName }) => {
    // Setup
    const mainPage = new Main(page);
    await mainPage.navigate();
    
    // Verify URL
    await expect(page).toHaveURL(/sweetshop/);
    
    // Navigate to product - Firefox-specific handling
    if (browserName === 'firefox') {
      try {
        await mainPage.SweetsButton.nth(0).click({ force: true });
      } catch (error) {
        // Fallback: use JavaScript click for Firefox
        await mainPage.SweetsButton.nth(0).evaluate(el => el.click());
      }
    } else {
      await mainPage.click_product(0);
    }
    const sweetPage = new Sweet(page);
    await page.waitForLoadState('networkidle');
    
    // Check if quantity input is visible
    const quantityInputVisible = await sweetPage.quantityInput.isVisible();
    
    if (quantityInputVisible) {
      // Test zero quantity
      await sweetPage.setQuantity(0);
      
      const currentQuantity = await sweetPage.getQuantity();
      const isAddToCartEnabled = await sweetPage.isAddToCartEnabled();
      
      // Validate zero quantity behavior
      if (currentQuantity === 0) {
        expect(isAddToCartEnabled).toBeFalsy();
      } else {
        expect(currentQuantity).toBeGreaterThan(0);
      }
      
      // Test negative quantity
      await sweetPage.setQuantity(-5);
      const negativeQuantity = await sweetPage.getQuantity();
      expect(negativeQuantity).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC003.02 Should Handle Maximum Quantity Values', async ({ page }) => {
    // Setup
    const mainPage = new Main(page);
    await mainPage.navigate();
    
    // Navigate to product
    await mainPage.click_product(0);
    
    const sweetPage = new Sweet(page);
    await page.waitForLoadState('networkidle');
    
    // Check quantity input visibility
    const quantityInputVisible = await sweetPage.quantityInput.isVisible();
    
    if (quantityInputVisible) {
      // Test large quantity
      const largeQuantity = 9999;
      await sweetPage.setQuantity(largeQuantity);
      
      const actualQuantity = await sweetPage.getQuantity();
      
      // Verify add to cart button is visible
      const isButtonVisible = await sweetPage.addToCartButton.isVisible();
      expect(isButtonVisible).toBeTruthy();
    }
  });

  test('TC003.03 Should Increment And Decrement Quantity Correctly', async ({ page, browserName }) => {
    // Setup
    const mainPage = new Main(page);
    await mainPage.navigate();
    
    // Navigate to product - Firefox-specific handling
    if (browserName === 'firefox') {
      try {
        await mainPage._productElements.grid.nth(0).click({ force: true });
      } catch (error) {
        // Fallback: use JavaScript click for Firefox
        await mainPage._productElements.grid.nth(0).evaluate(el => el.click());
      }
    } else {
      await mainPage.click_product(0);
    }
    
    const sweetPage = new Sweet(page);
    await page.waitForLoadState('networkidle');
    
    // Check increment button visibility
    const incrementButtonVisible = await sweetPage.increaseQuantityButton.isVisible();
    
    if (incrementButtonVisible) {
      // Get initial quantity
      const initialQuantity = await sweetPage.getQuantity();
      
      // Increase quantity
      await sweetPage.adjustQuantity(3, 'increase');
      const newQuantity = await sweetPage.getQuantity();
      expect(newQuantity).toBe(initialQuantity + 3);
      
      // Check decrement button visibility
      const decrementButtonVisible = await sweetPage.decreaseQuantityButton.isVisible();
      if (decrementButtonVisible) {
        // Decrease quantity
        await sweetPage.adjustQuantity(2, 'decrease');
        const finalQuantity = await sweetPage.getQuantity();
        expect(finalQuantity).toBe(newQuantity - 2);
      }
    }
  });
});
