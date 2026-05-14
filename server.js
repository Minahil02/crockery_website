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
    dimensions TEXT, in_stock INTEGER DEFAULT 1
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_ref TEXT, items_json TEXT, total INTEGER,
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
    const stmt = `INSERT INTO products (category,badge,image,name,short_desc,full_desc,price,material,origin,technique,era,dimensions)
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
    const products = [
      ['mugs','Bestseller','images/1.jpg','Hammered Copper Glass','Hand-hammered pure copper, traditional lassi glass','This hand-hammered copper glass carries the ancient tradition of the subcontinent. Each dimple is struck individually by a craftsman\'s hammer, creating a surface that catches the light like a constellation. Perfect for lassi, water, or as a decorative piece.',1800,'Pure Copper','Lahore Workshop','Hand Hammering','Mughal-Inspired','10cm tall, 250ml'],
      ['bowls',null,'images/12.jpg','Brass Katori Set (3 pcs)','Hammered brass katoris, silver-lined interior','A set of three traditional hammered brass katoris — the essential vessel of the desi thaal. Each katori is hand-beaten from brass sheet with a tin-lined interior for safe food contact. Used for centuries in wedding feasts and daily meals alike.',3200,'Brass with Tin Lining','Lahore Workshop','Hand Hammering','Mughal-Inspired','10cm diameter each'],
      ['bowls',null,'images/15.jpg','Silver-Finish Katori Set (3 pcs)','Hammered metal katoris, pewter finish','Three katoris finished in a classic pewter-silver tone — the colour of old family heirlooms. Hand-hammered with a characteristic dimple pattern, these bowls are equally at home serving daal, achaar, or raita.',2800,'Hammered Metal, Pewter Finish','Lahore Workshop','Hand Hammering','Traditional','10cm diameter each'],
      ['bowls','New','images/16.jpg','Copper Bowl Set (3 pcs)','Rose copper bowls, polished interior','Three rose-copper bowls with a high-polish interior finish. The warm blush of polished copper transforms any dining table into a feast. Hand-beaten exteriors contrast beautifully with the gleaming inner surface.',3500,'Pure Copper','Lahore Workshop','Hand Hammering & Polishing','Traditional','12cm diameter each'],
      ['plates','Bestseller','images/19.jpg','Hammered Copper Thaal','Large copper serving plate, hand-hammered','The great thaal — centrepiece of every desi feast. This large copper plate is hand-hammered across its entire surface, creating a rippling effect that distributes light in every direction. Solid copper, built to last generations.',6500,'Pure Copper','Lahore Workshop','Hand Hammering','Mughal-Inspired','35cm diameter'],
      ['plates','Limited','images/20.jpg','Copper Thaal Dinner Set','Full thaal with katori & spoon — complete set','The complete desi dining experience. This set includes one large hammered copper thaal, two katoris, and a matching copper spoon — everything needed for a traditional meal. A perfect heirloom gift.',9800,'Pure Copper & Brass','Lahore Workshop','Hand Hammering','Traditional','Thaal: 35cm, Katoris: 10cm'],
      ['spoons',null,'images/34.jpg','Copper Tea Spoon','Single hand-finished copper spoon','A single copper tea spoon — slim, elegant, and finished by hand. The subtle warm glow of copper makes even the simplest ritual of stirring chai feel ceremonial.',650,'Copper-Finish Steel','Lahore Workshop','Hand Finishing','Traditional','14cm length'],
      ['spoons',null,'images/32.jpg','Copper Spoon Pair','Two matching copper-finish spoons','A matched pair of copper-finish spoons, ideal for serving or everyday use. The warm rose-copper tone complements any traditional thaal or modern table setting.',1200,'Copper-Finish Steel','Lahore Workshop','Hand Finishing','Traditional','14cm length'],
      ['spoons','New','images/37.jpg','Copper Spoon Set (12 pcs)','Full dozen copper-finish spoons','A complete set of twelve copper-finish spoons — enough for a full family gathering or formal dinner. Uniform in shape, with the signature warm rose-copper tone.',5500,'Copper-Finish Steel','Lahore Workshop','Hand Finishing','Traditional','14cm length, set of 12']
    ];
    for (const p of products) db.run(stmt, p);
    saveDb();
    console.log('Database seeded with 9 products (copper crockery)');
  }
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
    price: row.price, material: row.material, origin: row.origin,
    technique: row.technique, era: row.era, dimensions: row.dimensions
  };
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
  const { items } = req.body;
  if (!items?.length) return res.status(400).json({ ok: false, error: 'No items' });
  const total = items.reduce((s, i) => s + (i.price * (i.qty||1)), 0);
  const ref = nextOrderRef();
  run('INSERT INTO orders (order_ref,items_json,total) VALUES (?,?,?)', [ref, JSON.stringify(items), total]);
  res.json({ ok: true, orderId: ref, total });
});

app.get('/api/orders', (req, res) => res.json({ ok: true, data: query('SELECT * FROM orders ORDER BY id DESC') }));
app.get('/api/enquiries', (req, res) => res.json({ ok: true, data: query('SELECT * FROM enquiries ORDER BY id DESC') }));

setupDatabase().then(() => {
  app.listen(PORT, () => {
    console.log('\n✦ Zilal Server Running!');
    console.log(`  Open: http://localhost:${PORT}\n`);
  });
});