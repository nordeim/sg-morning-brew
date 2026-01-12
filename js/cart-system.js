/**
 * Morning Brew Collective - E-commerce System
 * Handles Cart (LocalStorage), Order Form Validation, and Payment Integrations
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== CART FUNCTIONALITY =====
    class CartSystem {
        constructor() {
            this.cart = this.loadCart();
            this.cartOverlay = document.getElementById('cart-overlay');
            this.cartToggle = document.querySelector('.cart-icon');
            this.cartClose = document.querySelector('.cart-close');
            this.cartItemsList = document.querySelector('.cart-items-list');
            this.subtotalElement = document.querySelector('.subtotal-amount');
            this.gstElement = document.querySelector('.gst-amount');
            this.totalElement = document.querySelector('.total-amount');
            this.countBadge = document.querySelector('.cart-count-badge');
            this.cartCount = document.querySelector('.cart-count');
            this.checkoutBtn = document.querySelector('.btn-checkout');
            this.clearCartBtn = document.querySelector('.btn-clear-cart');
            this.cartEmptyState = document.querySelector('.cart-empty');
            this.cartItemsContainer = document.querySelector('.cart-items-list');
            
            this.template = document.getElementById('cart-item-template') ? document.getElementById('cart-item-template').content : null;
            
            if (this.template) {
                this.initEventListeners();
                this.renderCart();
            } else {
                console.warn('Cart template not found');
            }
        }
        
        loadCart() {
            try {
                const savedCart = localStorage.getItem('morningBrewCart');
                return savedCart ? JSON.parse(savedCart) : [];
            } catch (error) {
                console.error('Error loading cart:', error);
                return [];
            }
        }
        
        saveCart() {
            try {
                localStorage.setItem('morningBrewCart', JSON.stringify(this.cart));
            } catch (error) {
                console.error('Error saving cart:', error);
            }
        }
        
        initEventListeners() {
            if (this.cartToggle) {
                this.cartToggle.addEventListener('click', () => this.toggleCart());
            }
            
            if (this.cartClose) {
                this.cartClose.addEventListener('click', () => this.closeCart());
            }
            
            if (this.cartOverlay) {
                this.cartOverlay.addEventListener('click', (e) => {
                    if (e.target === this.cartOverlay) {
                        this.closeCart();
                    }
                });
            }
            
            if (this.clearCartBtn) {
                this.clearCartBtn.addEventListener('click', () => this.clearCart());
            }
            
            // Add to cart buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const product = {
                        id: button.dataset.product,
                        name: button.closest('.menu-item-content').querySelector('.menu-item-title').textContent,
                        price: parseFloat(button.dataset.price),
                        quantity: 1
                    };
                    this.addToCart(product);
                });
            });
            
            // Checkout button
            if (this.checkoutBtn) {
                this.checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
            }
        }
        
        toggleCart() {
            if (!this.cartOverlay) return;
            
            const isOpen = this.cartOverlay.getAttribute('aria-hidden') === 'false';
            this.cartOverlay.setAttribute('aria-hidden', !isOpen);
            document.body.style.overflow = isOpen ? 'auto' : 'hidden';
            
            if (!isOpen && this.cart.length === 0) {
                this.showEmptyCart();
            }
        }
        
        closeCart() {
            if (!this.cartOverlay) return;
            
            this.cartOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
        
        addToCart(product) {
            const existingItem = this.cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += product.quantity;
            } else {
                this.cart.push(product);
            }
            
            this.saveCart();
            this.renderCart();
            this.showCartNotification(product.name);
            
            // Announce to screen readers
            const event = new CustomEvent('cart-updated', { 
                detail: { items: this.cart.length, total: this.calculateTotal() } 
            });
            document.dispatchEvent(event);
        }
        
        calculateTotal() {
             const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
             return subtotal * 1.09; // Including GST
        }
        
        updateQuantity(itemId, change) {
            const item = this.cart.find(item => item.id === itemId);
            if (item) {
                item.quantity += change;
                
                if (item.quantity <= 0) {
                    this.removeItem(itemId);
                } else {
                    this.saveCart();
                    this.renderCart();
                }
            }
        }
        
        removeItem(itemId) {
            this.cart = this.cart.filter(item => item.id !== itemId);
            this.saveCart();
            this.renderCart();
        }
        
        clearCart() {
            this.cart = [];
            this.saveCart();
            this.renderCart();
        }
        
        showCartNotification(productName) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <div class="notification-icon">✓</div>
                    <div class="notification-text">
                        <strong>${productName}</strong> added to cart!
                    </div>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Trigger animation
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // Auto hide after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }
        
        showEmptyCart() {
            if (this.cartEmptyState) this.cartEmptyState.style.display = 'block';
            if (this.cartItemsList) this.cartItemsList.style.display = 'none'; // Note: using cartItemsList to toggle visibility of list container logic
        }
        
        hideEmptyCart() {
             if (this.cartEmptyState) this.cartEmptyState.style.display = 'none';
             if (this.cartItemsList) this.cartItemsList.style.display = 'block';
        }
        
        renderCart() {
            if (!this.countBadge || !this.cartCount) return;

            // Update cart count
            const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            this.countBadge.textContent = totalCount;
            this.cartCount.textContent = totalCount;
            
            // Toggle empty state
            if (this.cart.length === 0) {
                this.showEmptyCart();
                if (this.checkoutBtn) this.checkoutBtn.disabled = true;
            } else {
                this.hideEmptyCart();
                if (this.checkoutBtn) this.checkoutBtn.disabled = false;
            }
            
            // Clear existing items
            if (this.cartItemsList) {
                this.cartItemsList.innerHTML = '';
                
                // Render each cart item
                this.cart.forEach(item => {
                    const itemElement = this.template.cloneNode(true);
                    const itemNode = itemElement.querySelector('.cart-item');
                    
                    itemNode.querySelector('.cart-item-name').textContent = item.name;
                    itemNode.querySelector('.cart-item-price').textContent = `$${(item.price * item.quantity).toFixed(2)}`;
                    itemNode.querySelector('.cart-item-quantity').textContent = `${item.quantity}x`;
                    itemNode.querySelector('.quantity-display').textContent = item.quantity;
                    
                    // Set data attributes for event listeners
                    const minusBtn = itemNode.querySelector('.minus');
                    const plusBtn = itemNode.querySelector('.plus');
                    const removeBtn = itemNode.querySelector('.remove-item');
                    
                    if (minusBtn) minusBtn.dataset.itemId = item.id;
                    if (plusBtn) plusBtn.dataset.itemId = item.id;
                    if (removeBtn) removeBtn.dataset.itemId = item.id;
                    
                    this.cartItemsList.appendChild(itemNode);
                });
                
                // Add event listeners to new elements - delegated
                // Or attach directly as above is cleaner but we cloned nodes.
                // Re-attaching listeners:
                this.cartItemsList.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemId = e.currentTarget.dataset.itemId;
                        this.updateQuantity(itemId, -1);
                    });
                });
                
                this.cartItemsList.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemId = e.currentTarget.dataset.itemId;
                        this.updateQuantity(itemId, 1);
                    });
                });
                
                this.cartItemsList.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemId = e.currentTarget.dataset.itemId;
                        this.removeItem(itemId);
                    });
                });
            }
            
            // Update totals
            this.updateTotals();
        }
        
        updateTotals() {
            const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const gst = subtotal * 0.09; // 9% GST
            const total = subtotal + gst;
            
            if (this.subtotalElement) this.subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            if (this.gstElement) this.gstElement.textContent = `$${gst.toFixed(2)}`;
            if (this.totalElement) this.totalElement.textContent = `$${total.toFixed(2)}`;
            
            // Update order summary on form if exists
            const summaryItemCount = document.querySelector('.item-count');
            const summaryItemAmount = document.querySelector('.item-amount');
            const summaryTotalAmount = document.querySelector('.summary-total .total-amount');

            if (summaryItemCount) summaryItemCount.textContent = `${this.cart.reduce((sum, item) => sum + item.quantity, 0)} items`;
            if (summaryItemAmount) summaryItemAmount.textContent = `$${subtotal.toFixed(2)}`;
            if (summaryTotalAmount) summaryTotalAmount.textContent = `$${total.toFixed(2)}`;
        }
        
        proceedToCheckout() {
            if (this.cart.length === 0) return;
            
            // Scroll to order form
            const orderSection = document.getElementById('order');
            if (orderSection) {
                orderSection.scrollIntoView({ behavior: 'smooth' });
                this.closeCart();
                this.updateTotals(); // Ensure summary is fresh
            }
        }
    }
    
    // Initialize cart system
    const cartSystem = new CartSystem();
    
    // ===== FORM VALIDATION & SUBMISSION =====
    class OrderFormHandler {
        constructor() {
            this.form = document.getElementById('order-form');
            this.deliveryOnlyFields = document.querySelectorAll('.delivery-only');
            this.orderTypeRadios = document.querySelectorAll('input[name="order-type"]');
            this.submitBtn = document.querySelector('.btn-submit-order');
            this.btnText = this.submitBtn ? this.submitBtn.querySelector('.btn-text') : null;
            this.spinner = this.submitBtn ? this.submitBtn.querySelector('.btn-spinner') : null;
            
            this.initEventListeners();
        }
        
        initEventListeners() {
            if (!this.form) return;
            
            // Order type change
            this.orderTypeRadios.forEach(radio => {
                radio.addEventListener('change', () => this.toggleDeliveryFields());
            });
            
            // Form submission
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            this.form.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.validateField(input));
            });
            
            // Init fields state
            this.toggleDeliveryFields();
        }
        
        toggleDeliveryFields() {
            const deliveryRadio = document.getElementById('delivery');
            const isDelivery = deliveryRadio ? deliveryRadio.checked : false;
            
            this.deliveryOnlyFields.forEach(field => {
                field.style.display = isDelivery ? 'block' : 'none';
                
                // Toggle required attribute for delivery fields
                const input = field.querySelector('input');
                if (input) {
                    if (isDelivery) {
                        input.setAttribute('required', '');
                    } else {
                        input.removeAttribute('required');
                    }
                }
            });
        }
        
        validateField(field) {
            let isValid = true;
            let errorMessage = '';
            
            if (field.required && !field.value.trim()) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value.trim())) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }
            
            if (field.type === 'tel' && field.value.trim()) {
                // Singapore phone regex (8 or 9 followed by 7 digits)
                const phoneRegex = /^[89]\d{7}$|^[89]\d{3}\s?\d{4}$/;
                if (!phoneRegex.test(field.value.trim())) {
                    isValid = false;
                    errorMessage = 'Please enter a valid Singapore mobile number (e.g., 8123 4567)';
                }
            }
            
            this.setFieldValidity(field, isValid, errorMessage);
            return isValid;
        }
        
        setFieldValidity(field, isValid, errorMessage = '') {
            const fieldGroup = field.closest('.form-group');
            if (!fieldGroup) return;

            const existingError = fieldGroup.querySelector('.error-message');
            
            field.classList.toggle('invalid', !isValid);
            
            if (!isValid) {
                if (!existingError) {
                    const error = document.createElement('div');
                    error.className = 'error-message';
                    error.textContent = errorMessage;
                    fieldGroup.appendChild(error);
                } else {
                    existingError.textContent = errorMessage;
                }
                
                // Dispatch event for screen reader
                const event = new CustomEvent('form-error', { detail: { message: errorMessage } });
                document.dispatchEvent(event);
            } else {
                if (existingError) existingError.remove();
            }
        }
        
        validateForm() {
            let isValid = true;
            
            // Check only visible fields that are required
            this.form.querySelectorAll('input:not([style*="display: none"]), select, textarea').forEach(field => {
                 // Skip hidden parent fields
                 if (field.offsetParent === null) return;
                 
                 if (field.hasAttribute('required') && !this.validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }
        
        showLoading(state) {
            if (!this.submitBtn) return;
            this.submitBtn.disabled = state;
            if (this.spinner) this.spinner.style.display = state ? 'inline-block' : 'none';
            if (this.btnText) this.btnText.textContent = state ? 'Processing...' : 'Place Order';
        }
        
        showSuccess(message) {
            const successElement = document.createElement('div');
            successElement.className = 'form-success';
            successElement.innerHTML = `
                <div class="success-icon">✓</div>
                <p class="success-message">${message}</p>
            `;
            
            this.form.prepend(successElement);
            
            // Auto hide
            setTimeout(() => {
                successElement.style.opacity = '0';
                setTimeout(() => successElement.remove(), 300);
            }, 5000);
        }
        
        showError(message) {
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.innerHTML = `
                <div class="error-icon">!</div>
                <p class="error-message">${message}</p>
            `;
            
            this.form.prepend(errorElement);
            
            setTimeout(() => {
                errorElement.style.opacity = '0';
                setTimeout(() => errorElement.remove(), 300);
            }, 5000);
        }
        
        async handleSubmit(e) {
            e.preventDefault();
            
            if (!this.validateForm()) {
                this.showError('Please fill in all required fields correctly');
                return;
            }
            
            if (cartSystem.cart.length === 0) {
                 this.showError('Your cart is empty');
                 return;
            }
            
            this.showLoading(true);
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const formData = new FormData(this.form);
                const orderData = {
                    type: formData.get('order-type'),
                    location: formData.get('location-select'),
                    name: formData.get('name'),
                    phone: `+65 ${formData.get('phone')}`,
                    email: formData.get('email'),
                    time: formData.get('time-preference'),
                    instructions: formData.get('special-instructions'),
                    halal: formData.get('halal-preference') === 'on',
                    items: cartSystem.cart,
                    timestamp: new Date().toISOString()
                };
                
                console.log('Order submitted:', orderData);
                
                // Show success message
                this.showSuccess('Your order has been placed successfully! You will receive a confirmation SMS shortly.');
                
                // Clear form and cart
                this.form.reset();
                cartSystem.clearCart();
                this.toggleDeliveryFields(); // Reset logic
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
            } catch (error) {
                console.error('Order submission error:', error);
                this.showError('Failed to place order. Please try again or contact us directly.');
            } finally {
                this.showLoading(false);
            }
        }
    }
    
    // Initialize order form
    const orderFormHandler = new OrderFormHandler();
    
    // ===== LANGUAGE SWITCHER =====
    class LanguageSwitcher {
        constructor() {
            this.languageToggle = document.querySelector('.language-toggle');
            this.currentLang = 'en';
            this.languages = {
                en: 'English',
                zh: '中文',
                ms: 'Bahasa Melayu',
                ta: 'தமிழ்'
            };
            
            this.initEventListeners();
        }
        
        initEventListeners() {
            if (!this.languageToggle) return;
            
            this.languageToggle.addEventListener('click', () => this.toggleLanguages());
        }
        
        toggleLanguages() {
            // Check if already open
            let languagesContainer = document.querySelector('.languages-dropdown');
            
            if (languagesContainer) {
                languagesContainer.remove();
                return;
            }

            languagesContainer = document.createElement('div');
            languagesContainer.className = 'languages-dropdown';
            
            Object.entries(this.languages).forEach(([code, name]) => {
                const langBtn = document.createElement('button');
                langBtn.className = `lang-btn ${code === this.currentLang ? 'active' : ''}`;
                langBtn.dataset.lang = code;
                langBtn.textContent = name;
                langBtn.addEventListener('click', () => this.setLanguage(code));
                languagesContainer.appendChild(langBtn);
            });
            
            // Position dropdown
            const rect = this.languageToggle.getBoundingClientRect();
            languagesContainer.style.position = 'absolute';
            languagesContainer.style.top = `${rect.bottom + 8}px`;
            languagesContainer.style.right = `${window.innerWidth - rect.right}px`;
            languagesContainer.style.zIndex = '1000';
            
            // Close when clicking outside
            const closeDropdown = (e) => {
                if (languagesContainer && !languagesContainer.contains(e.target) && e.target !== this.languageToggle && !this.languageToggle.contains(e.target)) {
                    languagesContainer.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            };
            
            document.body.appendChild(languagesContainer);
            setTimeout(() => {
                document.addEventListener('click', closeDropdown);
            }, 0);
        }
        
        setLanguage(langCode) {
            this.currentLang = langCode;
            
            // Update Toggle Button Text
            const langSpan = this.languageToggle.querySelector('.current-lang');
            if (langSpan) langSpan.textContent = this.languages[langCode];

            document.documentElement.lang = langCode;
            
            // Store preference
            localStorage.setItem('preferredLanguage', langCode);
            
            // Close dropdown
            const languagesContainer = document.querySelector('.languages-dropdown');
            if (languagesContainer) languagesContainer.remove();

            console.log('Language changed to:', langCode);
        }
    }
    
    // Initialize language switcher
    new LanguageSwitcher();
    
    // ===== PAYMENT METHOD INTEGRATION =====
    class PaymentHandler {
        constructor() {
            this.paymentButtons = document.querySelectorAll('.payment-option'); // Changed selector to match class in HTML
            this.initEventListeners();
        }
        
        initEventListeners() {
            this.paymentButtons.forEach(button => {
                button.addEventListener('click', (e) => this.handlePayment(e));
                button.style.cursor = 'pointer'; // Make them look clickable
            });
        }
        
        handlePayment(e) {
            // Determine type based on text content since data attr might not be there in HTML snippet
            const text = e.currentTarget.textContent.toLowerCase();
            let method = '';
            
            if (text.includes('paynow')) method = 'paynow';
            else if (text.includes('grabpay')) method = 'grabpay';
            else if (text.includes('visa') || text.includes('mastercard')) method = 'card';
            
            switch(method) {
                case 'paynow':
                    this.initiatePayNow();
                    break;
                case 'grabpay':
                    this.initiateGrabPay();
                    break;
                case 'card':
                    this.initiateCardPayment();
                    break;
                default:
                    console.log('Payment method clicked:', text);
            }
        }
        
        initiatePayNow() {
            const notification = document.createElement('div');
            notification.className = 'payment-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <div class="notification-icon">📱</div>
                    <div class="notification-text">
                        <strong>PayNow QR Code</strong> generated!
                    </div>
                </div>
            `;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 4000);
        }
        
        initiateGrabPay() {
            alert('GrabPay integration would open the Grab app.');
        }
        
        initiateCardPayment() {
            alert('Secure card payment gateway would open.');
        }
    }
    
    // Initialize payment handler
    new PaymentHandler();
});
