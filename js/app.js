/**
 * Nandana Super Shop - Main Application Logic
 * UI Interactions, Product Grids, Categories, Filtering, Search, Quick View, and WhatsApp Forms
 */

const App = {
  activeCategory: "all",
  searchQuery: "",
  sortBy: "newest",
  onlyAvailable: false,

  init() {
    this.setupNavbar();
    this.renderCategoriesSection();
    this.renderProductsSection();
    this.setupFiltersAndSearch();
    this.setupQuickView();
    this.setupContactForm();
    this.setupBackgroundParallax();

    // Listen for data updates (from admin panel in another tab or same window)
    window.addEventListener("nandana_products_updated", () => {
      this.renderProductsSection();
      this.renderCategoriesSection();
    });

    window.addEventListener("nandana_categories_updated", () => {
      this.renderCategoriesSection();
      this.renderProductsSection();
    });
  },

  setupNavbar() {
    const navbar = document.getElementById("main-header");
    const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const searchForm = document.getElementById("nav-search-form");
    const searchInput = document.getElementById("nav-search-input");
    const mobileSearchForm = document.getElementById("mobile-search-form");
    const mobileSearchInput = document.getElementById("mobile-search-input");

    // Sticky shadow
    window.addEventListener("scroll", () => {
      if (window.scrollY > 25) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    });

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
        const isOpen = mobileMenu.classList.contains("open");
        mobileMenuBtn.innerHTML = isOpen
          ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
          : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    }

    // Handle Search from Navbar
    const handleSearch = (query) => {
      if (!query.trim()) return;
      if (window.location.pathname.includes("shop.html")) {
        this.searchQuery = query.trim();
        this.renderProductsSection();
        const searchInputEl = document.getElementById("shop-search-input");
        if (searchInputEl) searchInputEl.value = this.searchQuery;
      } else {
        window.location.href = `shop.html?search=${encodeURIComponent(query.trim())}`;
      }
    };

    if (searchForm && searchInput) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSearch(searchInput.value);
      });
    }

    if (mobileSearchForm && mobileSearchInput) {
      mobileSearchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSearch(mobileSearchInput.value);
      });
    }

    // Check URL parameters (e.g. ?category=cat-plastic or ?search=basket)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get("category");
    const searchParam = urlParams.get("search");

    if (catParam) {
      this.activeCategory = catParam;
    }
    if (searchParam) {
      this.searchQuery = searchParam;
      const shopInput = document.getElementById("shop-search-input");
      if (shopInput) shopInput.value = searchParam;
    }
  },

  renderCategoriesSection() {
    const container = document.getElementById("categories-grid");
    if (!container) return;

    const categories = getCategoryWithCounts().filter(c => c.is_active);

    let html = "";
    categories.forEach(cat => {
      const isSelected = this.activeCategory === cat.id;
      html += `
        <div class="category-card ${isSelected ? 'active' : ''}" onclick="App.selectCategory('${cat.id}')">
          <div class="category-img-wrapper">
            <img src="${cat.image_url}" alt="${cat.name}" class="category-img" loading="lazy" onerror="this.src='images/logo.jpg'">
            <span class="category-badge">${cat.product_count} ${cat.product_count === 1 ? 'Product' : 'Products'}</span>
          </div>
          <div class="category-content">
            <h3 class="category-title">${cat.name}</h3>
            <p class="category-desc">${cat.description}</p>
            <button type="button" class="category-btn">
              <span>Shop Category</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Also update filter tabs if on Shop page or Home page tab bar
    this.renderCategoryFilterTabs();
  },

  renderCategoryFilterTabs() {
    const tabContainer = document.getElementById("category-filter-tabs");
    if (!tabContainer) return;

    const categories = getCategories().filter(c => c.is_active);
    let html = `
      <button type="button" class="filter-tab ${this.activeCategory === 'all' ? 'active' : ''}" onclick="App.selectCategory('all')">
        All Products
      </button>
    `;

    categories.forEach(cat => {
      const isSelected = this.activeCategory === cat.id;
      html += `
        <button type="button" class="filter-tab ${isSelected ? 'active' : ''}" onclick="App.selectCategory('${cat.id}')">
          ${cat.name}
        </button>
      `;
    });

    tabContainer.innerHTML = html;
  },

  selectCategory(categoryId) {
    this.activeCategory = categoryId;
    this.renderCategoryFilterTabs();
    this.renderProductsSection();

    // If on homepage, smooth scroll to product section
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Update active class on category cards
    document.querySelectorAll(".category-card").forEach(card => {
      card.classList.remove("active");
    });
  },

  renderProductsSection() {
    const grid = document.getElementById("products-grid");
    const countDisplay = document.getElementById("products-count-display");
    const emptyState = document.getElementById("products-empty");

    if (!grid) return;

    let products = getProducts();

    // 1. Filter by category
    if (this.activeCategory && this.activeCategory !== "all") {
      products = products.filter(p => p.category_id === this.activeCategory);
    }

    // 2. Filter by search query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category_name && p.category_name.toLowerCase().includes(q))
      );
    }

    // 3. Filter by availability
    if (this.onlyAvailable) {
      products = products.filter(p => p.is_available);
    }

    // 4. Sort
    if (this.sortBy === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else {
      // Newest
      products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    if (countDisplay) {
      countDisplay.textContent = `Showing ${products.length} ${products.length === 1 ? 'Product' : 'Products'}`;
    }

    if (products.length === 0) {
      grid.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    let cardsHtml = "";
    products.forEach(product => {
      cardsHtml += `
        <div class="product-card ${!product.is_available ? 'unavailable' : ''}">
          <div class="product-img-wrapper">
            <img src="${product.image_url}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='images/logo.jpg'">
            <div class="product-badges">
              ${product.is_featured ? '<span class="badge badge-featured">Featured</span>' : ''}
              ${product.is_available
                ? '<span class="badge badge-available">In Stock</span>'
                : '<span class="badge badge-out">Unavailable</span>'}
            </div>
            <button type="button" class="quick-view-btn" onclick="App.openQuickView('${product.id}')" title="Quick View">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>Quick View</span>
            </button>
          </div>

          <div class="product-body">
            <span class="product-category">${product.category_name || 'Home Essential'}</span>
            <h3 class="product-title" title="${product.name}">${product.name}</h3>
            ${product.description ? `<p class="product-desc-snippet">${product.description}</p>` : ''}
            
            <div class="product-pricing">
              <span class="product-price">${formatLKR(product.price)}</span>
            </div>

            <div class="product-card-actions">
              ${product.is_available ? `
                <button type="button" class="btn btn-add-cart" onclick="Cart.addItem('${product.id}', 1)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <span>Add to Cart</span>
                </button>
              ` : `
                <button type="button" class="btn btn-disabled" disabled>
                  <span>Out of Stock</span>
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    });

    grid.innerHTML = cardsHtml;
  },

  setupFiltersAndSearch() {
    const searchInput = document.getElementById("shop-search-input");
    const sortSelect = document.getElementById("shop-sort-select");
    const availableCheckbox = document.getElementById("filter-available-only");
    const resetFiltersBtn = document.getElementById("reset-filters-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.renderProductsSection();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.renderProductsSection();
      });
    }

    if (availableCheckbox) {
      availableCheckbox.addEventListener("change", (e) => {
        this.onlyAvailable = e.target.checked;
        this.renderProductsSection();
      });
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", () => {
        this.activeCategory = "all";
        this.searchQuery = "";
        this.sortBy = "newest";
        this.onlyAvailable = false;
        if (searchInput) searchInput.value = "";
        if (sortSelect) sortSelect.value = "newest";
        if (availableCheckbox) availableCheckbox.checked = false;
        this.renderCategoryFilterTabs();
        this.renderProductsSection();
      });
    }
  },

  setupQuickView() {
    const modal = document.getElementById("quick-view-modal");
    const closeBtn = document.getElementById("close-quick-view");
    const overlay = document.getElementById("quick-view-overlay");

    if (closeBtn) closeBtn.addEventListener("click", () => this.closeQuickView());
    if (overlay) overlay.addEventListener("click", () => this.closeQuickView());
  },

  openQuickView(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("quick-view-modal");
    const content = document.getElementById("quick-view-content");
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="quick-view-grid">
        <div class="quick-view-image-col">
          <img src="${product.image_url}" alt="${product.name}" class="quick-view-img" onerror="this.src='images/logo.jpg'">
        </div>
        <div class="quick-view-details-col">
          <span class="quick-view-cat">${product.category_name || 'Home Essential'}</span>
          <h2 class="quick-view-title">${product.name}</h2>
          <div class="quick-view-price">${formatLKR(product.price)}</div>
          
          <div class="quick-view-status">
            ${product.is_available 
              ? '<span class="status-badge available">● In Stock & Ready for Delivery</span>' 
              : '<span class="status-badge out">● Currently Unavailable</span>'}
          </div>

          <div class="quick-view-desc">
            <p>${product.description || 'Quality household plastic product designed for daily convenience, reliability, and long life.'}</p>
          </div>

          <div class="quick-view-highlights">
            <div class="highlight-item">✓ Islandwide delivery across Sri Lanka</div>
            <div class="highlight-item">✓ 100% Quality inspected plastic</div>
            <div class="highlight-item">✓ WhatsApp direct support & checkout</div>
          </div>

          <div class="quick-view-action-row">
            ${product.is_available ? `
              <div class="qty-control">
                <button type="button" class="qty-btn" id="qv-minus">-</button>
                <input type="number" id="qv-qty-input" value="1" min="1" max="99" class="qty-input">
                <button type="button" class="qty-btn" id="qv-plus">+</button>
              </div>
              <button type="button" class="btn btn-primary flex-1" id="qv-add-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <span>Add to Cart</span>
              </button>
            ` : `
              <button type="button" class="btn btn-disabled w-full" disabled>Item Unavailable</button>
            `}
          </div>
        </div>
      </div>
    `;

    // Attach qty handlers inside quick view
    if (product.is_available) {
      const minus = document.getElementById("qv-minus");
      const plus = document.getElementById("qv-plus");
      const input = document.getElementById("qv-qty-input");
      const addBtn = document.getElementById("qv-add-btn");

      minus?.addEventListener("click", () => {
        let val = parseInt(input.value, 10) || 1;
        if (val > 1) input.value = val - 1;
      });

      plus?.addEventListener("click", () => {
        let val = parseInt(input.value, 10) || 1;
        input.value = val + 1;
      });

      addBtn?.addEventListener("click", () => {
        const qty = parseInt(input.value, 10) || 1;
        Cart.addItem(product.id, qty);
        this.closeQuickView();
      });
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  },

  closeQuickView() {
    const modal = document.getElementById("quick-view-modal");
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  },

  setupContactForm() {
    const form = document.getElementById("whatsapp-contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = document.getElementById("contact-name")?.value || "";
      const phone = document.getElementById("contact-phone")?.value || "";
      const email = document.getElementById("contact-email")?.value || "";
      const subject = document.getElementById("contact-subject")?.value || "General Inquiry";
      const message = document.getElementById("contact-message")?.value || "";

      if (!fullName || !phone || !message) {
        Cart.showToast("Please fill in all required fields.", "error");
        return;
      }

      const settings = getSettings();
      const cleanNumber = settings.whatsapp_clean || "94778704807";

      const formatted = `Hello Nandana Super Shop!\n\nI would like to make an inquiry.\n\nName: ${fullName}\nPhone: ${phone}\n${email ? `Email: ${email}\n` : ''}Subject: ${subject}\n\nMessage:\n${message}\n\nPlease confirm availability and delivery details.`;

      const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(formatted)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      form.reset();
      Cart.showToast("Opening WhatsApp with your inquiry message...", "success");
    });
  },

  setupBackgroundParallax() {
    // Subtle float parallax on decorative household items during scroll
    const items = document.querySelectorAll(".bg-deco-item");
    if (items.length === 0) return;

    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      items.forEach((item, index) => {
        const speed = (index % 3 + 1) * 0.05;
        item.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
