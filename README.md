# ❧ Ẑilāl — Ancient Crockery & Ceramics Website

A full-stack crockery business website with an ancient, parchment-and-terracotta aesthetic.

---

## Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | HTML5 · CSS3 · Vanilla JavaScript |
| Backend  | Node.js + Express.js              |
| Database | SQLite (via better-sqlite3)       |

---

## Quick Start

### Option A — Open Directly (no server needed)
Just open `index.html` in your browser.  
The frontend uses an in-browser mock backend + localStorage as the database.  
Everything works: cart, orders, enquiries, filters, modal.

### Option B — Run Full Backend Server

1. Install Node.js (v18+) from https://nodejs.org

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open http://localhost:3000

---

## Project Structure

```
zilal/
├── index.html       — Main page (all sections)
├── style.css        — Full stylesheet (ancient aesthetic)
├── app.js           — Frontend JS + in-browser API + localStorage DB
├── server.js        — Express backend + SQLite setup + REST API
├── package.json     — Node dependencies
└── README.md        — This file
```

---

## API Endpoints (Backend Mode)

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | /api/products         | All products             |
| GET    | /api/products?category=bowls | Filter by category  |
| GET    | /api/products/:id     | Single product           |
| POST   | /api/orders           | Place an order           |
| GET    | /api/orders           | List all orders (admin)  |
| POST   | /api/enquiries        | Submit contact enquiry   |
| GET    | /api/enquiries        | List enquiries (admin)   |

---

## Features

- 🏺 8 ancient-inspired products (bowls, plates, vases, mugs)
- 🛒 Shopping cart with localStorage persistence
- 🔍 Category filter
- 📋 Product detail modal with quantity selector
- 📬 Contact / commission enquiry form
- 🗄️ SQLite database with orders & enquiries tables
- 📱 Responsive (mobile-friendly)
- ✨ Animated: floating shapes, marquee, scroll indicator, toast notifications

---

## Customisation

- Edit product data in `server.js` (SEED array) or `app.js` (PRODUCT_SEED)
- Change colours in `style.css` under `:root {}`
- Add real images: replace emoji in `card-img-inner` with `<img>` tags
