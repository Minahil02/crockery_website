/* ═══════════════════════════════════════════════
   Ẑilāl — app.js
   Frontend + In-Browser Backend (REST-style)
   + localStorage "Database"
   ═══════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────
// DATABASE (localStorage-backed)
// ─────────────────────────────────────────────
const DB = {
  _key: 'zilal_db',

  init() {
    if (!localStorage.getItem(this._key)) {
      const seed = {
        products: PRODUCT_SEED,
        orders: [],
        enquiries: [],
        nextOrderId: 1
      };
      localStorage.setItem(this._key, JSON.stringify(seed));
    }
    return this;
  },

  read() {
    return JSON.parse(localStorage.getItem(this._key));
  },

  write(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  },

  getProducts(filter = 'all') {
    const db = this.read();
    if (filter === 'all') return db.products;
    return db.products.filter(p => p.category === filter);
  },

  getProduct(id) {
    return this.read().products.find(p => p.id === id) || null;
  },

  saveEnquiry(enquiry) {
    const db = this.read();
    db.enquiries.push({ ...enquiry, id: Date.now(), date: new Date().toISOString() });
    this.write(db);
    return true;
  },

  saveOrder(order) {
    const db = this.read();
    const id = `ZL-${String(db.nextOrderId).padStart(4,'0')}`;
    db.orders.push({ ...order, id, date: new Date().toISOString(), status: 'Confirmed' });
    db.nextOrderId++;
    this.write(db);
    return id;
  },

  getOrders() { return this.read().orders; },
  getEnquiries() { return this.read().enquiries; }
};

// ─────────────────────────────────────────────
// PRODUCT SEED DATA
// ─────────────────────────────────────────────
const PRODUCT_SEED = [
  {
    id: 1, category: 'bowls', badge: 'Bestseller',
    emoji: '🏺',
    name: 'Indus Valley Bowl',
    shortDesc: 'Hand-thrown terracotta, slip-painted in ochre',
    fullDesc: 'Inspired by the great Indus Valley Civilisation, this bowl is hand-thrown on a kick-wheel from local terracotta. The geometric slip painting echoes motifs found at Mohenjo-daro, fired to 1080°C in a wood-burning kiln.',
    price: 4800, material: 'Terracotta', origin: 'Lahore Workshop', technique: 'Slip Painting', era: 'Indus-Inspired',
    dimensions: '22cm × 10cm'
  },
  {
    id: 2, category: 'plates', badge: null,
    emoji: '🫙',
    name: 'Tang Dynasty Plate',
    shortDesc: 'Celadon-glazed, crackle finish',
    fullDesc: 'The Tang Dynasty crackle glaze technique creates a web of hairlines across this celadon-washed plate — each piece unique, each crack a fingerprint of the kiln\'s fire. Dishwasher-safe for daily use.',
    price: 6200, material: 'Stoneware', origin: 'Lahore Workshop', technique: 'Crackle Celadon Glaze', era: 'Tang-Inspired',
    dimensions: '28cm diameter'
  },
  {
    id: 3, category: 'vases', badge: 'New',
    emoji: '⚱️',
    name: 'Mesopotamian Ewer',
    shortDesc: 'Burnished red clay, ancient relief carvings',
    fullDesc: 'This ewer draws from Mesopotamian pottery traditions — burnished red clay with carved relief patterns of wheat and river motifs. The long neck and wide belly echo vessels found along the Tigris. Each ewer is unique.',
    price: 11500, material: 'Red Clay', origin: 'Lahore Workshop', technique: 'Burnishing & Relief Carving', era: 'Mesopotamian',
    dimensions: '35cm tall'
  },
  {
    id: 4, category: 'mugs', badge: null,
    emoji: '🫗',
    name: 'Raku Wabi-Sabi Mug',
    shortDesc: 'Pit-fired, ash glaze, raw crackling',
    fullDesc: 'Raku firing draws vessels from the kiln while still glowing, then buries them in combustibles — the smoke and flame sear each mug with unpredictable black flashes and metallic sheen. No two are alike. True wabi-sabi.',
    price: 3200, material: 'Stoneware Clay', origin: 'Lahore Workshop', technique: 'Raku Firing', era: 'Japanese-Inspired',
    dimensions: '9cm tall, 300ml'
  },
  {
    id: 5, category: 'bowls', badge: null,
    emoji: '🥣',
    name: 'Greek Kylix Bowl',
    shortDesc: 'Black-figure silhouette, classical form',
    fullDesc: 'The kylix was the drinking vessel of symposia — shallow, two-handled, wide. This interpretation uses the black-figure technique of Ancient Greece, painting silhouetted mythological scenes in iron-oxide slip on a terracotta ground.',
    price: 5500, material: 'Terracotta', origin: 'Lahore Workshop', technique: 'Black-Figure Painting', era: 'Greek-Inspired',
    dimensions: '24cm × 8cm'
  },
  {
    id: 6, category: 'plates', badge: 'Limited',
    emoji: '🍽️',
    name: 'Persian Blue Set',
    shortDesc: 'Cobalt and white — Safavid tilework',
    fullDesc: 'Inspired by the tilework of Safavid Isfahan, this dinner plate features cobalt arabesque patterns on a white tin-glaze ground. The deep cobalt is achieved through pure cobalt oxide — fired twice for intensity and depth.',
    price: 8900, material: 'Tin-Glazed Earthenware', origin: 'Lahore Workshop', technique: 'Cobalt Majolica', era: 'Persian-Inspired',
    dimensions: '30cm diameter'
  },
  {
    id: 7, category: 'vases', badge: null,
    emoji: '🏛️',
    name: 'Roman Amphora',
    shortDesc: 'Two-handled storage vessel, aged terracotta',
    fullDesc: 'Every Roman household possessed amphoras for oil, wine, and grain. This faithful recreation uses aged terracotta with a raw, unglazed exterior — its surface bears deliberate marks of antiquity: the faint ghosts of mould seams and kiln shelf scars.',
    price: 14000, material: 'Terracotta', origin: 'Lahore Workshop', technique: 'Coil-Built', era: 'Roman-Inspired',
    dimensions: '48cm tall'
  },
  {
    id: 8, category: 'mugs', badge: 'Bestseller',
    emoji: '☕',
    name: 'Song Dynasty Tea Cup',
    shortDesc: 'Jian ware temmoku, dark oil-spot glaze',
    fullDesc: 'The Song Dynasty Jian ware tea bowls were coveted by emperors. This recreation uses a temmoku glaze — a thick, dark iron-saturated glaze that, at high temperature, forms iridescent oil-spot blooms across the surface. Each cup is fired to 1300°C.',
    price: 3800, material: 'High-Iron Stoneware', origin: 'Lahore Workshop', technique: 'Temmoku Glaze', era: 'Song-Inspired',
    dimensions: '8cm tall, 200ml'
  }
];

// ─────────────────────────────────────────────
// MOCK BACKEND API (REST-style, in-browser)
// ─────────────────────────────────────────────
const API = {
  async getProducts(filter = 'all') {
    await delay(80);
    return { ok: true, data: DB.getProducts(filter) };
  },

  async getProduct(id) {
    await delay(60);
    const p = DB.getProduct(id);
    return p ? { ok: true, data: p } : { ok: false, error: 'Product not found' };
  },

  async submitEnquiry(payload) {
    await delay(600);
    if (!payload.name || !payload.email) return { ok: false, error: 'Missing fields' };
    DB.saveEnquiry(payload);
    return { ok: true, message: 'Enquiry recorded' };
  },

  async placeOrder(cartItems) {
    await delay(800);
    if (!cartItems.length) return { ok: false, error: 'Cart is empty' };
    const total = cartItems.reduce((s, i) => s + (i.price * i.qty), 0);
    const orderId = DB.saveOrder({ items: cartItems, total });
    return { ok: true, orderId, total };
  }
};

// ─────────────────────────────────────────────
// CART STATE
// ─────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('zilal_cart') || '[]');
let modalQty = 1;
let currentProduct = null;

function saveCart() {
  localStorage.setItem('zilal_cart', JSON.stringify(cart));
}

function addToCart(product, qty = 1) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }
  saveCart();
  updateCartUI();
  showToast(`✦ ${product.name} added to your selection`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = count;

  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (!cart.length) {
    container.innerHTML = '<div class="cart-empty">Your cart is empty, yet the kiln awaits.</div>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">Rs. ${(item.price * item.qty).toLocaleString()} &nbsp;×${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  document.getElementById('cartTotal').textContent = `Rs. ${total.toLocaleString()}`;
}

// ─────────────────────────────────────────────
// CART TOGGLE
// ─────────────────────────────────────────────
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// ─────────────────────────────────────────────
// CHECKOUT
// ─────────────────────────────────────────────
async function checkout() {
  if (!cart.length) return;
  const res = await API.placeOrder(cart);
  if (res.ok) {
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
    showToast(`✦ Order ${res.orderId} confirmed! Total: Rs. ${res.total.toLocaleString()}`);
  }
}

// ─────────────────────────────────────────────
// PRODUCT GRID
// ─────────────────────────────────────────────
async function loadProducts(filter = 'all') {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '<div style="text-align:center;padding:3rem;font-style:italic;color:var(--umber-l)">Loading collection…</div>';
  const res = await API.getProducts(filter);
  if (!res.ok) return;

  grid.innerHTML = res.data.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 0.07}s" onclick="openModal(${p.id})">
      <div class="card-img">
        <div class="card-img-inner">${p.emoji}</div>
        ${p.badge ? `<div class="card-badge">${p.badge}</div>` : ''}
      </div>
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.shortDesc}</div>
        <div class="card-footer">
          <span class="card-price">Rs. ${p.price.toLocaleString()}</span>
          <button class="card-add" onclick="event.stopPropagation(); addToCart(${JSON.stringify(p).replace(/"/g,"'")})">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────
async function openModal(id) {
  const res = await API.getProduct(id);
  if (!res.ok) return;
  currentProduct = res.data;
  modalQty = 1;
  renderModal(currentProduct);
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('productModal').classList.add('open');
}

function renderModal(p) {
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-img">${p.emoji}</div>
    <div class="modal-body">
      <div class="modal-category">${p.category} · ${p.era}</div>
      <div class="modal-name">${p.name}</div>
      <div class="modal-desc">${p.fullDesc}</div>
      <div class="modal-details">
        <div class="modal-detail-row"><span>Material</span><span>${p.material}</span></div>
        <div class="modal-detail-row"><span>Technique</span><span>${p.technique}</span></div>
        <div class="modal-detail-row"><span>Dimensions</span><span>${p.dimensions}</span></div>
        <div class="modal-detail-row"><span>Origin</span><span>${p.origin}</span></div>
      </div>
      <div class="modal-price">Rs. ${p.price.toLocaleString()}</div>
      <div class="modal-qty">
        <button class="qty-btn" onclick="changeQty(-1)">−</button>
        <span class="qty-val" id="modalQtyDisplay">1</span>
        <button class="qty-btn" onclick="changeQty(1)">+</button>
      </div>
      <button class="btn btn-primary full" onclick="addToCartFromModal()">Add to Selection</button>
    </div>
  `;
}

function changeQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  const el = document.getElementById('modalQtyDisplay');
  if (el) el.textContent = modalQty;
}

function addToCartFromModal() {
  if (!currentProduct) return;
  addToCart(currentProduct, modalQty);
  closeModal();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('productModal').classList.remove('open');
  currentProduct = null;
}

// ─────────────────────────────────────────────
// FILTER
// ─────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadProducts(btn.dataset.filter);
  });
});

// ─────────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  const payload = {
    name: document.getElementById('fname').value,
    email: document.getElementById('femail').value,
    type: document.getElementById('ftype').value,
    message: document.getElementById('fmessage').value
  };

  const res = await API.submitEnquiry(payload);
  btn.textContent = 'Send Message';
  btn.disabled = false;

  if (res.ok) {
    document.getElementById('formSuccess').classList.add('show');
    e.target.reset();
    setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 6000);
  }
});

// ─────────────────────────────────────────────
// NAVBAR SCROLL
// ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// ─────────────────────────────────────────────
// HAMBURGER (mobile)
// ─────────────────────────────────────────────
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  links.style.flexDirection = 'column';
  links.style.position = 'absolute';
  links.style.top = '100%';
  links.style.left = '0'; links.style.right = '0';
  links.style.background = 'var(--cream)';
  links.style.padding = '1.5rem 2rem';
  links.style.borderBottom = '1px solid var(--parchment-d)';
  links.style.gap = '1rem';
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

// ─────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
DB.init();
loadProducts();
updateCartUI();

// Close modal on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); if (document.getElementById('cartSidebar').classList.contains('open')) toggleCart(); }
});
