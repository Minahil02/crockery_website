/* ═══════════════════════════════════════════════
   Desi PanDay — app.js  (Complete Final Version)
   WhatsApp Order + EmailJS Customer Confirmation
   ═══════════════════════════════════════════════ */

'use strict';

// ╔══════════════════════════════════════════════╗
// ║         ⚙️  YOUR CONFIGURATION               ║
// ║   Fill these in — everything else is done    ║
// ╚══════════════════════════════════════════════╝
const CONFIG = {

  // ── YOUR WHATSAPP NUMBER ──────────────────────
  // Customer clicks "Order via WhatsApp" and a
  // pre-filled message opens in WhatsApp for you.
  // No API needed — just put your number below.
  // Format: country code + number, no + or spaces
  // Pakistan example: 923241234567
  whatsappNumber: '923248825813',   // ← your number

  // ── FORMSPREE (you get order email) ──────────
  // 1. Go to https://formspree.io → Sign Up free
  // 2. New Form → name it "Desi Panday Orders"
  // 3. Paste the endpoint below (looks like /f/xxxxxxxx)
  formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',  // ← paste here

  // ── EMAILJS (customer gets confirmation email) ─
  // 1. Go to https://emailjs.com → Sign Up free
  // 2. Email Services → Add Service → Gmail
  //    → When Google asks for permission, tick ALL boxes
  // 3. Email Templates → Create Template
  //    Subject: "Your Desi Panday Order is Confirmed!"
  //    Body: use the variables below:
  //    Dear {{customer_name}},
  //    Your order {{order_id}} is confirmed!
  //    Items: {{order_items}}
  //    Total: {{order_total}}
  //    We will contact you on {{customer_phone}} for delivery.
  //    Thank you! — Desi Panday ({{shop_phone}})
  // 4. Set "To Email" field to: {{to_email}}
  // 5. Account page → copy Public Key
  emailjs: {
    serviceId:  'service_0qomaoh',
    templateId: 'template_v7xx188',
    publicKey:  'uR8ppRJai5yn5p_oX',
  },

  // ── SHOP INFO ─────────────────────────────────
  shopName:  'Desi Panday',
  shopPhone: '+92 324 8825813',
  shopEmail: 'desipanday953@gmail.com',
};

// ═══════════════════════════════════════════════
// PRODUCT DATA
// ═══════════════════════════════════════════════
const PRODUCT_SEED = [
  {
    id: 1, category: 'mugs', badge: 'Bestseller',
    image: 'images/1.jpg',
    name: 'Hammered Copper Glass',
    shortDesc: 'Hand-hammered pure copper, traditional lassi glass',
    fullDesc: 'This hand-hammered copper glass carries the ancient tradition of the subcontinent. Each dimple is struck individually by a craftsman\'s hammer, creating a surface that catches the light like a constellation. Perfect for lassi, water, or as a decorative piece.',
    price: 1800, material: 'Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Mughal-Inspired', dimensions: '10cm tall, 250ml'
  },
  {
    id: 2, category: 'bowls', badge: null,
    image: 'images/12.jpg',
    name: 'Brass Katori Set (3 pcs)',
    shortDesc: 'Hammered brass katoris, silver-lined interior',
    fullDesc: 'A set of three traditional hammered brass katoris — the essential vessel of the desi thaal. Each katori is hand-beaten from brass sheet with a tin-lined interior for safe food contact. Used for centuries in wedding feasts and daily meals alike.',
    price: 3200, material: 'Brass with Tin Lining', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Mughal-Inspired', dimensions: '10cm diameter each'
  },
  {
    id: 3, category: 'bowls', badge: null,
    image: 'images/15.jpg',
    name: 'Silver-Finish Katori Set (3 pcs)',
    shortDesc: 'Hammered metal katoris, pewter finish',
    fullDesc: 'Three katoris finished in a classic pewter-silver tone — the colour of old family heirlooms. Hand-hammered with a characteristic dimple pattern, these bowls are equally at home serving daal, achaar, or raita.',
    price: 2800, material: 'Hammered Metal, Pewter Finish', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Traditional', dimensions: '10cm diameter each'
  },
  {
    id: 4, category: 'bowls', badge: 'New',
    image: 'images/16.jpg',
    name: 'Copper Bowl Set (3 pcs)',
    shortDesc: 'Rose copper bowls, polished interior',
    fullDesc: 'Three rose-copper bowls with a high-polish interior finish. The warm blush of polished copper transforms any dining table into a feast. Hand-beaten exteriors contrast beautifully with the gleaming inner surface.',
    price: 3500, material: 'Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering & Polishing', era: 'Traditional', dimensions: '12cm diameter each'
  },
  {
    id: 5, category: 'plates', badge: 'Bestseller',
    image: 'images/19.jpg',
    name: 'Hammered Copper Thaal',
    shortDesc: 'Large copper serving plate, hand-hammered',
    fullDesc: 'The great thaal — centrepiece of every desi feast. This large copper plate is hand-hammered across its entire surface, creating a rippling effect that distributes light in every direction. Solid copper, built to last generations.',
    price: 6500, material: 'Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Mughal-Inspired', dimensions: '35cm diameter'
  },
  {
    id: 6, category: 'plates', badge: 'Limited',
    image: 'images/20.jpg',
    name: 'Copper Thaal Dinner Set',
    shortDesc: 'Full thaal with katori & spoon — complete set',
    fullDesc: 'The complete desi dining experience. This set includes one large hammered copper thaal, two katoris, and a matching copper spoon — everything needed for a traditional meal. A perfect heirloom gift.',
    price: 9800, material: 'Pure Copper & Brass', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Traditional', dimensions: 'Thaal: 35cm, Katoris: 10cm'
  },
  {
    id: 7, category: 'spoons', badge: null,
    image: 'images/34.jpg',
    name: 'Copper Tea Spoon',
    shortDesc: 'Single hand-finished copper spoon',
    fullDesc: 'A single copper tea spoon — slim, elegant, and finished by hand. The subtle warm glow of copper makes even the simplest ritual of stirring chai feel ceremonial.',
    price: 650, material: 'Copper-Finish Steel', origin: 'Lahore Workshop',
    technique: 'Hand Finishing', era: 'Traditional', dimensions: '14cm length'
  },
  {
    id: 8, category: 'spoons', badge: null,
    image: 'images/32.jpg',
    name: 'Copper Spoon Pair',
    shortDesc: 'Two matching copper-finish spoons',
    fullDesc: 'A matched pair of copper-finish spoons, ideal for serving or everyday use. The warm rose-copper tone complements any traditional thaal or modern table setting.',
    price: 1200, material: 'Copper-Finish Steel', origin: 'Lahore Workshop',
    technique: 'Hand Finishing', era: 'Traditional', dimensions: '14cm length'
  },
  {
    id: 9, category: 'spoons', badge: 'New',
    image: 'images/37.jpg',
    name: 'Copper Spoon Set (12 pcs)',
    shortDesc: 'Full dozen copper-finish spoons',
    fullDesc: 'A complete set of twelve copper-finish spoons — enough for a full family gathering or formal dinner. Uniform in shape, with the signature warm rose-copper tone.',
    price: 5500, material: 'Copper-Finish Steel', origin: 'Lahore Workshop',
    technique: 'Hand Finishing', era: 'Traditional', dimensions: '14cm length, set of 12'
  }
];

// ═══════════════════════════════════════════════
// DATABASE (localStorage)
// ═══════════════════════════════════════════════
const DB = {
  _key: 'desipanday_db',
  _seedVersion: 2,  // bump this whenever PRODUCT_SEED changes — forces localStorage refresh
  init() {
    const existing = localStorage.getItem(this._key);
    let needSeed = !existing;
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (parsed._seedVersion !== this._seedVersion) needSeed = true;
      } catch (e) { needSeed = true; }
    }
    if (needSeed) {
      // Preserve orders & enquiries on re-seed, only refresh products
      let preserved = { orders: [], enquiries: [], nextOrderId: 1 };
      try {
        const old = JSON.parse(existing || '{}');
        preserved = {
          orders: old.orders || [],
          enquiries: old.enquiries || [],
          nextOrderId: old.nextOrderId || 1
        };
      } catch (e) {}
      localStorage.setItem(this._key, JSON.stringify({
        _seedVersion: this._seedVersion,
        products: PRODUCT_SEED,
        ...preserved
      }));
    }
    return this;
  },
  read() { return JSON.parse(localStorage.getItem(this._key)); },
  write(data) { localStorage.setItem(this._key, JSON.stringify(data)); },
  getProducts(filter = 'all') {
    const db = this.read();
    return filter === 'all' ? db.products : db.products.filter(p => p.category === filter);
  },
  getProduct(id) { return this.read().products.find(p => p.id === id) || null; },
  saveEnquiry(e) {
    const db = this.read();
    db.enquiries.push({ ...e, id: Date.now(), date: new Date().toISOString() });
    this.write(db);
  },
  saveOrder(order) {
    const db = this.read();
    const id = `DP-${String(db.nextOrderId).padStart(4, '0')}`;
    db.orders.push({ ...order, id, date: new Date().toISOString(), status: 'Confirmed' });
    db.nextOrderId++;
    this.write(db);
    return id;
  }
};

// ═══════════════════════════════════════════════
// MOCK API
// ═══════════════════════════════════════════════
const API = {
  async getProducts(filter = 'all') { await delay(80); return { ok: true, data: DB.getProducts(filter) }; },
  async getProduct(id) { await delay(60); const p = DB.getProduct(id); return p ? { ok: true, data: p } : { ok: false }; },
  async submitEnquiry(payload) { await delay(500); DB.saveEnquiry(payload); return { ok: true }; },
  async placeOrder(items, customer) {
    await delay(300);
    const total = items.reduce((s, i) => s + (i.price * i.qty), 0);
    const orderId = DB.saveOrder({ items, total, customer });
    return { ok: true, orderId, total };
  }
};

// ═══════════════════════════════════════════════
// 1. WHATSAPP — opens pre-filled message for you
//    Customer sees order details, taps Send.
//    You receive it on your WhatsApp instantly.
// ═══════════════════════════════════════════════
function openWhatsAppOrder(orderId, name, phone, address, note, items, total) {
  const itemLines = items.map(i =>
    `• ${i.name} ×${i.qty} = Rs.${(i.price * i.qty).toLocaleString()}`
  ).join('\n');

  const msg =
    `🏺 *New Order — Desi Panday*\n` +
    `Order ID: *${orderId}*\n\n` +
    `*Items:*\n${itemLines}\n\n` +
    `*Total: Rs. ${total.toLocaleString()}*\n\n` +
    `*Customer:*\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Address: ${address}` +
    (note ? `\nNote: ${note}` : '');

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ═══════════════════════════════════════════════
// 2. FORMSPREE — sends order details to YOUR email
// ═══════════════════════════════════════════════
async function notifyShopByEmail(orderId, name, phone, address, items, total) {
  if (CONFIG.formspreeEndpoint.includes('YOUR_FORM_ID')) return;
  const itemLines = items.map(i =>
    `${i.name} x${i.qty} = Rs.${(i.price * i.qty).toLocaleString()}`
  ).join('\n');
  try {
    await fetch(CONFIG.formspreeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `🏺 NEW ORDER ${orderId} — Desi Panday`,
        order_id: orderId,
        customer_name: name,
        customer_phone: phone,
        delivery_address: address,
        items: itemLines,
        total: `Rs. ${total.toLocaleString()}`
      })
    });
  } catch (e) { console.log('Formspree error:', e); }
}

// ═══════════════════════════════════════════════
// 3. EMAILJS — sends confirmation email to CUSTOMER
// ═══════════════════════════════════════════════
async function sendConfirmationEmail(orderId, name, email, phone, items, total) {
  if (!email) return;
  if (typeof emailjs === 'undefined') { console.error('EmailJS not loaded'); return; }

  const itemLines = items.map(i =>
    `${i.name} x${i.qty}  —  Rs.${(i.price * i.qty).toLocaleString()}`
  ).join('\n');

  try {
    await emailjs.send(
      CONFIG.emailjs.serviceId,
      CONFIG.emailjs.templateId,
      {
        to_email:       email,
        customer_name:  name,
        customer_phone: phone,
        order_id:       orderId,
        order_items:    itemLines,
        order_total:    `Rs. ${total.toLocaleString()}`,
        shop_name:      CONFIG.shopName,
        shop_phone:     CONFIG.shopPhone,
        shop_email:     CONFIG.shopEmail,
      }
    );
    console.log('✅ Confirmation email sent to', email);
  } catch (e) { console.error('❌ EmailJS error:', e); }
}

// ═══════════════════════════════════════════════
// CART
// ═══════════════════════════════════════════════
let cart = JSON.parse(localStorage.getItem('desipanday_cart') || '[]');

function saveCart() { localStorage.setItem('desipanday_cart', JSON.stringify(cart)); }

function addToCart(product, qty = 1) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.qty += qty;
  else cart.push({ ...product, qty });
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
  const footer    = document.getElementById('cartFooter');

  if (!cart.length) {
    container.innerHTML = '<div class="cart-empty">Your cart is empty, yet the craftsman awaits.</div>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}"
             onerror="this.parentElement.innerHTML='<div style=font-size:1.8rem;text-align:center>🏺</div>'">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">Rs. ${(item.price * item.qty).toLocaleString()} ×${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  document.getElementById('cartTotal').textContent =
    `Rs. ${cart.reduce((s, i) => s + (i.price * i.qty), 0).toLocaleString()}`;
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// ═══════════════════════════════════════════════
// CHECKOUT MODAL
// ═══════════════════════════════════════════════
function checkout() {
  if (!cart.length) return;
  toggleCart();
  const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  document.getElementById('checkoutModalContent').innerHTML = `
    <div class="co-header">
      <h3>✦ Complete Your Order</h3>
      <button class="co-close" onclick="closeCheckoutModal()">✕</button>
    </div>
    <div class="co-body">
      <div class="co-summary">
        <div class="co-summary-title">Order Summary</div>
        ${cart.map(i => `
          <div class="co-item">
            <span>${i.name} ×${i.qty}</span>
            <span>Rs. ${(i.price * i.qty).toLocaleString()}</span>
          </div>
        `).join('')}
        <div class="co-total"><span>Total</span><span>Rs. ${total.toLocaleString()}</span></div>
      </div>
      <div class="co-form">
        <div class="co-form-title">Your Details</div>
        <div class="form-group">
          <input type="text"  id="coName"    placeholder="Full Name *" />
        </div>
        <div class="form-group">
          <input type="tel"   id="coPhone"   placeholder="WhatsApp / Phone Number *" />
        </div>
        <div class="form-group">
          <input type="email" id="coEmail"   placeholder="Email (for confirmation — optional)" />
        </div>
        <div class="form-group">
          <textarea id="coAddress" rows="2"  placeholder="Delivery Address *"></textarea>
        </div>
        <div class="form-group">
          <textarea id="coNote"    rows="2"  placeholder="Special instructions? (optional)"></textarea>
        </div>
        <button class="btn btn-primary full" id="coBtn" onclick="confirmOrder()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
               style="vertical-align:middle;margin-right:8px">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Order via WhatsApp
        </button>
        <div id="coSuccess" class="co-success" style="display:none"></div>
      </div>
    </div>
  `;

  document.getElementById('checkoutModalOverlay').classList.add('open');
  document.getElementById('checkoutModal').classList.add('open');
}

async function confirmOrder() {
  const name    = document.getElementById('coName').value.trim();
  const phone   = document.getElementById('coPhone').value.trim();
  const email   = document.getElementById('coEmail').value.trim();
  const address = document.getElementById('coAddress').value.trim();
  const note    = document.getElementById('coNote').value.trim();

  if (!name || !phone || !address) {
    showToast('✦ Please fill in your name, phone and address');
    return;
  }

  const btn = document.getElementById('coBtn');
  btn.disabled = true;
  btn.innerHTML = 'Processing…';

  // Save order locally
  const res = await API.placeOrder(cart, { name, phone, email, address, note });

  if (res.ok) {
    const orderedItems = [...cart];
    cart = [];
    saveCart();
    updateCartUI();

    // 1. Notify shop via Formspree email
    await notifyShopByEmail(res.orderId, name, phone, address, orderedItems, res.total);

    // 2. Send confirmation email to customer (if email given)
    await sendConfirmationEmail(res.orderId, name, email, phone, orderedItems, res.total);

    // 3. Open WhatsApp with pre-filled order message
    openWhatsAppOrder(res.orderId, name, phone, address, note, orderedItems, res.total);

    // Show success
    document.getElementById('coSuccess').style.display = 'block';
    document.getElementById('coSuccess').innerHTML = `
      <div class="co-success-inner">
        <div class="co-success-icon">✦</div>
        <strong>Order ${res.orderId} Confirmed!</strong>
        <p>WhatsApp is opening with your order details.</p>
        <p>Just tap <strong>Send</strong> to complete your order.</p>
        ${email ? `<p style="font-size:0.85rem;opacity:0.75">A confirmation email is being sent to ${email}</p>` : ''}
        <button class="btn btn-ghost" onclick="closeCheckoutModal()" style="margin-top:1rem;width:100%">Close</button>
      </div>
    `;
    btn.style.display = 'none';
  }
}

function closeCheckoutModal() {
  document.getElementById('checkoutModalOverlay').classList.remove('open');
  document.getElementById('checkoutModal').classList.remove('open');
}

// ═══════════════════════════════════════════════
// PRODUCT GRID
// ═══════════════════════════════════════════════
async function loadProducts(filter = 'all') {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '<div style="text-align:center;padding:3rem;font-style:italic;color:var(--umber-l)">Loading collection…</div>';
  const res = await API.getProducts(filter);
  if (!res.ok) return;

  grid.innerHTML = res.data.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 0.07}s" onclick="openModal(${p.id})">
      <div class="card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy"
             onerror="this.outerHTML='<div style=font-size:5rem;text-align:center;padding:2rem>🏺</div>'">
        ${p.badge ? `<div class="card-badge">${p.badge}</div>` : ''}
      </div>
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.shortDesc}</div>
        <div class="card-footer">
          <span class="card-price">Rs. ${p.price.toLocaleString()}</span>
          <button class="card-add" onclick="event.stopPropagation(); quickAdd(${p.id})">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

function quickAdd(id) {
  const p = DB.getProduct(id);
  if (p) addToCart(p, 1);
}

// ═══════════════════════════════════════════════
// PRODUCT MODAL
// ═══════════════════════════════════════════════
let currentProduct = null, modalQty = 1;

async function openModal(id) {
  const res = await API.getProduct(id);
  if (!res.ok) return;
  currentProduct = res.data;
  modalQty = 1;

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-img">
      <img src="${currentProduct.image}" alt="${currentProduct.name}"
           style="width:100%;height:100%;object-fit:cover"
           onerror="this.outerHTML='<span style=font-size:6rem>🏺</span>'">
    </div>
    <div class="modal-body">
      <div class="modal-category">${currentProduct.category} · ${currentProduct.era}</div>
      <div class="modal-name">${currentProduct.name}</div>
      <div class="modal-desc">${currentProduct.fullDesc}</div>
      <div class="modal-details">
        <div class="modal-detail-row"><span>Material</span><span>${currentProduct.material}</span></div>
        <div class="modal-detail-row"><span>Technique</span><span>${currentProduct.technique}</span></div>
        <div class="modal-detail-row"><span>Dimensions</span><span>${currentProduct.dimensions}</span></div>
        <div class="modal-detail-row"><span>Origin</span><span>${currentProduct.origin}</span></div>
      </div>
      <div class="modal-price">Rs. ${currentProduct.price.toLocaleString()}</div>
      <div class="modal-qty">
        <button class="qty-btn" onclick="changeQty(-1)">−</button>
        <span class="qty-val" id="modalQtyDisplay">1</span>
        <button class="qty-btn" onclick="changeQty(1)">+</button>
      </div>
      <button class="btn btn-primary full" onclick="addToCartFromModal()">Add to Selection</button>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('productModal').classList.add('open');
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

// ═══════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadProducts(btn.dataset.filter);
  });
});

// ═══════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('[type="submit"]');
  btn.textContent = 'Sending…'; btn.disabled = true;
  await API.submitEnquiry({
    name:    document.getElementById('fname').value,
    email:   document.getElementById('femail').value,
    type:    document.getElementById('ftype').value,
    message: document.getElementById('fmessage').value
  });
  btn.textContent = 'Send Message'; btn.disabled = false;
  document.getElementById('formSuccess').classList.add('show');
  e.target.reset();
  setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 6000);
});

// ═══════════════════════════════════════════════
// NAV + MISC
// ═══════════════════════════════════════════════
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

function toggleMenu() {
  const links   = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');
  if (!links || !overlay) return;
  const isOpen = links.classList.contains('mobile-open');
  if (isOpen) {
    closeMenu();
  } else {
    links.classList.add('mobile-open');
    overlay.style.display = 'block';
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }
}

function closeMenu() {
  const links   = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');
  if (!links || !overlay) return;
  links.classList.remove('mobile-open');
  overlay.classList.remove('open');
  setTimeout(() => { overlay.style.display = 'none'; }, 320);
  document.body.style.overflow = '';
}

let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal(); closeCheckoutModal();
    if (document.getElementById('cartSidebar').classList.contains('open')) toggleCart();
  }
});

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════
DB.init();
loadProducts();
updateCartUI();

// Initialize EmailJS — must run once after the script loads
if (typeof emailjs !== 'undefined') {
  emailjs.init(CONFIG.emailjs.publicKey);
} else {
  console.error('EmailJS not loaded — check the <script> tag in index.html');
}