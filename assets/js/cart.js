"use strict";

// Simple client-side cart
(function () {
  const CART_KEY = 'anon_cart_v1';

  // utility
  function qs(selector, root = document) { return root.querySelector(selector); }
  function qsa(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

  // load / save
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
  }
  function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

  // render cart sidebar
  const cartSidebar = document.createElement('aside');
  cartSidebar.className = 'cart-sidebar';
  cartSidebar.innerHTML = `
    <div class="cart-header">
      <h3>Your Cart</h3>
      <button class="cart-close-btn">×</button>
    </div>
    <div class="cart-body"></div>
    <div class="cart-footer">
      <div class="cart-total">Total: $<span class="cart-total-value">0.00</span></div>
      <button class="cart-checkout-btn">Checkout</button>
    </div>
  `;
  document.body.appendChild(cartSidebar);

  const cartBody = qs('.cart-body', cartSidebar);
  const cartTotalValue = qs('.cart-total-value', cartSidebar);
  const cartCloseBtn = qs('.cart-close-btn', cartSidebar);
  const cartCheckoutBtn = qs('.cart-checkout-btn', cartSidebar);

  function formatPrice(n) { return Number(n).toFixed(2); }

  function renderCart() {
    const cart = loadCart();
    cartBody.innerHTML = '';
    if (!cart.length) {
      cartBody.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
      cartTotalValue.textContent = '0.00';
      return;
    }

    cart.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
        <div class="cart-item-body">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-qty">Qty: <input type="number" min="1" value="${item.qty}" data-idx="${idx}" class="cart-qty-input"/></div>
          <div class="cart-item-price">$${formatPrice(item.price)}</div>
        </div>
        <button class="cart-item-remove" data-idx="${idx}">Remove</button>
      `;

      cartBody.appendChild(el);
    });

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    cartTotalValue.textContent = formatPrice(total);

    // attach listeners for qty changes and remove
    qsa('.cart-qty-input', cartBody).forEach(inp => {
      inp.addEventListener('change', function () {
        const idx = Number(this.dataset.idx);
        const val = Math.max(1, Number(this.value) || 1);
        const cart = loadCart();
        if (cart[idx]) { cart[idx].qty = val; saveCart(cart); renderCart(); }
      });
    });

    qsa('.cart-item-remove', cartBody).forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = Number(this.dataset.idx);
        const cart = loadCart();
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
      });
    });
  }

  function openCart() {
    cartSidebar.classList.add('open');
    console.debug('[cart] open');
  }
  function closeCart() { cartSidebar.classList.remove('open'); }

  cartCloseBtn.addEventListener('click', closeCart);
  cartCheckoutBtn.addEventListener('click', function () {
    alert('Checkout clicked — this is a demo.');
  });

  // attach add-to-cart buttons
  function extractProduct(card) {
    const img = qs('.showcase-img', card) || qs('img', card) || {};
    const titleEl = qs('.showcase-title', card) || qs('h3', card) || {};
    const priceEl = qs('.price', card) || qs('.showcase-price', card) || {};
    const price = Number((priceEl.textContent || '0').replace(/[^0-9\.]/g, '')) || 0;
    return {
      title: (titleEl.textContent || titleEl.innerText || 'Product').trim(),
      price: price,
      image: img.src || img.getAttribute && img.getAttribute('src') || '',
    };
  }

  function addToCart(product) {
    const cart = loadCart();
    const existing = cart.find(i => i.title === product.title && i.price === product.price);
    if (existing) { existing.qty += 1; } else { cart.push({ ...product, qty: 1 }); }
    saveCart(cart);
    renderCart();
    openCart();
    console.debug('[cart] added', product);
  }

  document.addEventListener('click', function (e) {
    // delegate add to cart
    if (e.target.closest && e.target.closest('.add-cart-btn')) {
      const btn = e.target.closest('.add-cart-btn');
      const card = btn.closest('.showcase') || btn.closest('.product-card') || btn.closest('.showcase-content');
      const product = extractProduct(card || document);
      addToCart(product);
    }

    // open cart from header bag icon
    if (e.target.closest && e.target.closest('.header-user-actions .action-btn:last-child')) {
      openCart();
    }

    // open cart from any button with class 'open-cart-btn'
    if (e.target.closest && e.target.closest('.open-cart-btn')) {
      openCart();
    }
  });

  // initial render
  renderCart();

  // expose for debugging
  window._anonCart = { loadCart, saveCart, renderCart, openCart, closeCart };
})();
