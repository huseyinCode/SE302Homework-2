import { Base } from './Base.js';

/**
 * Basket page object with organized element groups
 * Maintains original API with improved internal structure
 */
export class Basket extends Base {
  constructor(page) {
    super(page);
    this._initializeBasketElements();
  }

  /**
   * Initialize all basket-related elements
   * @private
   */
  _initializeBasketElements() {
    // Cart display elements
    this._cartDisplay = {
      items: this.page.locator('#basketItems > li:nth-child(1)'),
      total: this.page.locator('#basketItems > li:nth-child(3) > strong'),
      itemName: this.page.locator('#basketItems > li:nth-child(1) > div > h6'),
      itemQuantity: this.page.locator('#basketItems > li:nth-child(2) > div > small'),
      itemCount: this.page.locator('#basketCount')
    };

    // Cart action elements
    this._cartActions = {
      deleteItem: this.page.locator('#basketItems > li:nth-child(2) > div > a'),
      emptyBasket: this.page.locator('body > div > div > div.col-md-4.order-md-2.mb-4 > form > div:nth-child(2) > a'),
      deliveryType: this.page.locator('body > div > div > div.col-md-4.order-md-2.mb-4 > div > div:nth-child(1) > label')
    };

    // Promo code elements
    this._promoCode = {
      input: this.page.locator('body > div > div > div.col-md-4.order-md-2.mb-4 > form > div:nth-child(1) > input'),
      redeem: this.page.locator('body > div > div > div.col-md-4.order-md-2.mb-4 > form > div:nth-child(1) > div:nth-child(3) > button')
    };

    // Shipping form elements
    this._shippingForm = {
      firstName: this.page.locator('#name'),
      lastName: this.page.locator('#lastName'),
      email: this.page.locator('#email'),
      address: this.page.locator('#address'),
      address2: this.page.locator('#address2'),
      country: this.page.locator('#country'),
      city: this.page.locator('#city'),
      zip: this.page.locator('#zip')
    };

    // Payment form elements
    this._paymentForm = {
      cardHolder: this.page.locator('#cc-name'),
      cardNumber: this.page.locator('#cc-number'),
      expiration: this.page.locator('#cc-expiration'),
      cvv: this.page.locator('#cc-cvv')
    };

    // Checkout action
    this._checkoutAction = {
      continue: this.page.locator('body > div > div > div.col-md-8.order-md-1 > form > button')
    };

    // Public API - maintain original property names
    this.cartItems = this._cartDisplay.items;
    this.cartTotal = this._cartDisplay.total;
    this.itemName = this._cartDisplay.itemName;
    this.itemQuantity = this._cartDisplay.itemQuantity;
    this.deleteItemButton = this._cartActions.deleteItem;
    this.totalItemCount = this._cartDisplay.itemCount;
    this.deliveryTypeButton = this._cartActions.deliveryType;
    this.promoCodeInput = this._promoCode.input;
    this.promoCodeRedeemButton = this._promoCode.redeem;
    this.emptyBasketButton = this._cartActions.emptyBasket;
    this.firstNameInput = this._shippingForm.firstName;
    this.lastNameInput = this._shippingForm.lastName;
    this.emailInput = this._shippingForm.email;
    this.addressInput = this._shippingForm.address;
    this.addressInput2 = this._shippingForm.address2;
    this.countryOptionButton = this._shippingForm.country;
    this.cityOptionButton = this._shippingForm.city;
    this.zipInput = this._shippingForm.zip;
    this.cardHolderNameInput = this._paymentForm.cardHolder;
    this.creditNumberInput = this._paymentForm.cardNumber;
    this.creditCardExpirationInput = this._paymentForm.expiration;
    this.cvvInput = this._paymentForm.cvv;
    this.continueCheckoutButton = this._checkoutAction.continue;
  }

  /**
   * Navigate to basket page
   */
  async navigate() {
    await this.goto('/basket');
  }

  /**
   * Get item count in cart
   * @returns {Promise<number>} Item count
   */
  async get_item_count() {
    return await this._cartDisplay.items.count();
  }

  /**
   * Get cart total
   * @returns {Promise<string>} Total price
   */
  async get_total() {
    const totalText = await this._cartDisplay.total.textContent();
    return totalText || '0';
  }

  /**
   * Check if basket is empty
   * @returns {Promise<boolean>} Empty status
   */
  async is_empty() {
    try {
      await this._cartActions.emptyBasket.waitFor({ 
        state: 'visible', 
        timeout: 2000 
      });
      return false;
    } catch (error) {
      return true;
    }
  }

  /**
   * Empty the basket
   */
  async emptyBasket() {
    await this._cartActions.emptyBasket.click();
  }

  /**
   * Apply promotional code
   * @param {string} code - Promo code
   */
  async apply_promo_code(code) {
    await this._promoCode.input.fill(code);
    await this._promoCode.redeem.click();
  }

  /**
   * Fill shipping form
   * @param {Object} data - Form data object
   */
  async fill_form(data) {
    await this._shippingForm.firstName.fill(data.firstName);
    await this._shippingForm.lastName.fill(data.lastName);
    await this._shippingForm.email.fill(data.email);
    await this._shippingForm.address.fill(data.address);
    await this._shippingForm.country.selectOption(data.country);
    await this._shippingForm.city.selectOption(data.city);
    await this._shippingForm.zip.fill(data.zip);
  }

  /**
   * Fill payment information
   * @param {Object} data - Payment data object
   */
  async fill_info(data) {
    await this._paymentForm.cardHolder.fill(data.cardHolder);
    await this._paymentForm.cardNumber.fill(data.cardNumber);
    await this._paymentForm.expiration.fill(data.expiration);
    await this._paymentForm.cvv.fill(data.cvv);
  }

  /**
   * Proceed with checkout
   */
  async proceed_checkout() {
    await this._checkoutAction.continue.click();
  }

  /**
   * Get item name
   * @returns {Promise<string>} Item name
   */
  async get_item_name() {
    const nameText = await this._cartDisplay.itemName.textContent();
    return nameText || '';
  }

  /**
   * Get item quantity
   * @returns {Promise<string>} Item quantity
   */
  async get_item_quantity() {
    const quantityText = await this._cartDisplay.itemQuantity.textContent();
    return quantityText || '';
  }

  /**
   * Delete an item
   */
  async delete_item() {
    await this._cartActions.deleteItem.click();
  }

  /**
   * Get total item count
   * @returns {Promise<string>} Total item count
   */
  async get_total_item_count() {
    const countText = await this._cartDisplay.itemCount.textContent();
    return countText || '0';
  }
}
