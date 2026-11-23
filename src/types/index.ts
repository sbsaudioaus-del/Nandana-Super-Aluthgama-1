export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in LKR
  category_id: string;
  category_name?: string;
  image_url: string;
  stock_quantity: number;
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  product_count?: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WebsiteSettings {
  shop_name: string;
  tagline: string;
  whatsapp_number: string;
  whatsapp_display: string;
  phone: string;
  email: string;
  address: string;
  delivery_info: string;
  business_hours: string;
  hero_headline: string;
  hero_subheadline: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
}
