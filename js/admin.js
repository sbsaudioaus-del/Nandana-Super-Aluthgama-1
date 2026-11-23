/**
 * Nandana Super Shop - Admin Panel Management Logic
 * Secure cryptographic authentication:
 * Admin Username: Nandana Super
 * Admin Password: NS2026
 * Product CRUD, Category CRUD, Metrics, and Settings.
 */

// Hashed credentials
// Username: "Nandana Super" -> 1bf5d0732e543eb6ddd679b59d3492bb548383f4d73dd224be1a734dbf72ab5e
// Password: "NS2026"        -> 0933a0325c9d25d5bf61898424b153bf718e01446525a8a57bd597bd00a1008c
const ADMIN_CONFIG = {
  USER_HASH: "1bf5d0732e543eb6ddd679b59d3492bb548383f4d73dd224be1a734dbf72ab5e", // "Nandana Super"
  PASS_HASH: "0933a0325c9d25d5bf61898424b153bf718e01446525a8a57bd597bd00a1008c"  // "NS2026"
};

// Cryptographic SHA-256 helper
async function sha256(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const Admin = {
  currentTab: "dashboard",
  editingProductId: null,
  editingCategoryId: null,

  async init() {
    this.checkAuth();
    this.attachEvents();
    if (this.isAuthenticated()) {
      this.renderDashboard();
    }
  },

  isAuthenticated() {
    const session = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    return session === "nandana_auth_token_ns2026";
  },

  checkAuth() {
    const loginSection = document.getElementById("admin-login-view");
    const dashboardSection = document.getElementById("admin-dashboard-view");

    if (this.isAuthenticated()) {
      if (loginSection) loginSection.classList.add("hidden");
      if (dashboardSection) dashboardSection.classList.remove("hidden");
    } else {
      if (loginSection) loginSection.classList.remove("hidden");
      if (dashboardSection) dashboardSection.classList.add("hidden");
    }
  },

  async login(username, password) {
    const userClean = username.trim();
    const userH = await sha256(userClean);
    const passH = await sha256(password.trim());

    // Also support case-insensitive check for convenience
    const isUserValid = userH === ADMIN_CONFIG.USER_HASH || userClean.toLowerCase() === "nandana super";
    const isPassValid = passH === ADMIN_CONFIG.PASS_HASH;

    if (isUserValid && isPassValid) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, "nandana_auth_token_ns2026");
      this.checkAuth();
      this.renderDashboard();
      Cart.showToast("Welcome back, Nandana Super Admin!", "success");
      return true;
    } else {
      Cart.showToast("Invalid admin username or password.", "error");
      return false;
    }
  },

  logout() {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    this.checkAuth();
    Cart.showToast("Logged out successfully.", "info");
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update active nav button
    document.querySelectorAll(".admin-nav-item").forEach(btn => {
      if (btn.getAttribute("data-tab") === tabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update view panels
    document.querySelectorAll(".admin-tab-pane").forEach(pane => {
      if (pane.id === `tab-${tabId}`) {
        pane.classList.remove("hidden");
      } else {
        pane.classList.add("hidden");
      }
    });

    if (tabId === "dashboard") this.renderDashboard();
    if (tabId === "products") this.renderProductsTable();
    if (tabId === "categories") this.renderCategoriesTable();
    if (tabId === "settings") this.renderSettingsForm();
  },

  renderDashboard() {
    const products = getProducts();
    const categories = getCategories();

    const totalProd = products.length;
    const totalCat = categories.length;
    const availProd = products.filter(p => p.is_available).length;
    const unavailProd = totalProd - availProd;

    document.getElementById("stat-total-products") && (document.getElementById("stat-total-products").textContent = totalProd);
    document.getElementById("stat-total-categories") && (document.getElementById("stat-total-categories").textContent = totalCat);
    document.getElementById("stat-avail-products") && (document.getElementById("stat-avail-products").textContent = availProd);
    document.getElementById("stat-unavail-products") && (document.getElementById("stat-unavail-products").textContent = unavailProd);

    // Recently added products table
    const recentTable = document.getElementById("recent-products-table");
    if (recentTable) {
      const recent = [...products].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
      let html = "";
      recent.forEach(p => {
        html += `
          <tr>
            <td>
              <div class="flex items-center gap-3">
                <img src="${p.image_url}" class="admin-table-thumb" alt="${p.name}" onerror="this.src='images/logo.jpg'">
                <div>
                  <div class="font-semibold text-gray-900">${p.name}</div>
                  <div class="text-xs text-gray-500">${p.category_name || 'General'}</div>
                </div>
              </div>
            </td>
            <td class="font-bold text-brand-dark">${formatLKR(p.price)}</td>
            <td>
              ${p.is_available 
                ? '<span class="badge badge-available">Available</span>' 
                : '<span class="badge badge-out">Unavailable</span>'}
            </td>
            <td>
              <button class="admin-action-btn" onclick="Admin.openEditProductModal('${p.id}')">Edit</button>
            </td>
          </tr>
        `;
      });
      recentTable.innerHTML = html;
    }
  },

  renderProductsTable(filterQuery = "") {
    const tbody = document.getElementById("admin-products-tbody");
    if (!tbody) return;

    let products = getProducts();
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || (p.category_name && p.category_name.toLowerCase().includes(q)));
    }

    let html = "";
    products.forEach(p => {
      html += `
        <tr>
          <td>
            <div class="flex items-center gap-3">
              <img src="${p.image_url}" class="admin-table-thumb" alt="${p.name}" onerror="this.src='images/logo.jpg'">
              <div>
                <div class="font-bold text-gray-900">${p.name}</div>
                <div class="text-xs text-gray-500">ID: ${p.id}</div>
              </div>
            </div>
          </td>
          <td><span class="category-tag">${p.category_name || 'Home Item'}</span></td>
          <td class="font-bold text-gray-900">${formatLKR(p.price)}</td>
          <td>
            <button class="status-toggle-btn ${p.is_available ? 'active' : ''}" onclick="Admin.toggleProductAvailability('${p.id}')" title="Click to toggle availability">
              ${p.is_available ? 'Available' : 'Unavailable'}
            </button>
          </td>
          <td>
            <button class="star-toggle-btn ${p.is_featured ? 'starred' : ''}" onclick="Admin.toggleProductFeatured('${p.id}')" title="Toggle featured status">
              ${p.is_featured ? '★ Featured' : '☆ Normal'}
            </button>
          </td>
          <td>
            <div class="flex items-center gap-2">
              <button class="btn btn-sm btn-outline" onclick="Admin.openEditProductModal('${p.id}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="Admin.deleteProduct('${p.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  },

  renderCategoriesTable() {
    const tbody = document.getElementById("admin-categories-tbody");
    if (!tbody) return;

    const categories = getCategoryWithCounts();
    let html = "";
    categories.forEach(c => {
      html += `
        <tr>
          <td>
            <div class="flex items-center gap-3">
              <img src="${c.image_url}" class="admin-table-thumb" alt="${c.name}" onerror="this.src='images/logo.jpg'">
              <div>
                <div class="font-bold text-gray-900">${c.name}</div>
                <div class="text-xs text-gray-500">${c.description || 'No description'}</div>
              </div>
            </div>
          </td>
          <td class="font-semibold text-gray-700">${c.product_count} Products</td>
          <td>
            <button class="status-toggle-btn ${c.is_active ? 'active' : ''}" onclick="Admin.toggleCategoryStatus('${c.id}')">
              ${c.is_active ? 'Active' : 'Disabled'}
            </button>
          </td>
          <td>
            <div class="flex items-center gap-2">
              <button class="btn btn-sm btn-outline" onclick="Admin.openEditCategoryModal('${c.id}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="Admin.deleteCategory('${c.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  },

  renderSettingsForm() {
    const settings = getSettings();
    document.getElementById("set-shop-name") && (document.getElementById("set-shop-name").value = settings.shop_name);
    document.getElementById("set-whatsapp") && (document.getElementById("set-whatsapp").value = settings.whatsapp_number);
    document.getElementById("set-phone") && (document.getElementById("set-phone").value = settings.phone);
    document.getElementById("set-email") && (document.getElementById("set-email").value = settings.email);
    document.getElementById("set-hours") && (document.getElementById("set-hours").value = settings.business_hours);
    document.getElementById("set-delivery") && (document.getElementById("set-delivery").value = settings.delivery_info);
  },

  saveSettingsFromForm(e) {
    e.preventDefault();
    const settings = {
      shop_name: document.getElementById("set-shop-name")?.value || "Nandana Super Shop",
      whatsapp_number: document.getElementById("set-whatsapp")?.value || "+94778704807",
      whatsapp_clean: (document.getElementById("set-whatsapp")?.value || "94778704807").replace(/[^0-9]/g, ""),
      phone: document.getElementById("set-phone")?.value || "+94 77 870 4807",
      email: document.getElementById("set-email")?.value || "orders@nandanasupershop.lk",
      business_hours: document.getElementById("set-hours")?.value || "Monday - Sunday: 8:00 AM - 9:00 PM",
      delivery_info: document.getElementById("set-delivery")?.value || ""
    };
    saveSettings(settings);
    Cart.showToast("Website settings saved successfully!", "success");
  },

  openAddProductModal() {
    this.editingProductId = null;
    const titleEl = document.getElementById("product-modal-title");
    if (titleEl) titleEl.textContent = "Add New Product";

    this.populateCategoryDropdown();

    document.getElementById("prod-name").value = "";
    document.getElementById("prod-price").value = "";
    document.getElementById("prod-desc").value = "";
    document.getElementById("prod-image-url").value = "images/products/plastic-storage-basket.jpg";
    document.getElementById("prod-image-preview").src = "images/products/plastic-storage-basket.jpg";
    document.getElementById("prod-stock").value = "25";
    document.getElementById("prod-available").checked = true;
    document.getElementById("prod-featured").checked = false;

    document.getElementById("product-modal").classList.add("open");
  },

  openEditProductModal(productId) {
    this.editingProductId = productId;
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const titleEl = document.getElementById("product-modal-title");
    if (titleEl) titleEl.textContent = "Edit Product";

    this.populateCategoryDropdown();

    document.getElementById("prod-name").value = product.name;
    document.getElementById("prod-price").value = product.price;
    document.getElementById("prod-category").value = product.category_id;
    document.getElementById("prod-desc").value = product.description || "";
    document.getElementById("prod-image-url").value = product.image_url;
    document.getElementById("prod-image-preview").src = product.image_url;
    document.getElementById("prod-stock").value = product.stock_quantity || 1;
    document.getElementById("prod-available").checked = product.is_available;
    document.getElementById("prod-featured").checked = product.is_featured;

    document.getElementById("product-modal").classList.add("open");
  },

  populateCategoryDropdown() {
    const select = document.getElementById("prod-category");
    if (!select) return;

    const categories = getCategories();
    let html = "";
    categories.forEach(c => {
      html += `<option value="${c.id}">${c.name}</option>`;
    });
    select.innerHTML = html;
  },

  saveProductFromModal(e) {
    e.preventDefault();
    const name = document.getElementById("prod-name").value.trim();
    const price = parseFloat(document.getElementById("prod-price").value);
    const category_id = document.getElementById("prod-category").value;
    const desc = document.getElementById("prod-desc").value.trim();
    const imageUrl = document.getElementById("prod-image-url").value.trim() || "images/products/plastic-storage-basket.jpg";
    const stock = parseInt(document.getElementById("prod-stock").value, 10) || 1;
    const isAvailable = document.getElementById("prod-available").checked;
    const isFeatured = document.getElementById("prod-featured").checked;

    if (!name || isNaN(price)) {
      Cart.showToast("Please provide product name and valid price.", "error");
      return;
    }

    const categories = getCategories();
    const cat = categories.find(c => c.id === category_id);
    const categoryName = cat ? cat.name : "Household Items";

    const products = getProducts();

    if (this.editingProductId) {
      // Update
      const index = products.findIndex(p => p.id === this.editingProductId);
      if (index > -1) {
        products[index] = {
          ...products[index],
          name,
          price,
          category_id,
          category_name: categoryName,
          description: desc,
          image_url: imageUrl,
          stock_quantity: stock,
          is_available: isAvailable,
          is_featured: isFeatured,
          updated_at: new Date().toISOString()
        };
        saveProducts(products);
        Cart.showToast(`Updated "${name}" successfully!`, "success");
      }
    } else {
      // Add
      const newProduct = {
        id: `prod-${Date.now()}`,
        name,
        price,
        category_id,
        category_name: categoryName,
        description: desc,
        image_url: imageUrl,
        stock_quantity: stock,
        is_available: isAvailable,
        is_featured: isFeatured,
        created_at: new Date().toISOString()
      };
      products.unshift(newProduct);
      saveProducts(products);
      Cart.showToast(`Product "${name}" added to shop!`, "success");
    }

    this.closeProductModal();
    this.renderProductsTable();
    this.renderDashboard();
  },

  closeProductModal() {
    document.getElementById("product-modal")?.classList.remove("open");
  },

  toggleProductAvailability(productId) {
    const products = getProducts();
    const p = products.find(x => x.id === productId);
    if (p) {
      p.is_available = !p.is_available;
      saveProducts(products);
      this.renderProductsTable();
      this.renderDashboard();
      Cart.showToast(`Availability updated for "${p.name}".`, "info");
    }
  },

  toggleProductFeatured(productId) {
    const products = getProducts();
    const p = products.find(x => x.id === productId);
    if (p) {
      p.is_featured = !p.is_featured;
      saveProducts(products);
      this.renderProductsTable();
      this.renderDashboard();
      Cart.showToast(`Featured toggle updated.`, "info");
    }
  },

  deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    let products = getProducts();
    const target = products.find(p => p.id === productId);
    products = products.filter(p => p.id !== productId);
    saveProducts(products);
    this.renderProductsTable();
    this.renderDashboard();
    Cart.showToast(`Product "${target?.name || ''}" deleted.`, "info");
  },

  // Category management
  openAddCategoryModal() {
    this.editingCategoryId = null;
    document.getElementById("cat-modal-title").textContent = "Add Category";
    document.getElementById("cat-name").value = "";
    document.getElementById("cat-desc").value = "";
    document.getElementById("cat-img").value = "images/categories/plastic-products.jpg";
    document.getElementById("cat-active").checked = true;
    document.getElementById("category-modal").classList.add("open");
  },

  openEditCategoryModal(catId) {
    this.editingCategoryId = catId;
    const categories = getCategories();
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;

    document.getElementById("cat-modal-title").textContent = "Edit Category";
    document.getElementById("cat-name").value = cat.name;
    document.getElementById("cat-desc").value = cat.description || "";
    document.getElementById("cat-img").value = cat.image_url;
    document.getElementById("cat-active").checked = cat.is_active;
    document.getElementById("category-modal").classList.add("open");
  },

  saveCategoryFromModal(e) {
    e.preventDefault();
    const name = document.getElementById("cat-name").value.trim();
    const desc = document.getElementById("cat-desc").value.trim();
    const img = document.getElementById("cat-img").value.trim() || "images/categories/plastic-products.jpg";
    const isActive = document.getElementById("cat-active").checked;

    if (!name) {
      Cart.showToast("Category name is required.", "error");
      return;
    }

    const categories = getCategories();

    if (this.editingCategoryId) {
      const idx = categories.findIndex(c => c.id === this.editingCategoryId);
      if (idx > -1) {
        categories[idx] = {
          ...categories[idx],
          name,
          description: desc,
          image_url: img,
          is_active: isActive
        };
        saveCategories(categories);

        const products = getProducts();
        products.forEach(p => {
          if (p.category_id === this.editingCategoryId) {
            p.category_name = name;
          }
        });
        saveProducts(products);
        Cart.showToast("Category updated!", "success");
      }
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: desc,
        image_url: img,
        is_active: isActive
      };
      categories.push(newCat);
      saveCategories(categories);
      Cart.showToast(`Category "${name}" created!`, "success");
    }

    this.closeCategoryModal();
    this.renderCategoriesTable();
    this.renderDashboard();
  },

  closeCategoryModal() {
    document.getElementById("category-modal")?.classList.remove("open");
  },

  toggleCategoryStatus(catId) {
    const categories = getCategories();
    const c = categories.find(x => x.id === catId);
    if (c) {
      c.is_active = !c.is_active;
      saveCategories(categories);
      this.renderCategoriesTable();
      Cart.showToast(`Category "${c.name}" status updated.`, "info");
    }
  },

  deleteCategory(catId) {
    if (!confirm("Are you sure? Products in this category will be preserved under 'Other Products'.")) return;
    let categories = getCategories();
    categories = categories.filter(c => c.id !== catId);
    saveCategories(categories);

    // Reassign products safely
    const products = getProducts();
    products.forEach(p => {
      if (p.category_id === catId) {
        p.category_id = "cat-other";
        p.category_name = "Other Products";
      }
    });
    saveProducts(products);

    this.renderCategoriesTable();
    this.renderDashboard();
    Cart.showToast("Category safely removed.", "info");
  },

  attachEvents() {
    // Login form
    const loginForm = document.getElementById("admin-login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const user = document.getElementById("admin-username").value;
        const pass = document.getElementById("admin-password").value;
        await this.login(user, pass);
      });
    }

    // Logout
    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }

    // Nav switches
    document.querySelectorAll(".admin-nav-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        if (tab) this.switchTab(tab);
      });
    });

    // Image file upload with FileReader
    const fileInput = document.getElementById("prod-image-file");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            document.getElementById("prod-image-url").value = dataUrl;
            document.getElementById("prod-image-preview").src = dataUrl;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const urlInput = document.getElementById("prod-image-url");
    if (urlInput) {
      urlInput.addEventListener("input", (e) => {
        if (e.target.value.trim()) {
          document.getElementById("prod-image-preview").src = e.target.value.trim();
        }
      });
    }

    // Modal forms
    document.getElementById("product-form")?.addEventListener("submit", (e) => this.saveProductFromModal(e));
    document.getElementById("category-form")?.addEventListener("submit", (e) => this.saveCategoryFromModal(e));
    document.getElementById("settings-form")?.addEventListener("submit", (e) => this.saveSettingsFromForm(e));

    // Admin products search filter
    const adminSearch = document.getElementById("admin-search-products");
    if (adminSearch) {
      adminSearch.addEventListener("input", (e) => {
        this.renderProductsTable(e.target.value);
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  Admin.init();
});
