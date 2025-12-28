import { Base } from './Base.js';

/**
 * Main page object representing the home page
 * Uses organized element groups and helper methods
 */
export class Main extends Base {
  constructor(page) {
    super(page);
    this._initializePageElements();
  }

  /**
   * Initialize all page elements in organized groups
   * @private
   */
  _initializePageElements() {
    // Navigation elements group
    this._navElements = {
      about: this.page.locator('#navbarColor01 > ul > li:nth-child(2) > a'),
      login: this.page.locator('#navbarColor01 > ul > li:nth-child(3) > a'),
      basket: this.page.locator('#navbarColor01 > ul > li:nth-child(4) > a'),
      logo: this.page.locator('body > div > header > div > img')
    };

    // Product-related elements
    this._productElements = {
      grid: this.page.locator('div.row.text-center > div.col-lg-3'),
      addToCart: this.page.locator('body > div > div.row.text-center > div:nth-child(1) > div > div.card-footer > a')
    };

    // Search and browse elements
    this._searchElements = {
      browse: this.page.locator('body > div > header > a'),
      input: this.page.locator('#search-input-id')
    };

    // Public API - maintain original property names
    this.SweetsButton = this._productElements.grid;
    this.BrowseButton = this._searchElements.browse;
    this.AboutButton = this._navElements.about;
    this.BasketButton = this._navElements.basket;
    this.LoginButton = this._navElements.login;
    this.logo = this._navElements.logo;
    this.AddBasketButton = this._productElements.addToCart;
    this.searchInput = this._searchElements.input;
  }

  /**
   * Navigate to home page
   */
  async navigate() {
    await this.goto('/');
  }

  /**
   * Search for a product
   * @param {string} productName - Name of product to search
   */
  async search_product(productName) {
    const searchFieldVisible = await this._searchElements.input.isVisible();
    if (searchFieldVisible) {
      await this._searchElements.input.fill(productName);
      await this._searchElements.browse.click();
      await this._productElements.addToCart.click();
    }
  }

  /**
   * Click on a product by index
   * @param {number} index - Product index (default: 0)
   */
  async click_product(index = 0) {
    await this._productElements.grid.nth(index).click();
  }

  /**
   * Get total product count
   * @returns {Promise<number>} Product count
   */
  async get_product_count() {
    return await this._productElements.grid.count();
  }

  /**
   * Navigate to shopping cart
   */
  async go_to_cart() {
    await this._navElements.basket.click();
  }

  /**
   * Check if page is fully loaded
   * @returns {Promise<boolean>} Load status
   */
  async is_loaded() {
    try {
      await this.page.waitForLoadState('networkidle');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get all product names from the page
   * @returns {Promise<string[]>} Array of product names
   */
  async get_product_names() {
    const productElements = await this._productElements.grid.all();
    const nameList = [];
    
    for (const element of productElements) {
      const textContent = await element.textContent();
      if (textContent) {
        nameList.push(textContent.trim());
      }
    }
    
    return nameList;
  }

  /**
   * Navigate to a category
   * @param {string} category - Category name
   */
  async navigate_to_category(category) {
    await this.page.click(`nav >> text=${category}`);
  }
}
