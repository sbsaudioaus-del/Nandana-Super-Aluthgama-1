/**
 * Nandana Super Shop - Core Data & Persistence Engine
 * Handles products, categories, website settings, and localStorage synchronization.
 * All images are stored locally in the images/ folder.
 */

const STORAGE_KEYS = {
  PRODUCTS: "nandana_products_v2",
  CATEGORIES: "nandana_categories_v2",
  SETTINGS: "nandana_settings_v2",
  CART: "nandana_cart_v2",
  ADMIN_SESSION: "nandana_admin_auth_v2"
};

// Initial Seed Categories using local images
const DEFAULT_CATEGORIES = [
  {
    id: "cat-plastic",
    name: "Plastic Products",
    slug: "plastic-products",
    description: "Durable, high-grade plastic essentials for daily home and kitchen use.",
    image_url: "images/categories/plastic-products.jpg",
    is_active: true
  },
  {
    id: "cat-kitchen",
    name: "Kitchenware",
    slug: "kitchenware",
    description: "Airtight containers, spice carousels, dish racks, and food prep accessories.",
    image_url: "images/categories/kitchenware.jpg",
    is_active: true
  },
  {
    id: "cat-storage",
    name: "Storage & Organizers",
    slug: "storage-organizers",
    description: "Multipurpose baskets, airtight storage boxes, and multi-tier drawers.",
    image_url: "images/categories/storage-organizers.jpg",
    is_active: true
  },
  {
    id: "cat-household",
    name: "Household Items",
    slug: "household-items",
    description: "Essential daily supplies, utility basins, hangers, and home accessories.",
    image_url: "images/categories/household-items.jpg",
    is_active: true
  },
  {
    id: "cat-cleaning",
    name: "Cleaning Products",
    slug: "cleaning-products",
    description: "Pedal dustbins, durable buckets, floor wipers, brooms, and scrubbers.",
    image_url: "images/categories/cleaning-products.jpg",
    is_active: true
  },
  {
    id: "cat-bathroom",
    name: "Bathroom Accessories",
    slug: "bathroom-accessories",
    description: "Anti-slip bathroom stools, corner racks, soap dispensers, and organizers.",
    image_url: "images/categories/bathroom-accessories.jpg",
    is_active: true
  },
  {
    id: "cat-essentials",
    name: "Home Essentials",
    slug: "home-essentials",
    description: "Everyday items designed to make your home organized, fresh, and functional.",
    image_url: "images/categories/home-essentials.jpg",
    is_active: true
  },
  {
    id: "cat-furniture",
    name: "Furniture & Utility",
    slug: "furniture-utility",
    description: "Lightweight and heavy-duty plastic chairs, utility tables, and step stools.",
    image_url: "images/categories/furniture-utility.jpg",
    is_active: true
  },
  {
    id: "cat-kids",
    name: "Kids' Products",
    slug: "kids-products",
    description: "Safe, cheerful plastic study chairs, lunch boxes, and water bottles for kids.",
    image_url: "images/categories/kids-products.jpg",
    is_active: true
  },
  {
    id: "cat-other",
    name: "Other Products",
    slug: "other-products",
    description: "Miscellaneous utility goods, outdoor items, and general hardware essentials.",
    image_url: "images/categories/other-products.jpg",
    is_active: true
  }
];

// Initial Seed Products using local images
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Plastic Storage Basket",
    description: "Heavy-duty woven pattern plastic storage basket ideal for wardrobes, kitchen shelves, bathroom toiletries, and pantry organization. Features ergonomic side carry handles.",
    price: 1250,
    category_id: "cat-plastic",
    category_name: "Plastic Products",
    image_url: "images/products/plastic-storage-basket.jpg",
    stock_quantity: 45,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: "prod-2",
    name: "Kitchen Container Set (3-Piece Airtight)",
    description: "Clear food-grade airtight modular container set with silicone sealing rings. Perfect for keeping rice, flour, pulses, and dry spices completely moisture-free.",
    price: 2850,
    category_id: "cat-kitchen",
    category_name: "Kitchenware",
    image_url: "images/products/kitchen-container-set.jpg",
    stock_quantity: 30,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
  },
  {
    id: "prod-3",
    name: "Multi-Purpose Laundry Basket with Lid",
    description: "Spacious ventilated laundry hamper crafted from durable virgin plastic. Includes breathable ventilation slots and dual reinforced carry handles.",
    price: 2450,
    category_id: "cat-storage",
    category_name: "Storage & Organizers",
    image_url: "images/products/laundry-basket.jpg",
    stock_quantity: 25,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: "prod-4",
    name: "4-Tier Plastic Storage Drawer Organizer",
    description: "Versatile 4-level rolling drawer cabinet designed for clothing, documents, baby essentials, and household clutter. Smooth glide pull-out drawers with lock stoppers.",
    price: 6900,
    category_id: "cat-storage",
    category_name: "Storage & Organizers",
    image_url: "images/products/storage-drawer-cabinet.jpg",
    stock_quantity: 12,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString()
  },
  {
    id: "prod-5",
    name: "Modern Plastic Armchair - High Comfort",
    description: "Ergonomically contoured heavy-duty plastic armchair. Weather-resistant, UV-protected, and stackable. Suitable for dining, veranda, living room, and commercial setups.",
    price: 3850,
    category_id: "cat-furniture",
    category_name: "Furniture & Utility",
    image_url: "images/products/plastic-armchair.jpg",
    stock_quantity: 40,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: "prod-6",
    name: "Heavy-Duty Pedal Dustbin 20L",
    description: "Hands-free foot pedal garbage bin with tight-fitting odor lock lid and removable inner plastic bucket with handle. Ideal for kitchens, offices, and bathrooms.",
    price: 2150,
    category_id: "cat-cleaning",
    category_name: "Cleaning Products",
    image_url: "images/products/pedal-dustbin.jpg",
    stock_quantity: 28,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
  },
  {
    id: "prod-7",
    name: "Bathroom Corner Rack & Caddy Organizer",
    description: "Rust-proof, water-drainable multi-shelf plastic corner rack. Perfect for organizing shampoos, bath soaps, scrubs, and bathroom cleaners neatly.",
    price: 1650,
    category_id: "cat-bathroom",
    category_name: "Bathroom Accessories",
    image_url: "images/products/bathroom-corner-rack.jpg",
    stock_quantity: 35,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    id: "prod-8",
    name: "Insulated Food Casserole Hot Pot 3500ml",
    description: "Double-walled polyurethane insulated hot pot with food-grade stainless steel interior and stylish green exterior. Keeps curries and rice hot for over 6 hours.",
    price: 3400,
    category_id: "cat-kitchen",
    category_name: "Kitchenware",
    image_url: "images/products/insulated-hot-pot.jpg",
    stock_quantity: 20,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: "prod-9",
    name: "Heavy-Duty Utility Bucket 15L with Grip",
    description: "Premium reinforced plastic utility bucket with measuring calibrations, pouring spout, and heavy steel handle with ergonomic comfort grip.",
    price: 850,
    category_id: "cat-household",
    category_name: "Household Items",
    image_url: "images/products/utility-bucket.jpg",
    stock_quantity: 60,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: "prod-10",
    name: "Kitchen Dish Drainer Rack with Drip Tray",
    description: "Compact kitchen countertop dish drying rack with removable utensil caddy and swivel draining spout. Hygienic, easy to wash, and anti-bacterial plastic.",
    price: 2750,
    category_id: "cat-kitchen",
    category_name: "Kitchenware",
    image_url: "images/products/dish-drainer-rack.jpg",
    stock_quantity: 18,
    is_available: true,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: "prod-11",
    name: "Kids Multi-Color Sturdy Study Chair",
    description: "Vibrant, rounded-edge plastic chair tailored for young kids. Sturdy non-topple legs, smooth washable surface, and tested safe for toddlers and children.",
    price: 1850,
    category_id: "cat-kids",
    category_name: "Kids' Products",
    image_url: "images/products/kids-study-chair.jpg",
    stock_quantity: 22,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: "prod-12",
    name: "Foldable Plastic Utility & Dining Table",
    description: "Heavy-duty folding table with rust-proof powder-coated metal frame and high-density polyethylene tabletop. Great for family dinners, outdoor setups, and shops.",
    price: 8500,
    category_id: "cat-furniture",
    category_name: "Furniture & Utility",
    image_url: "images/products/foldable-table.jpg",
    stock_quantity: 10,
    is_available: true,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: "prod-13",
    name: "Rice & Grain Storage Dispenser Box 10kg",
    description: "Moisture-resistant 10kg cereal and grain dispenser box with one-touch measuring cup drawer and airtight silicone gasket lid.",
    price: 3600,
    category_id: "cat-storage",
    category_name: "Storage & Organizers",
    image_url: "images/products/grain-dispenser-box.jpg",
    stock_quantity: 15,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: "prod-14",
    name: "Non-Slip Heavy-Duty Bathroom Stool",
    description: "Reinforced stepping and sitting stool equipped with rubberized non-slip feet and textured top surface. Supports weights up to 130kg securely.",
    price: 1150,
    category_id: "cat-bathroom",
    category_name: "Bathroom Accessories",
    image_url: "images/products/bathroom-stool.jpg",
    stock_quantity: 32,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: "prod-15",
    name: "Pack of 12 Premium Plastic Clothes Hangers",
    description: "Sleek, heavy-duty contoured coat and shirt hangers with anti-slip shoulder notches and integrated tie/belt hooks.",
    price: 990,
    category_id: "cat-household",
    category_name: "Household Items",
    image_url: "images/products/clothes-hangers.jpg",
    stock_quantity: 50,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: "prod-16",
    name: "Airtight Revolving Spice Carousel (16 Jars)",
    description: "360-degree rotating spice organizer with 16 crystal-clear plastic condiment containers. Includes dual-sift shake and pour tops.",
    price: 4200,
    category_id: "cat-kitchen",
    category_name: "Kitchenware",
    image_url: "images/products/spice-carousel.jpg",
    stock_quantity: 14,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString()
  }
];

// Initial Website Settings
const DEFAULT_SETTINGS = {
  shop_name: "Nandana Super Shop",
  whatsapp_number: "+94778704807",
  whatsapp_clean: "94778704807",
  phone: "+94 77 870 4807",
  email: "orders@nandanasupershop.lk",
  address: "Islandwide Delivery Service, Sri Lanka",
  delivery_info: "Nandana Super Shop delivers household essentials, plastic products and home items across Sri Lanka. Delivery charges can be confirmed through WhatsApp.",
  business_hours: "Monday - Sunday: 8:00 AM - 9:00 PM"
};

// Data Store Accessors
function getCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_CATEGORIES;
  }
}

function saveCategories(categories) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event("nandana_categories_updated"));
  } catch (e) {
    console.error("Failed to save categories:", e);
  }
}

function getProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
}

function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event("nandana_products_updated"));
  } catch (e) {
    console.error("Failed to save products:", e);
  }
}

function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event("nandana_settings_updated"));
  } catch (e) {
    console.error("Failed to save settings:", e);
  }
}

// Helpers
function formatLKR(amount) {
  const num = Number(amount) || 0;
  return `LKR ${num.toLocaleString("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

function getCategoryWithCounts() {
  const categories = getCategories();
  const products = getProducts();
  return categories.map(cat => {
    const count = products.filter(p => p.category_id === cat.id).length;
    return { ...cat, product_count: count };
  });
}
