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
    category TEXT, badge TEXT, emoji TEXT, name TEXT,
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
    const stmt = `INSERT INTO products (category,badge,emoji,name,short_desc,full_desc,price,material,origin,technique,era,dimensions)
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
    const products = [
      ['bowls','Bestseller','🏺','Indus Valley Bowl','Hand-thrown terracotta, slip-painted in ochre','Inspired by the Indus Valley Civilisation, hand-thrown on a kick-wheel from local terracotta. Geometric slip painting echoes motifs from Mohenjo-daro.',4800,'Terracotta','Lahore Workshop','Slip Painting','Indus-Inspired','22cm × 10cm'],
      ['plates',null,'🫙','Tang Dynasty Plate','Celadon-glazed, crackle finish','The Tang Dynasty crackle glaze creates a web of hairlines across this celadon-washed plate — each crack a fingerprint of the kiln fire.',6200,'Stoneware','Lahore Workshop','Crackle Celadon Glaze','Tang-Inspired','28cm diameter'],
      ['vases','New','⚱️','Mesopotamian Ewer','Burnished red clay, ancient relief carvings','Burnished red clay with carved relief patterns of wheat and river motifs. The long neck and wide belly echo vessels found along the Tigris.',11500,'Red Clay','Lahore Workshop','Burnishing & Relief Carving','Mesopotamian','35cm tall'],
      ['mugs',null,'🫗','Raku Wabi-Sabi Mug','Pit-fired, ash glaze, raw crackling','Raku firing draws vessels from the kiln while still glowing, then buries them in combustibles — smoke and flame create unpredictable black flashes.',3200,'Stoneware Clay','Lahore Workshop','Raku Firing','Japanese-Inspired','9cm tall, 300ml'],
      ['bowls',null,'🥣','Greek Kylix Bowl','Black-figure silhouette, classical form','The kylix was the drinking vessel of Ancient Greek symposia. This uses the black-figure technique, painting silhouetted scenes in iron-oxide slip.',5500,'Terracotta','Lahore Workshop','Black-Figure Painting','Greek-Inspired','24cm × 8cm'],
      ['plates','Limited','🍽️','Persian Blue Set','Cobalt and white — Safavid tilework','Inspired by Safavid Isfahan tilework, featuring cobalt arabesque patterns on a white tin-glaze ground. Deep cobalt fired twice for intensity.',8900,'Tin-Glazed Earthenware','Lahore Workshop','Cobalt Majolica','Persian-Inspired','30cm diameter'],
      ['vases',null,'🏛️','Roman Amphora','Two-handled storage vessel, aged terracotta','A faithful recreation of Roman storage vessels using aged terracotta with a raw unglazed exterior bearing marks of antiquity.',14000,'Terracotta','Lahore Workshop','Coil-Built','Roman-Inspired','48cm tall'],
      ['mugs','Bestseller','☕','Song Dynasty Tea Cup','Jian ware temmoku, dark oil-spot glaze','Temmoku glaze — a thick dark iron-saturated glaze that at high temperature forms iridescent oil-spot blooms. Fired to 1300°C.',3800,'High-Iron Stoneware','Lahore Workshop','Temmoku Glaze','Song-Inspired','8cm tall, 200ml']
    ];
    for (const p of products) db.run(stmt, p);
    saveDb();
    console.log('Database seeded with 8 products');
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
    id: row.id, category: row.category, badge: row.badge, emoji: row.emoji,
    name: row.name, shortDesc: row.short_desc, fullDesc: row.full_desc,
    price: row.price, material: row.material, origin: row.origin,
    technique: row.technique, era: row.era, dimensions: row.dimensions
  };
}

function nextOrderRef() {
  const r = query('SELECT COUNT(*) as c FROM orders');
  return `ZL-${String((r[0]?.c || 0) + 1).padStart(4,'0')}`;
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