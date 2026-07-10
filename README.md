# ❧ Desi Panday — Handcrafted Copper & Ceramics E-Commerce Website

A full-stack e-commerce site for a handcrafted copper/brass utensils business, with an ancient parchment-and-terracotta aesthetic. Customers browse products, order via a WhatsApp-integrated checkout, and receive automatic email confirmations — sellers get instant WhatsApp notifications for every order and enquiry.

**Live site:** https://desipanday.netlify.app

---

## Features

- 🏺 Product catalog across multiple categories (bowls, plates, vases, mugs) with detail modals
- 🛒 Shopping cart with quantity control and persistence
- 🔍 Category filtering
- 💬 WhatsApp-based checkout — order details sent as a pre-filled WhatsApp message to the seller
- 📧 Automatic order confirmation emails to customers (EmailJS)
- 📬 Contact/enquiry form with WhatsApp seller notifications
- 🗄️ Dual database modes — works fully offline via `localStorage`, or with a persistent SQLite backend
- 📱 Fully responsive, mobile-first design
- ✨ Animated UI — floating shapes, marquee, scroll indicator, toast notifications

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite (via better-sqlite3) |
| Integrations | WhatsApp API (wa.me), EmailJS, Formspree |

---

## How Ordering Works

1. Customer browses products and adds items to cart
2. Customer reviews cart and proceeds to checkout
3. Customer fills in name, phone, email, and delivery address
4. WhatsApp opens with a pre-filled order summary, ready to send to the seller
5. If an email was provided, the customer automatically receives an order confirmation
6. The order is saved to `localStorage`, and to the SQLite database if the server is running

---

## Getting Started

### Option A — Open Directly (no install needed)
Open `index.html` in any browser. The frontend uses `localStorage` as an in-browser database — cart, orders, enquiries, and filters all work immediately, fully offline.

### Option B — Run with the Backend Server
```bash
npm install
npm start
```
Then open http://localhost:3000. This connects to a persistent SQLite database (`zilal.db`) and exposes a REST API for orders and enquiries.

---

## API Endpoints (Backend Mode)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | All products |
| GET | `/api/products?category=bowls` | Filter by category |
| GET | `/api/products/:id` | Single product |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders` | List all orders (admin) |
| POST | `/api/enquiries` | Submit a contact enquiry |
| GET | `/api/enquiries` | List enquiries (admin) |

---

## Project Structure

```
zilal/
├── index.html       — Main page
├── style.css        — Full stylesheet
├── app.js           — Frontend logic, cart, localStorage DB, EmailJS
├── server.js        — Express backend + SQLite + REST API
├── package.json     — Dependencies
└── README.md
```

---

## Roadmap

- [ ] Real product photography (replacing placeholder icons)
- [ ] AI-powered product recommendations (Gemini API)
- [ ] Online payment (JazzCash / Easypaisa)
- [ ] Order tracking by order ID
- [ ] Admin dashboard for orders and enquiries

---

**Built by Minahal Umar** — [GitHub](https://github.com/Minahil02) · [LinkedIn](https://linkedin.com/in/minahal-umar-69423b2a7)