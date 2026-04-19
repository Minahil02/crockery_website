/*
  ═══════════════════════════════════════════════════════
  Ẑilāl — Node.js/Express Backend + SQLite Database
  
  Usage:
    npm install express better-sqlite3 cors
    node server.js
  
  Runs on http://localhost:3000
  ═══════════════════════════════════════════════════════
*/

const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─────────────────────────────────────────────
// DATABASE SETUP
// ─────────────────────────────────────────────
const db = new Database('zilal.db');

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category    TEXT NOT NULL,
    badge       TEXT,
    emoji       TEXT NOT NULL,
    name        TEXT NOT NULL,
    short_desc  TEXT NOT NULL,
    full_desc   TEXT NOT NULL,
    price       INTEGER NOT NULL,
    material    TEXT,
    origin      TEXT,
    technique   TEXT,
    era         TEXT,
    dimensions  TEXT,
    in_stock    INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    order_ref   TEXT NOT NULL UNIQUE,
    items_json  TEXT NOT NULL,
    total       INTEGER NOT NULL,
    status      TEXT DEFAULT 'Confirmed',
    customer    TEXT,
    email       TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    type        TEXT,
    message     TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
  );
`);

// Seed products if table is empty
const count = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (category, badge, emoji, name, short_desc, full_desc, price, material, origin, technique, era, dimensions)
    VALUES (@category, @badge, @emoji, @name, @short_desc, @full_desc, @price, @material, @origin, @technique, @era, @dimensions)
  `);

  const seedMany = db.transaction((products) => {
    for (const p of products) insert.run(p);
  });

  seedMany([
    {
      category: 'bowls', badge: 'Bestseller', emoji: '🏺',
      name: 'Indus Valley Bowl',
      short_desc: 'Hand-thrown terracotta, slip-painted in ochre',
      full_desc: 'Inspired by the great Indus Valley Civilisation, this bowl is hand-thrown on a kick-wheel from local terracotta. The geometric slip painting echoes motifs found at Mohenjo-daro, fired to 1080°C in a wood-burning kiln.',
      price: 4800, material: 'Terracotta', origin: 'Lahore Workshop',
      technique: 'Slip Painting', era: 'Indus-Inspired', dimensions: '22cm × 10cm'
    },
    {
      category: 'plates', badge: null, emoji: '🫙',
      name: 'Tang Dynasty Plate',
      short_desc: 'Celadon-glazed, crackle finish',
      full_desc: 'The Tang Dynasty crackle glaze technique creates a web of hairlines across this celadon-washed plate — each piece unique, each crack a fingerprint of the kiln\'s fire.',
      price: 6200, material: 'Stoneware', origin: 'Lahore Workshop',
      technique: 'Crackle Celadon Glaze', era: 'Tang-Inspired', dimensions: '28cm diameter'
    },
    {
      category: 'vases', badge: 'New', emoji: '⚱️',
      name: 'Mesopotamian Ewer',
      short_desc: 'Burnished red clay, ancient relief carvings',
      full_desc: 'This ewer draws from Mesopotamian pottery traditions — burnished red clay with carved relief patterns of wheat and river motifs. The long neck and wide belly echo vessels found along the Tigris.',
      price: 11500, material: 'Red Clay', origin: 'Lahore Workshop',
      technique: 'Burnishing & Relief Carving', era: 'Mesopotamian', dimensions: '35cm tall'
    },
    {
      category: 'mugs', badge: null, emoji: '🫗',
      name: 'Raku Wabi-Sabi Mug',
      short_desc: 'Pit-fired, ash glaze, raw crackling',
      full_desc: 'Raku firing draws vessels from the kiln while still glowing, then buries them in combustibles — the smoke and flame sear each mug with unpredictable black flashes and metallic sheen.',
      price: 3200, material: 'Stoneware Clay', origin: 'Lahore Workshop',
      technique: 'Raku Firing', era: 'Japanese-Inspired', dimensions: '9cm tall, 300ml'
    },
    {
      category: 'bowls', badge: null, emoji: '🥣',
      name: 'Greek Kylix Bowl',
      short_desc: 'Black-figure silhouette, classical form',
      full_desc: 'The kylix was the drinking vessel of symposia — shallow, two-handled, wide. This interpretation uses the black-figure technique of Ancient Greece.',
      price: 5500, material: 'Terracotta', origin: 'Lahore Workshop',
      technique: 'Black-Figure Painting', era: 'Greek-Inspired', dimensions: '24cm × 8cm'
    },
    {
      category: 'plates', badge: 'Limited', emoji: '🍽️',
      name: 'Persian Blue Set',
      short_desc: 'Cobalt and white — Safavid tilework',
      full_desc: 'Inspired by the tilework of Safavid Isfahan, this dinner plate features cobalt arabesque patterns on a white tin-glaze ground.',
      price: 8900, material: 'Tin-Glazed Earthenware', origin: 'Lahore Workshop',
      technique: 'Cobalt Majolica', era: 'Persian-Inspired', dimensions: '30cm diameter'
    },
    {
      category: 'vases', badge: null, emoji: '🏛️',
      name: 'Roman Amphora',
      short_desc: 'Two-handled storage vessel, aged terracotta',
      full_desc: 'Every Roman household possessed amphoras for oil, wine, and grain. This faithful recreation uses aged terracotta with a raw, unglazed exterior.',
      price: 14000, material: 'Terracotta', origin: 'Lahore Workshop',
      technique: 'Coil-Built', era: 'Roman-Inspired', dimensions: '48cm tall'
    },
    {
      category: 'mugs', badge: 'Bestseller', emoji: '☕',
      name: 'Song Dynasty Tea Cup',
      short_desc: 'Jian ware temmoku, dark oil-spot glaze',
      full_desc: 'The Song Dynasty Jian ware tea bowls were coveted by emperors. This recreation uses a temmoku glaze — a thick, dark iron-saturated glaze that forms iridescent oil-spot blooms.',
      price: 3800, material: 'High-Iron Stoneware', origin: 'Lahore Workshop',
      technique: 'Temmoku Glaze', era: 'Song-Inspired', dimensions: '8cm tall, 200ml'
    }
  ]);
  console.log('✦ Database seeded with 8 products');
}

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
let orderCounter = db.prepare('SELECT COUNT(*) as c FROM orders').get().c + 1;
function nextOrderRef() {
  return `ZL-${String(orderCounter++).padStart(4,'0')}`;
}

// ─────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────

// GET /api/products?category=all
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let rows;
  if (!category || category === 'all') {
    rows = db.prepare('SELECT * FROM products WHERE in_stock = 1 ORDER BY id').all();
  } else {
    rows = db.prepare('SELECT * FROM products WHERE in_stock = 1 AND category = ? ORDER BY id').all(category);
  }
  res.json({ ok: true, data: rows.map(formatProduct) });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ ok: false, error: 'Product not found' });
  res.json({ ok: true, data: formatProduct(row) });
});

// POST /api/enquiries
app.post('/api/enquiries', (req, res) => {
  const { name, email, type, message } = req.body;
  if (!name || !email) return res.status(400).json({ ok: false, error: 'Name and email required' });
  db.prepare('INSERT INTO enquiries (name, email, type, message) VALUES (?, ?, ?, ?)')
    .run(name, email, type || null, message || null);
  res.json({ ok: true, message: 'Enquiry received. We will respond within two sunrises.' });
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  const { items, customer, email } = req.body;
  if (!items || !items.length) return res.status(400).json({ ok: false, error: 'No items in order' });
  const total = items.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);
  const orderRef = nextOrderRef();
  db.prepare('INSERT INTO orders (order_ref, items_json, total, customer, email) VALUES (?, ?, ?, ?, ?)')
    .run(orderRef, JSON.stringify(items), total, customer || 'Guest', email || null);
  res.json({ ok: true, orderId: orderRef, total, message: `Order ${orderRef} confirmed!` });
});

// GET /api/orders (admin)
app.get('/api/orders', (req, res) => {
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json({ ok: true, data: rows });
});

// GET /api/enquiries (admin)
app.get('/api/enquiries', (req, res) => {
  const rows = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all();
  res.json({ ok: true, data: rows });
});

// ─────────────────────────────────────────────
// FORMAT HELPER
// ─────────────────────────────────────────────
function formatProduct(row) {
  return {
    id: row.id,
    category: row.category,
    badge: row.badge,
    emoji: row.emoji,
    name: row.name,
    shortDesc: row.short_desc,
    fullDesc: row.full_desc,
    price: row.price,
    material: row.material,
    origin: row.origin,
    technique: row.technique,
    era: row.era,
    dimensions: row.dimensions
  };
}

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✦ ❧ Ẑilāl Server Running ❧ ✦`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  API:     http://localhost:${PORT}/api/products`);
  console.log(`  DB:      ./zilal.db\n`);
});
