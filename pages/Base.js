/**
 * Base class providing common page interaction utilities
 * Uses composition and helper methods for better code organization
 */
export class Base {
  constructor(page) {
    this.page = page;
    this._initializeHelpers();
  }

  /**
   * Initialize internal helper methods
   * @private
   */
  _initializeHelpers() {
    this._navigationHelper = {
      goTo: async (url) => await this.page.goto(url),
      getTitle: async () => await this.page.title(),
      getCurrentUrl: () => this.page.url()
    };

    this._interactionHelper = {
      waitForSelector: async (selector, options = {}) => {
        const defaultOptions = { state: 'visible', ...options };
        return await this.page.waitForSelector(selector, defaultOptions);
      },
      checkVisibility: async (selector) => await this.page.isVisible(selector),
      performClick: async (selector) => await this.page.click(selector),
      fillInput: async (selector, text) => await this.page.fill(selector, text),
      getTextContent: async (selector) => await this.page.textContent(selector)
    };
  }

  /**
   * Navigate to a URL
   * @param {string} url - URL to navigate to
   */
  async goto(url) {
    await this._navigationHelper.goTo(url);
  }

  /**
   * Get page title
   * @returns {Promise<string>} Page title
   */
  async get_title() {
    return await this._navigationHelper.getTitle();
  }

  /**
   * Get current URL
   * @returns {string} Current URL
   */
  get_current_URL() {
    return this._navigationHelper.getCurrentUrl();
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - Element selector
   */
  async waitForElement(selector) {
    await this._interactionHelper.waitForSelector(selector);
  }

  /**
   * Check if object is visible
   * @param {string} selector - Element selector
   * @returns {Promise<boolean>} Visibility status
   */
  async isObjVisible(selector) {
    return await this._interactionHelper.checkVisibility(selector);
  }

  /**
   * Click on an object
   * @param {string} selector - Element selector
   */
  async click_obj(selector) {
    await this._interactionHelper.performClick(selector);
  }

  /**
   * Fill input area with text
   * @param {string} selector - Input selector
   * @param {string} text - Text to fill
   */
  async fill_input_area(selector, text) {
    await this._interactionHelper.fillInput(selector, text);
  }

  /**
   * Get text content from element
   * @param {string} selector - Element selector
   * @returns {Promise<string|null>} Text content
   */
  async get_text(selector) {
    return await this._interactionHelper.getTextContent(selector);
  }
}
