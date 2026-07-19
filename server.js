const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const initSqlJs = require('sql.js');
const DB_FILE = path.join(__dirname, 'zilal.db');

let db;

async function setupDatabase() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT, badge TEXT, image TEXT, name TEXT,
    short_desc TEXT, full_desc TEXT, price INTEGER,
    material TEXT, origin TEXT, technique TEXT, era TEXT,
    dimensions TEXT, weight REAL DEFAULT 0.3, in_stock INTEGER DEFAULT 1,
    original_price INTEGER
  )`);
  // Migration: zilal.db files created before this column existed
  // won't have it — add it if missing (SQLite has no "ADD COLUMN IF NOT EXISTS").
  try { db.run('ALTER TABLE products ADD COLUMN original_price INTEGER'); } catch (e) { /* already exists */ }
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_ref TEXT, items_json TEXT, subtotal INTEGER, delivery_zone TEXT,
    delivery_fee INTEGER DEFAULT 0, total INTEGER,
    status TEXT DEFAULT 'Confirmed', created_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, email TEXT, type TEXT, message TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  const result = db.exec('SELECT COUNT(*) as c FROM products');
  const count = result[0].values[0][0];

  if (count === 0) {
    const stmt = `INSERT INTO products (category,badge,image,name,short_desc,full_desc,price,material,origin,technique,era,dimensions,weight)
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const products = [
      ['bottles','Top Seller','images/copper-water-bottle.jpg','Pure Copper Water Bottle — 600ml','Hand-hammered 100% pure copper bottle, perfect for daily use','Our signature pure copper water bottle, hand-hammered by Lahore artisans into a dimpled surface that catches the light. Rooted in Ayurvedic tradition, copper vessels are believed to aid digestion, boost immunity, and naturally purify water. Eco-friendly, reusable, and built to last a lifetime — a healthier, more elegant alternative to plastic. Also available in a 1 Litre size.',5499,'99.9% Pure Copper','Lahore Workshop','Hand Hammering','Ayurvedic-Inspired','600ml capacity',0.3],
      ['bottles','Top Seller','images/copper-water-bottle.jpg','Pure Copper Water Bottle — 1 Litre','Hand-hammered 100% pure copper bottle, ideal for long hours','Our signature pure copper water bottle in a larger 1 Litre size, hand-hammered by Lahore artisans into a dimpled surface that catches the light. Rooted in Ayurvedic tradition, copper vessels are believed to aid digestion, boost immunity, and naturally purify water. Eco-friendly, reusable, and built to last a lifetime — a healthier, more elegant alternative to plastic. Also available in a 600ml size.',6999,'99.9% Pure Copper','Lahore Workshop','Hand Hammering','Ayurvedic-Inspired','1 Litre capacity',0.4],
      ['mugs','Bestseller','images/1.jpg','Hammered Copper Glass','Hand-hammered pure copper, traditional lassi glass','This hand-hammered copper glass carries the ancient tradition of the subcontinent. Each dimple is struck individually by a craftsman\'s hammer, creating a surface that catches the light like a constellation. Perfect for lassi, water, or as a decorative piece.',3300,'Pure Copper','Lahore Workshop','Hand Hammering','Mughal-Inspired','10cm tall, 250ml',0.15],
      ['bowls',null,'images/12.jpg','Copper Katori Set (3 pcs)','Hammered copper katoris, silver-lined interior','A set of three traditional hammered copper katoris — the essential vessel of the desi thaal. Each katori is hand-beaten from copper sheet with a tin-lined interior for safe food contact. Used for centuries in wedding feasts and daily meals alike.',3200,'Copper with Tin Lining','Lahore Workshop','Hand Hammering','Mughal-Inspired','10cm diameter each',0.4],
      ['bowls',null,'images/15.jpg','Silver-Finish Katori Set (3 pcs)','Hammered metal katoris, pewter finish','Three katoris finished in a classic pewter-silver tone — the colour of old family heirlooms. Hand-hammered with a characteristic dimple pattern, these bowls are equally at home serving daal, achaar, or raita.',2800,'Hammered Metal, Pewter Finish','Lahore Workshop','Hand Hammering','Traditional','10cm diameter each',0.35],
      ['bowls','New','images/16.jpg','Copper Bowl Set (3 pcs)','Rose copper bowls, polished interior','Three rose-copper bowls with a high-polish interior finish. The warm blush of polished copper transforms any dining table into a feast. Hand-beaten exteriors contrast beautifully with the gleaming inner surface.',3500,'Pure Copper','Lahore Workshop','Hand Hammering & Polishing','Traditional','12cm diameter each',0.45],
      ['plates','Bestseller','images/19.jpg','Hammered Copper Thaal','Large copper serving plate, hand-hammered','The great thaal — centrepiece of every desi feast. This large copper plate is hand-hammered across its entire surface, creating a rippling effect that distributes light in every direction. Solid copper, built to last generations.',6500,'Pure Copper','Lahore Workshop','Hand Hammering','Mughal-Inspired','35cm diameter',0.9],
      ['plates','Limited','images/20.jpg','Copper Thaal Dinner Set','Full thaal with katori & spoon — complete set','The complete desi dining experience. This set includes one large hammered copper thaal, two katoris, and a matching copper spoon — everything needed for a traditional meal. A perfect heirloom gift.',9800,'Pure Copper','Lahore Workshop','Hand Hammering','Traditional','Thaal: 35cm, Katoris: 10cm',1.3],
      ['spoons',null,'images/34.jpg','Copper Tea Spoon','Single hand-finished copper spoon','A single copper tea spoon — slim, elegant, and finished by hand. The subtle warm glow of copper makes even the simplest ritual of stirring chai feel ceremonial.',650,'Copper-Finish Steel','Lahore Workshop','Hand Finishing','Traditional','14cm length',0.05],
      ['spoons',null,'images/32.jpg','Copper Spoon Pair','Two matching copper-finish spoons','A matched pair of copper-finish spoons, ideal for serving or everyday use. The warm rose-copper tone complements any traditional thaal or modern table setting.',1200,'Copper-Finish Steel','Lahore Workshop','Hand Finishing','Traditional','14cm length',0.1],
      ['spoons','New','images/37.jpg','Copper Spoon Set (12 pcs)','Full dozen copper-finish spoons','A complete set of twelve copper-finish spoons — enough for a full family gathering or formal dinner. Uniform in shape, with the signature warm rose-copper tone.',5500,'Copper-Finish Steel','Lahore Workshop','Hand Finishing','Traditional','14cm length, set of 12',0.5]
    ];
    for (const p of products) db.run(stmt, p);
    saveDb();
    console.log('Database seeded with 11 products (copper crockery)');
  }

  // ── Bottle migration ─────────────────────────────
  // Earlier zilal.db files only had one generic "Pure Copper Water Bottle"
  // row. app.js (localStorage mode) has always had two separate 600ml/1L
  // variants — this brings backend mode in line with it, without touching
  // any zilal.db that's already been through this migration.
  const oneLitreExists = query('SELECT id FROM products WHERE name = ?', ['Pure Copper Water Bottle — 1 Litre']);
  if (!oneLitreExists.length) {
    const oldBottle = query('SELECT id FROM products WHERE name = ?', ['Pure Copper Water Bottle']);
    if (oldBottle.length) {
      run(
        `UPDATE products SET name=?, short_desc=?, dimensions=? WHERE id=?`,
        [
          'Pure Copper Water Bottle — 600ml',
          'Hand-hammered 100% pure copper bottle, perfect for daily use',
          '600ml capacity',
          oldBottle[0].id
        ]
      );
      db.run(
        `INSERT INTO products (category,badge,image,name,short_desc,full_desc,price,material,origin,technique,era,dimensions,weight)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        ['bottles','Top Seller','images/copper-water-bottle.jpg','Pure Copper Water Bottle — 1 Litre','Hand-hammered 100% pure copper bottle, ideal for long hours','Our signature pure copper water bottle in a larger 1 Litre size, hand-hammered by Lahore artisans into a dimpled surface that catches the light. Rooted in Ayurvedic tradition, copper vessels are believed to aid digestion, boost immunity, and naturally purify water. Eco-friendly, reusable, and built to last a lifetime — a healthier, more elegant alternative to plastic. Also available in a 600ml size.',6999,'99.9% Pure Copper','Lahore Workshop','Hand Hammering','Ayurvedic-Inspired','1 Litre capacity',0.4]
      );
      saveDb();
      console.log('Migrated single bottle listing into 600ml / 1 Litre variants');
    }
  }

  // ── 6-Person Deal bundle ─────────────────────────
  // Added separately (not in the bulk seed above) so it also gets
  // inserted into a zilal.db that was already seeded before this
  // product existed. Checked by name so it only ever inserts once.
  const dealExists = query('SELECT id FROM products WHERE name = ?', ['6-Person Pure Copper Dining Set']);
  if (!dealExists.length) {
    db.run(
      `INSERT INTO products (category,badge,image,name,short_desc,full_desc,price,original_price,material,origin,technique,era,dimensions,weight)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        'sets', 'Bundle Deal', 'images/6-person-deal.jpg',
        '6-Person Pure Copper Dining Set',
        '6 glasses, 6 dishes, 6 spoons & 6 forks — complete dining set',
        'A complete, healthy dining set for six — hand-hammered from 100% pure copper by our Lahore artisans. Includes 6 dishes, 6 glasses, 6 spoons, and 6 forks, rooted in Ayurvedic tradition for daily use or gifting. Everything your family needs for a healthy, elegant meal, all in one bundle at a special price.',
        59999, 65000, '99.9% Pure Copper', 'Lahore Workshop',
        'Hand Hammering', 'Ayurvedic-Inspired',
        'Dishes 20cm · Glasses 250ml · Spoons & Forks 14cm', 3.6
      ]
    );
    saveDb();
    console.log('Added 6-Person Dining Set deal product');
  }
  // Keep pricing in sync even if this row already existed with older values
  run('UPDATE products SET price=?, original_price=? WHERE name=?', [59999, 65000, '6-Person Pure Copper Dining Set']);

  // ── 4-Person Deal bundle ─────────────────────────
  // Same idempotent pattern as the 6-Person Deal above.
  const fourPersonExists = query('SELECT id FROM products WHERE name = ?', ['4-Person Pure Copper Dining Set']);
  if (!fourPersonExists.length) {
    db.run(
      `INSERT INTO products (category,badge,image,name,short_desc,full_desc,price,original_price,material,origin,technique,era,dimensions,weight)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        'sets', 'Family Deal', 'images/4-person-deal.jpg',
        '4-Person Pure Copper Dining Set',
        '4 glasses, 4 plates, 4 spoons & 4 forks — complete dining set',
        'A complete, healthy dining set for four — hand-hammered from 100% pure copper by our Lahore artisans. Includes 4 plates, 4 glasses, 4 spoons, and 4 forks, rooted in Ayurvedic tradition for daily use or gifting. A perfect size for smaller households, all in one bundle at a special price.',
        39999, 42000, '99.9% Pure Copper', 'Lahore Workshop',
        'Hand Hammering', 'Ayurvedic-Inspired',
        'Plates 20cm · Glasses 250ml · Spoons & Forks 14cm', 2.4
      ]
    );
    saveDb();
    console.log('Added 4-Person Dining Set deal product');
  }
  // Keep pricing in sync even if this row already existed with older/placeholder values
  run('UPDATE products SET price=?, original_price=? WHERE name=?', [39999, 42000, '4-Person Pure Copper Dining Set']);
}

function saveDb() {
  const data = db.export();
  fs.writeFileSync(DB_FILE, Buffer.from(data));
}

function query(sql, params = []) {
  const result = db.exec(sql, params);
  if (!result.length) return [];
  const { columns, values } = result[0];
  return values.map(row => {
    const obj = {};
    columns.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

function formatProduct(row) {
  return {
    id: row.id, category: row.category, badge: row.badge, image: row.image,
    name: row.name, shortDesc: row.short_desc, fullDesc: row.full_desc,
    price: row.price, originalPrice: row.original_price || null,
    material: row.material, origin: row.origin,
    technique: row.technique, era: row.era, dimensions: row.dimensions,
    weight: row.weight
  };
}

// ── DELIVERY / SHIPPING ────────────────────────
// Mirrors the config in app.js. Fee is always computed
// server-side (never trusted from the client) so it can't
// be tampered with in a raw API request.
const DELIVERY_ZONES = {
  lahore: { label: 'Lahore', baseFee: 250, freeKg: 1, perKgFee: 100 },
  other:  { label: 'Rest of Pakistan', baseFee: 350, freeKg: 1, perKgFee: 150 }
};

function calcDeliveryFee(zoneKey, totalWeight) {
  const zone = DELIVERY_ZONES[zoneKey] || DELIVERY_ZONES.lahore;
  const extraKg = Math.max(0, totalWeight - zone.freeKg);
  const fee = zone.baseFee + Math.ceil(extraKg) * zone.perKgFee;
  return { fee, zone };
}

function nextOrderRef() {
  const r = query('SELECT COUNT(*) as c FROM orders');
  return `DP-${String((r[0]?.c || 0) + 1).padStart(4,'0')}`;
}

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  const rows = (!category || category === 'all')
    ? query('SELECT * FROM products WHERE in_stock=1 ORDER BY id')
    : query('SELECT * FROM products WHERE in_stock=1 AND category=? ORDER BY id', [category]);
  res.json({ ok: true, data: rows.map(formatProduct) });
});

app.get('/api/products/:id', (req, res) => {
  const rows = query('SELECT * FROM products WHERE id=?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json({ ok: true, data: formatProduct(rows[0]) });
});

app.post('/api/enquiries', (req, res) => {
  const { name, email, type, message } = req.body;
  if (!name || !email) return res.status(400).json({ ok: false, error: 'Name and email required' });
  run('INSERT INTO enquiries (name,email,type,message) VALUES (?,?,?,?)', [name, email, type||'', message||'']);
  res.json({ ok: true, message: 'Enquiry received!' });
});

app.post('/api/orders', (req, res) => {
  const { items, zone } = req.body;
  if (!items?.length) return res.status(400).json({ ok: false, error: 'No items' });

  const subtotal = items.reduce((s, i) => s + (i.price * (i.qty||1)), 0);

  // Look up each item's real weight from the DB (never trust client-sent weight)
  const totalWeight = items.reduce((s, i) => {
    const rows = query('SELECT weight FROM products WHERE id=?', [i.id]);
    const w = rows.length ? (rows[0].weight || 0) : 0;
    return s + w * (i.qty || 1);
  }, 0);

  const zoneKey = DELIVERY_ZONES[zone] ? zone : 'lahore';
  const { fee: deliveryFee, zone: zoneInfo } = calcDeliveryFee(zoneKey, totalWeight);
  const total = subtotal + deliveryFee;

  const ref = nextOrderRef();
  run(
    'INSERT INTO orders (order_ref,items_json,subtotal,delivery_zone,delivery_fee,total) VALUES (?,?,?,?,?,?)',
    [ref, JSON.stringify(items), subtotal, zoneInfo.label, deliveryFee, total]
  );
  res.json({ ok: true, orderId: ref, subtotal, deliveryZone: zoneInfo.label, deliveryFee, total });
});

app.get('/api/orders', (req, res) => res.json({ ok: true, data: query('SELECT * FROM orders ORDER BY id DESC') }));
app.get('/api/enquiries', (req, res) => res.json({ ok: true, data: query('SELECT * FROM enquiries ORDER BY id DESC') }));

setupDatabase().then(() => {
  app.listen(PORT, () => {
    console.log('\n✦ Zilal Server Running!');
    console.log(`  Open: http://localhost:${PORT}\n`);
  });
});