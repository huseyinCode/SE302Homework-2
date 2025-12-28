import { PageCore } from './PageCore.js';

/**
 * Home page object representing the main landing page
 */
export class homePage {
  constructor(browserPage) {
    this.core = new PageCore(browserPage);
    this.browserPage = browserPage;
    
    // Navigation elements
    this.elements = {
      productGridItems: browserPage.locator('div.row.text-center > div.col-lg-3'),
      searchBrowseButton: browserPage.locator('body > div > header > a'),
      aboutNavigationLink: browserPage.locator('#navbarColor01 > ul > li:nth-child(2) > a'),
      shoppingCartLink: browserPage.locator('#navbarColor01 > ul > li:nth-child(4) > a'),
      authenticationLink: browserPage.locator('#navbarColor01 > ul > li:nth-child(3) > a'),
      brandLogo: browserPage.locator('body > div > header > div > img'),
      addToCartActionButton: browserPage.locator('body > div > div.row.text-center > div:nth-child(1) > div > div.card-footer > a'),
      productSearchField: browserPage.locator('#search-input-id')
    };
  }

  /**
   * Navigate to the home page
   */
  async goToHomePage() {
    await this.core.navigateTo('/');
  }

  /**
   * Search for a product by name
   * @param {string} productName - Name of the product to search
   */
  async performProductSearch(productName) {
    const searchFieldVisible = await this.elements.productSearchField.isVisible();
    if (searchFieldVisible) {
      await this.elements.productSearchField.fill(productName);
      await this.elements.searchBrowseButton.click();
      await this.elements.addToCartActionButton.click();
    }
  }

  /**
   * Select a product from the grid by index
   * @param {number} productIndex - Zero-based index of the product
   */
  async selectProductByIndex(productIndex = 0) {
    await this.elements.productGridItems.nth(productIndex).click();
  }

  /**
   * Count the total number of products displayed
   * @returns {Promise<number>} Number of products
   */
  async countDisplayedProducts() {
    return await this.elements.productGridItems.count();
  }

  /**
   * Navigate to the shopping cart
   */
  async openShoppingCart() {
    await this.elements.shoppingCartLink.click();
  }

  /**
   * Verify that the page has fully loaded
   * @returns {Promise<boolean>} True if loaded, false otherwise
   */
  async verifyPageLoaded() {
    try {
      await this.core.waitForNetworkIdle();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract all product names from the page
   * @returns {Promise<string[]>} Array of product names
   */
  async extractAllProductNames() {
    const productElements = await this.elements.productGridItems.all();
    const productNames = [];
    
    for (const productElement of productElements) {
      const nameText = await productElement.textContent();
      if (nameText) {
        productNames.push(nameText.trim());
      }
    }
    
    return productNames;
  }

  /**
   * Navigate to a specific category
   * @param {string} categoryName - Name of the category
   */
  async navigateToCategory(categoryName) {
    await this.browserPage.click(`nav >> text=${categoryName}`);
  }
}


