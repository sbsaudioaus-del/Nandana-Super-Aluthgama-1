import fs from "fs";
import path from "path";
import { Product, Category, WebsiteSettings } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

// Ensure data directory exists
function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initial seed categories
const SEED_CATEGORIES: Category[] = [
  {
    id: "cat-plastic",
    name: "Plastic Products",
    slug: "plastic-products",
    description: "Durable, high-grade plastic essentials for daily home and kitchen use.",
    image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-kitchen",
    name: "Kitchenware",
    slug: "kitchenware",
    description: "Functional cookware, food prep containers, spice jars, and kitchen accessories.",
    image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-storage",
    name: "Storage & Organizers",
    slug: "storage-organizers",
    description: "Multipurpose baskets, airtight storage boxes, and multi-tier drawers.",
    image_url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-household",
    name: "Household Items",
    slug: "household-items",
    description: "Essential daily supplies, utility basins, hangers, and home accessories.",
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-cleaning",
    name: "Cleaning Products",
    slug: "cleaning-products",
    description: "Pedal dustbins, durable buckets, floor wipers, brooms, and scrubbers.",
    image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-bathroom",
    name: "Bathroom Accessories",
    slug: "bathroom-accessories",
    description: "Anti-slip bathroom stools, corner racks, soap dispensers, and organizers.",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-essentials",
    name: "Home Essentials",
    slug: "home-essentials",
    description: "Everyday items designed to make your home organized, fresh, and functional.",
    image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-furniture",
    name: "Furniture & Utility",
    slug: "furniture-utility",
    description: "Lightweight and heavy-duty plastic chairs, utility tables, and step stools.",
    image_url: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-kids",
    name: "Kids' Products",
    slug: "kids-products",
    description: "Safe, cheerful plastic study chairs, lunch boxes, and water bottles for kids.",
    image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-other",
    name: "Other Products",
    slug: "other-products",
    description: "Miscellaneous utility goods, outdoor items, and general hardware essentials.",
    image_url: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=800&q=80",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Initial seed products
const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Plastic Storage Basket",
    description: "Heavy-duty woven pattern plastic storage basket ideal for wardrobes, kitchen shelves, bathroom toiletries, and pantry organization. Features ergonomic side carry handles.",
    price: 1250,
    category_id: "cat-plastic",
    category_name: "Plastic Products",
    image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 45,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Kitchen Container Set (3-Piece Airtight)",
    description: "Clear food-grade airtight modular container set with silicone sealing rings. Perfect for keeping rice, flour, pulses, and dry spices completely moisture-free.",
    price: 2850,
    category_id: "cat-kitchen",
    category_name: "Kitchenware",
    image_url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 30,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Multi-Purpose Laundry Basket with Lid",
    description: "Spacious ventilated laundry hamper crafted from durable virgin plastic. Includes breathable ventilation slots and dual reinforced carry handles.",
    price: 2450,
    category_id: "cat-storage",
    category_name: "Storage & Organizers",
    image_url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 25,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "4-Tier Plastic Storage Drawer Organizer",
    description: "Versatile 4-level rolling drawer cabinet designed for clothing, documents, baby essentials, and household clutter. Smooth glide pull-out drawers with lock stoppers.",
    price: 6900,
    category_id: "cat-storage",
    category_name: "Storage & Organizers",
    image_url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 12,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-5",
    name: "Modern Plastic Armchair - High Comfort",
    description: "Ergonomically contoured heavy-duty plastic armchair. Weather-resistant, UV-protected, and stackable. Suitable for dining, veranda, living room, and commercial setups.",
    price: 3850,
    category_id: "cat-furniture",
    category_name: "Furniture & Utility",
    image_url: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 40,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-6",
    name: "Heavy-Duty Pedal Dustbin 20L",
    description: "Hands-free foot pedal garbage bin with tight-fitting odor lock lid and removable inner plastic bucket with handle. Ideal for kitchens, offices, and bathrooms.",
    price: 2150,
    category_id: "cat-cleaning",
    category_name: "Cleaning Products",
    image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 28,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-7",
    name: "Bathroom Corner Rack & Caddy Organizer",
    description: "Rust-proof, water-drainable multi-shelf plastic corner rack. Perfect for organizing shampoos, bath soaps, scrubs, and bathroom cleaners neatly.",
    price: 1650,
    category_id: "cat-bathroom",
    category_name: "Bathroom Accessories",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 35,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-8",
    name: "Insulated Food Casserole Hot Pot 3500ml",
    description: "Double-walled polyurethane insulated hot pot with food-grade stainless steel interior and stylish green exterior. Keeps curries and rice hot for over 6 hours.",
    price: 3400,
    category_id: "cat-kitchen",
    category_name: "Kitchenware",
    image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 20,
    is_available: true,
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-9",
    name: "Heavy-Duty Utility Bucket 15L with Grip",
    description: "Premium reinforced plastic utility bucket with measuring calibrations, pouring spout, and heavy steel handle with ergonomic comfort grip.",
    price: 850,
    category_id: "cat-household",
    category_name: "Household Items",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 60,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-10",
    name: "Kitchen Dish Drainer Rack with Drip Tray",
    description: "Compact kitchen countertop dish drying rack with removable utensil caddy and swivel draining spout. Hygienic, easy to wash, and anti-bacterial plastic.",
    price: 2750,
    category_id: "cat-kitchen",
    category_name: "Kitchenware",
    image_url: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 18,
    is_available: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-11",
    name: "Kids Multi-Color Sturdy Study Chair",
    description: "Vibrant, rounded-edge plastic chair tailored for young kids. Sturdy non-topple legs, smooth washable surface, and tested safe for toddlers and children.",
    price: 1850,
    category_id: "cat-kids",
    category_name: "Kids' Products",
    image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 22,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-12",
    name: "Foldable Plastic Utility & Dining Table",
    description: "Heavy-duty folding table with rust-proof powder-coated metal frame and high-density polyethylene tabletop. Great for family dinners, outdoor setups, and shops.",
    price: 8500,
    category_id: "cat-furniture",
    category_name: "Furniture & Utility",
    image_url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 10,
    is_available: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-13",
    name: "Rice & Grain Storage Dispenser Box 10kg",
    description: "Moisture-resistant 10kg cereal and grain dispenser box with one-touch measuring cup drawer and airtight silicone gasket lid.",
    price: 3600,
    category_id: "cat-storage",
    category_name: "Storage & Organizers",
    image_url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 15,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-14",
    name: "Non-Slip Heavy-Duty Bathroom Stool",
    description: "Reinforced stepping and sitting stool equipped with rubberized non-slip feet and textured top surface. Supports weights up to 130kg securely.",
    price: 1150,
    category_id: "cat-bathroom",
    category_name: "Bathroom Accessories",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 32,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-15",
    name: "Pack of 12 Premium Plastic Clothes Hangers",
    description: "Sleek, heavy-duty contoured coat and shirt hangers with anti-slip shoulder notches and integrated tie/belt hooks.",
    price: 990,
    category_id: "cat-household",
    category_name: "Household Items",
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 50,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-16",
    name: "Airtight Revolving Spice Carousel (16 Jars)",
    description: "360-degree rotating spice organizer with 16 crystal-clear plastic condiment containers. Includes dual-sift shake and pour tops.",
    price: 4200,
    category_id: "cat-kitchen",
    category_name: "Kitchenware",
    image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    stock_quantity: 14,
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Initial website settings
const SEED_SETTINGS: WebsiteSettings = {
  shop_name: "Nandana Super Shop",
  tagline: "Everything Your Home Needs, All in One Place.",
  whatsapp_number: "94778704807",
  whatsapp_display: "+94778704807",
  phone: "+94 77 870 4807",
  email: "orders@nandanasupershop.lk",
  address: "Islandwide Delivery Service, Sri Lanka",
  delivery_info: "We safely deliver plastic products, household essentials, and kitchenware directly to your doorstep across Sri Lanka.",
  business_hours: "Monday - Sunday: 8:00 AM - 9:00 PM",
  hero_headline: "Everything Your Home Needs, All in One Place.",
  hero_subheadline: "Discover quality plastic products, household essentials, kitchenware, storage solutions and everyday items at great prices.",
};

// Database helper functions
export function getCategories(): Category[] {
  ensureDirectory();
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(SEED_CATEGORIES, null, 2), "utf8");
    return SEED_CATEGORIES;
  }
  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return SEED_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]) {
  ensureDirectory();
  const tempFile = `${CATEGORIES_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(categories, null, 2), "utf8");
  fs.renameSync(tempFile, CATEGORIES_FILE);
}

export function getProducts(): Product[] {
  ensureDirectory();
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(SEED_PRODUCTS, null, 2), "utf8");
    return SEED_PRODUCTS;
  }
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return SEED_PRODUCTS;
  }
}

export function saveProducts(products: Product[]) {
  ensureDirectory();
  const tempFile = `${PRODUCTS_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(products, null, 2), "utf8");
  fs.renameSync(tempFile, PRODUCTS_FILE);
}

export function getSettings(): WebsiteSettings {
  ensureDirectory();
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(SEED_SETTINGS, null, 2), "utf8");
    return SEED_SETTINGS;
  }
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, "utf8");
    return { ...SEED_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return SEED_SETTINGS;
  }
}

export function saveSettings(settings: WebsiteSettings) {
  ensureDirectory();
  const tempFile = `${SETTINGS_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(settings, null, 2), "utf8");
  fs.renameSync(tempFile, SETTINGS_FILE);
}

// Product CRUD
export function getProductById(id: string): Product | null {
  const products = getProducts();
  return products.find((p) => p.id === id) || null;
}

export function createProduct(data: Omit<Product, "id" | "created_at" | "updated_at">): Product {
  const products = getProducts();
  const categories = getCategories();
  const cat = categories.find((c) => c.id === data.category_id);

  const newProduct: Product = {
    ...data,
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    category_name: cat ? cat.name : "General",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  if (updates.category_id) {
    const categories = getCategories();
    const cat = categories.find((c) => c.id === updates.category_id);
    if (cat) {
      updates.category_name = cat.name;
    }
  }

  const updated: Product = {
    ...products[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  products[index] = updated;
  saveProducts(products);
  return updated;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

// Category CRUD
export function createCategory(data: Omit<Category, "id" | "created_at">): Category {
  const categories = getCategories();
  const newCat: Category = {
    ...data,
    id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    created_at: new Date().toISOString(),
  };
  categories.push(newCat);
  saveCategories(categories);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const updated = {
    ...categories[index],
    ...updates,
  };
  categories[index] = updated;
  saveCategories(categories);

  // If name changed, update product category_name denormalized references
  if (updates.name) {
    const products = getProducts();
    let hasChanges = false;
    products.forEach((p) => {
      if (p.category_id === id) {
        p.category_name = updates.name;
        hasChanges = true;
      }
    });
    if (hasChanges) saveProducts(products);
  }

  return updated;
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  saveCategories(filtered);

  // Handle associated products safely: reassign to "cat-other" or keep general
  const products = getProducts();
  let changed = false;
  products.forEach((p) => {
    if (p.category_id === id) {
      p.category_id = "cat-other";
      p.category_name = "Other Products";
      changed = true;
    }
  });
  if (changed) saveProducts(products);

  return true;
}
