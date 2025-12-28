import { Base } from './Base.js';

/**
 * Login page object with organized element groups
 * Maintains original API while using improved structure
 */
export class Login extends Base {
  constructor(page) {
    super(page);
    this._initializeFormElements();
  }

  /**
   * Initialize form elements in organized structure
   * @private
   */
  _initializeFormElements() {
    // Authentication form elements
    this._authForm = {
      email: this.page.locator('#exampleInputEmail'),
      password: this.page.locator('#exampleInputPassword'),
      submit: this.page.locator('button:has-text("Login"), button[type="submit"]').first()
    };

    // Social authentication options
    this._socialAuth = {
      option1: this.page.locator('body > div > div > div > div > a:nth-child(1) > img'),
      option2: this.page.locator('body > div > div > div > div > a:nth-child(2) > img'),
      option3: this.page.locator('body > div > div > div > div > a:nth-child(3) > img')
    };

    // Navigation elements
    this._navElements = {
      mobileMenu: this.page.locator('body > nav > div > button > span')
    };

    // Public API - maintain original property names
    this.emailAddressInput = this._authForm.email;
    this.passwordInput = this._authForm.password;
    this.loginButton = this._authForm.submit;
    this.socialButton1 = this._socialAuth.option1;
    this.socialButton2 = this._socialAuth.option2;
    this.socialButton3 = this._socialAuth.option3;
    this.navbarButton = this._navElements.mobileMenu;
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.page.goto('/login');
  }

  /**
   * Perform login with credentials
   * @param {string} email - User email
   * @param {string} password - User password
   */
  async login(email, password) {
    await this._authForm.email.fill(email);
    await this._authForm.password.fill(password);
    await this._authForm.submit.click();
  }

  /**
   * Click alternative login button
   * @param {number} buttonNumber - Button number (1, 2, or 3)
   */
  async click_alternative_login(buttonNumber) {
    const buttonMap = {
      1: this._socialAuth.option1,
      2: this._socialAuth.option2,
      3: this._socialAuth.option3
    };
    
    const selectedButton = buttonMap[buttonNumber] || this._socialAuth.option1;
    await selectedButton.click();
  }

  /**
   * Check if login form is visible
   * @returns {Promise<boolean>} Form visibility status
   */
  async is_login_form_visible() {
    return await this._authForm.email.isVisible();
  }

  /**
   * Get email field value
   * @returns {Promise<string>} Email value
   */
  async get_email_value() {
    return await this._authForm.email.inputValue();
  }

  /**
   * Get password field value
   * @returns {Promise<string>} Password value
   */
  async get_password_value() {
    return await this._authForm.password.inputValue();
  }

  /**
   * Clear email field
   */
  async clear_email() {
    await this._authForm.email.clear();
  }

  /**
   * Clear password field
   */
  async clear_password() {
    await this._authForm.password.clear();
  }
}
