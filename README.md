# Nandana Super Shop - Modern E-Commerce Platform

A complete, modern, premium, fully responsive e-commerce website for **Nandana Super Shop** (Sri Lanka), specializing in household plastic products, kitchenware, storage organizers, cleaning supplies, and everyday home essentials.

## Features

- **Brand Design:** Pure White (`#FFFFFF`), Signature Green (`#65C240`), Dark Text (`#222222`), elegant rounded styling, and subtle scrolling household item background silhouettes.
- **Uploaded Logo:** Uses the official uploaded Nandana Super Shop logo throughout all pages.
- **Dynamic Catalog:** 10 categories, 16+ pre-seeded products with prices in Sri Lankan Rupees (LKR).
- **Interactive Shopping:** Category tabs, real-time search, sorting (Price Low-to-High, High-to-Low, Newest), and in-stock toggle.
- **Product Quick View:** Detailed pop-up modal with high-res imagery, specs, and instant add-to-cart.
- **Shopping Cart System:** Persistent cart drawer and dedicated cart page powered by `localStorage`.
- **Direct WhatsApp Ordering:** Automatically generates a formatted order message with itemized pricing, quantity, and grand total, opening directly to `+94778704807` (`https://wa.me/94778704807`).
- **Interactive Contact Form:** WhatsApp inquiry generator sending customer questions directly to the store.
- **Admin Dashboard (`admin.html`):**
  - Secure cryptographic authentication (SHA-256 hashed credentials).
  - **Username:** `Nandana Super`
  - **Password:** `NS2026`
  - Metrics: Total Products, Total Categories, Available & Unavailable counts.
  - Product CRUD: Add, edit, delete, update prices, change images (supports local image upload or URLs), toggle availability, and set featured items.
  - Category Management: Add, edit, delete with safe product reassignment.
  - Store Settings: WhatsApp number, contact details, delivery text, and hours.

## File Structure

```
├── index.html          # Homepage with Hero, Categories, Products, Delivery & Cart
├── shop.html           # Full Catalog page with dynamic filtering & sorting
├── categories.html     # Shopping categories showcase
├── about.html          # About Nandana Super Shop & Quality Promise
├── contact.html        # Contact details & WhatsApp inquiry form
├── cart.html           # Dedicated Shopping Cart table & WhatsApp checkout
├── admin.html          # Admin Dashboard & Product Management
├── css/
│   └── style.css       # Complete modern styling & responsive layout
├── js/
│   ├── data.js         # Initial seed catalog & persistent data store
│   ├── cart.js         # Shopping cart engine & WhatsApp order generator
│   ├── app.js          # Product grids, category tabs, search & quick view
│   └── admin.js        # Secure admin login & CRUD management
├── images/
│   └── logo.jpg        # Official uploaded Nandana Super Shop logo
└── server.js           # Lightweight local development server
```

## How to Run Locally

You can open `index.html` directly in any web browser, or start the local development server:

```bash
node server.js
```

Then visit: [http://localhost:3000](http://localhost:3000) in your web browser.
