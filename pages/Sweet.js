import { Base } from './Base.js';

/**
 * Sweet/Product detail page object
 * Uses organized element groups while maintaining original API
 */
export class Sweet extends Base {
  constructor(page) {
    super(page);
    this._initializeProductElements();
  }

  /**
   * Initialize product page elements
   * @private
   */
  _initializeProductElements() {
    // Product information elements
    this._productInfo = {
      title: this.page.locator('.card-body h4').first(),
      price: this.page.locator('.card-body .text-muted, .card-body small').first(),
      description: this.page.locator('.card-text').first(),
      image: this.page.locator('.card img').first()
    };

    // Product interaction elements
    this._productActions = {
      addToCart: this.page.locator('button.addItem, a.addItem').first(),
      quantityInput: this.page.locator('input[type="number"], input[name*="quantity"]'),
      increment: this.page.locator('button', { hasText: '+' }),
      decrement: this.page.locator('button', { hasText: '-' }),
      back: this.page.locator('role=button[name=/back/i], a:has-text("Back")')
    };

    // Public API - maintain original property names
    this.productTitle = this._productInfo.title;
    this.productPrice = this._productInfo.price;
    this.productDescription = this._productInfo.description;
    this.productImage = this._productInfo.image;
    this.addToCartButton = this._productActions.addToCart;
    this.quantityInput = this._productActions.quantityInput;
    this.increaseQuantityButton = this._productActions.increment;
    this.decreaseQuantityButton = this._productActions.decrement;
    this.backButton = this._productActions.back;
  }

  /**
   * Get product title
   * @returns {Promise<string>} Product title
   */
  async getProductTitle() {
    const titleText = await this._productInfo.title.textContent();
    return (titleText || '').trim();
  }

  /**
   * Get product price
   * @returns {Promise<string>} Product price
   */
  async getProductPrice() {
    const priceText = await this._productInfo.price.textContent();
    return (priceText || '').trim();
  }

  /**
   * Add product to cart
   */
  async addToCart() {
    await this._productActions.addToCart.waitFor({ state: 'visible' });
    await this._productActions.addToCart.click();
  }

  /**
   * Set product quantity
   * @param {number} quantity - Quantity to set
   */
  async setQuantity(quantity) {
    await this._productActions.quantityInput.fill(quantity.toString());
  }

  /**
   * Adjust quantity using buttons
   * @param {number} times - Number of times to click
   * @param {string} type - 'increase' or 'decrease'
   */
  async adjustQuantity(times = 1, type = 'increase') {
    const targetButton = type === 'increase' 
      ? this._productActions.increment 
      : this._productActions.decrement;
    
    for (let i = 0; i < times; i++) {
      await targetButton.click();
    }
  }

  /**
   * Get current quantity
   * @returns {Promise<number>} Current quantity
   */
  async getQuantity() {
    const quantityValue = await this._productActions.quantityInput.inputValue();
    return parseInt(quantityValue, 10) || 1;
  }

  /**
   * Check if add to cart is enabled
   * @returns {Promise<boolean>} Enabled status
   */
  async isAddToCartEnabled() {
    return await this._productActions.addToCart.isEnabled();
  }

  /**
   * Check if product image is visible
   * @returns {Promise<boolean>} Image visibility status
   */
  async isImageVisible() {
    const imageVisible = await this._productInfo.image.isVisible();
    if (!imageVisible) {
      return false;
    }
    
    return await this._productInfo.image.evaluate(img => {
      return img.complete && img.naturalWidth > 0;
    });
  }

  /**
   * Navigate back
   */
  async goBack() {
    await this._productActions.back.click();
  }
}
