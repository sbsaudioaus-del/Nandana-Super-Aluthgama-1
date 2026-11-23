/**
 * Nandana Super Shop - Shopping Cart & WhatsApp Order Engine
 */

const Cart = {
  items: [],

  init() {
    this.load();
    this.updateUI();
    this.attachEvents();
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CART);
      this.items = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this.items = [];
    }
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.items));
      this.updateUI();
      window.dispatchEvent(new Event("nandana_cart_updated"));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  },

  addItem(productId, quantity = 1) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
      this.showToast("Product not found!", "error");
      return;
    }

    if (!product.is_available) {
      this.showToast("Sorry, this product is currently unavailable.", "error");
      return;
    }

    const existingIndex = this.items.findIndex(item => item.product.id === productId);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += Number(quantity);
    } else {
      this.items.push({
        product: product,
        quantity: Number(quantity)
      });
    }

    this.save();
    this.showToast(`Added "${product.name}" to cart!`, "success");
    this.openDrawer();
  },

  updateQuantity(productId, quantity) {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      this.removeItem(productId);
      return;
    }

    const item = this.items.find(i => i.product.id === productId);
    if (item) {
      item.quantity = qty;
      this.save();
    }
  },

  removeItem(productId) {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.save();
    this.showToast("Item removed from cart.", "info");
  },

  clear() {
    this.items = [];
    this.save();
  },

  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  },

  getGrandTotal() {
    return this.getSubtotal();
  },

  generateWhatsAppUrl() {
    if (this.items.length === 0) return null;

    const settings = getSettings();
    const cleanNumber = settings.whatsapp_clean || "94778704807";

    const itemLines = this.items.map((item, index) => {
      const itemTotal = item.product.price * item.quantity;
      return `${index + 1}. ${item.product.name}\n   Price: ${formatLKR(item.product.price)}\n   Quantity: ${item.quantity}\n   Total: ${formatLKR(itemTotal)}`;
    }).join("\n\n");

    const message = `Hello Nandana Super Shop!\n\nI would like to place an order.\n\nOrder Details:\n${itemLines}\n\n---\nTotal Items: ${this.getTotalItems()}\nGrand Total: ${formatLKR(this.getGrandTotal())}\n\nPlease confirm my order and delivery details.`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  },

  proceedToWhatsApp() {
    if (this.items.length === 0) {
      this.showToast("Your cart is empty. Please add items first!", "error");
      return;
    }

    const url = this.generateWhatsAppUrl();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  },

  updateUI() {
    // 1. Update all cart count badges in header / mobile
    const totalCount = this.getTotalItems();
    const badges = document.querySelectorAll(".cart-count-badge");
    badges.forEach(badge => {
      badge.textContent = totalCount;
      if (totalCount > 0) {
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    });

    // 2. Update Cart Drawer if present
    this.renderDrawer();

    // 3. Update Cart Page table if present
    this.renderCartPage();
  },

  renderDrawer() {
    const drawerContainer = document.getElementById("cart-drawer-items");
    const drawerSubtotal = document.getElementById("cart-drawer-subtotal");
    const drawerCount = document.getElementById("cart-drawer-count");
    const drawerEmptyMsg = document.getElementById("cart-drawer-empty");
    const drawerFooter = document.getElementById("cart-drawer-footer");

    if (!drawerContainer) return;

    if (this.items.length === 0) {
      drawerContainer.innerHTML = "";
      if (drawerEmptyMsg) drawerEmptyMsg.classList.remove("hidden");
      if (drawerFooter) drawerFooter.classList.add("hidden");
      if (drawerCount) drawerCount.textContent = "0 items";
      return;
    }

    if (drawerEmptyMsg) drawerEmptyMsg.classList.add("hidden");
    if (drawerFooter) drawerFooter.classList.remove("hidden");
    if (drawerCount) drawerCount.textContent = `${this.getTotalItems()} items`;
    if (drawerSubtotal) drawerSubtotal.textContent = formatLKR(this.getSubtotal());

    let html = "";
    this.items.forEach(item => {
      const itemTotal = item.product.price * item.quantity;
      html += `
        <div class="cart-drawer-item">
          <img src="${item.product.image_url}" alt="${item.product.name}" class="cart-item-img" onerror="this.src='images/logo.jpg'">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.product.name}</h4>
            <div class="cart-item-price">${formatLKR(item.product.price)}</div>
            <div class="cart-item-actions">
              <div class="qty-control">
                <button type="button" class="qty-btn" onclick="Cart.updateQuantity('${item.product.id}', ${item.quantity - 1})">-</button>
                <span class="qty-display">${item.quantity}</span>
                <button type="button" class="qty-btn" onclick="Cart.updateQuantity('${item.product.id}', ${item.quantity + 1})">+</button>
              </div>
              <span class="cart-item-total">${formatLKR(itemTotal)}</span>
              <button type="button" class="remove-btn" onclick="Cart.removeItem('${item.product.id}')" title="Remove item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    drawerContainer.innerHTML = html;
  },

  renderCartPage() {
    const tableBody = document.getElementById("cart-page-items");
    const summarySubtotal = document.getElementById("cart-page-subtotal");
    const summaryGrandTotal = document.getElementById("cart-page-grandtotal");
    const summaryTotalItems = document.getElementById("cart-page-totalitems");
    const emptyContainer = document.getElementById("cart-page-empty");
    const contentContainer = document.getElementById("cart-page-content");

    if (!tableBody) return;

    if (this.items.length === 0) {
      if (emptyContainer) emptyContainer.classList.remove("hidden");
      if (contentContainer) contentContainer.classList.add("hidden");
      return;
    }

    if (emptyContainer) emptyContainer.classList.add("hidden");
    if (contentContainer) contentContainer.classList.remove("hidden");

    let rowsHtml = "";
    this.items.forEach(item => {
      const itemTotal = item.product.price * item.quantity;
      rowsHtml += `
        <tr>
          <td>
            <div class="table-product-cell">
              <img src="${item.product.image_url}" alt="${item.product.name}" class="table-product-img" onerror="this.src='images/logo.jpg'">
              <div>
                <a href="shop.html?category=${item.product.category_id}" class="table-product-cat">${item.product.category_name || 'Home Item'}</a>
                <h4 class="table-product-name">${item.product.name}</h4>
              </div>
            </div>
          </td>
          <td class="text-right font-medium">${formatLKR(item.product.price)}</td>
          <td>
            <div class="qty-control mx-auto">
              <button type="button" class="qty-btn" onclick="Cart.updateQuantity('${item.product.id}', ${item.quantity - 1})">-</button>
              <span class="qty-display">${item.quantity}</span>
              <button type="button" class="qty-btn" onclick="Cart.updateQuantity('${item.product.id}', ${item.quantity + 1})">+</button>
            </div>
          </td>
          <td class="text-right font-bold text-brand-dark">${formatLKR(itemTotal)}</td>
          <td class="text-center">
            <button type="button" class="remove-btn" onclick="Cart.removeItem('${item.product.id}')" title="Remove">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = rowsHtml;

    if (summarySubtotal) summarySubtotal.textContent = formatLKR(this.getSubtotal());
    if (summaryGrandTotal) summaryGrandTotal.textContent = formatLKR(this.getGrandTotal());
    if (summaryTotalItems) summaryTotalItems.textContent = this.getTotalItems();
  },

  openDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (drawer && overlay) {
      drawer.classList.add("open");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  },

  closeDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (drawer && overlay) {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }
  },

  showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        ${type === 'success' ? '✓' : type === 'error' ? '!' : 'ℹ'}
      </div>
      <div class="toast-msg">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  attachEvents() {
    // Open cart drawer triggers
    document.querySelectorAll(".open-cart-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close cart drawer triggers
    const closeBtn = document.getElementById("close-cart-btn");
    const overlay = document.getElementById("cart-overlay");
    if (closeBtn) closeBtn.addEventListener("click", () => this.closeDrawer());
    if (overlay) overlay.addEventListener("click", () => this.closeDrawer());

    // Proceed to WhatsApp buttons
    document.querySelectorAll(".proceed-whatsapp-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.proceedToWhatsApp();
      });
    });

    // Clear cart button
    const clearBtn = document.getElementById("clear-cart-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your cart?")) {
          this.clear();
        }
      });
    }
  }
};

// Initialize Cart when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  Cart.init();
});
