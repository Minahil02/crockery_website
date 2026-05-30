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
  formspreeEndpoint: 'https://formspree.io/f/xqejeppk',  // ← your endpoint

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
async function notifyShopByEmail(orderId, name, phone, address, deliveryTime, items, total, note) {
  if (!CONFIG.formspreeEndpoint || CONFIG.formspreeEndpoint.includes('YOUR_FORM_ID')) return;
  const itemLines = items.map(i =>
    `${i.name} x${i.qty} = Rs.${(i.price * i.qty).toLocaleString()}`
  ).join('\n');
  try {
    await fetch(CONFIG.formspreeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `🏺 NEW COD ORDER ${orderId} — Desi Panday`,
        order_id:         orderId,
        payment_method:   'Cash on Delivery',
        customer_name:    name,
        customer_phone:   phone,
        delivery_address: address,
        preferred_time:   deliveryTime,
        items:            itemLines,
        total:            `Rs. ${total.toLocaleString()}`,
        note:             note || '—'
      })
    });
  } catch (e) { console.log('Formspree error:', e); }
}

// Silent WhatsApp notification to shop owner (opens in background tab)
function notifyShopWhatsApp(orderId, name, phone, address, deliveryTime, note, items, total) {
  const itemLines = items.map(i =>
    `  • ${i.name} ×${i.qty} = Rs.${(i.price * i.qty).toLocaleString()}`
  ).join('\n');

  const msg =
    `🏺 *NEW ORDER — Desi Panday*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 Order: *${orderId}*\n` +
    `💵 Payment: *Cash on Delivery*\n\n` +
    `📦 *Items:*\n${itemLines}\n` +
    `💰 *Total: Rs. ${total.toLocaleString()}*\n\n` +
    `👤 *Customer:*\n` +
    `  Name: ${name}\n` +
    `  Phone: ${phone}\n` +
    `  Address: ${address}\n` +
    `  Preferred Time: ${deliveryTime}` +
    (note ? `\n  Note: ${note}` : '') +
    `\n\n📞 _Please call to confirm delivery._`;

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
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
      <div class="co-header-left">
        <div class="co-cod-badge">🚚 Cash on Delivery</div>
        <h3>Complete Your Order</h3>
      </div>
      <button class="co-close" onclick="closeCheckoutModal()">✕</button>
    </div>
    <div class="co-body">

      <div class="co-summary">
        <div class="co-summary-title">📦 Order Summary</div>
        ${cart.map(i => `
          <div class="co-item">
            <span>${i.name} <span class="co-qty">×${i.qty}</span></span>
            <span class="co-item-price">Rs. ${(i.price * i.qty).toLocaleString()}</span>
          </div>
        `).join('')}
        <div class="co-total">
          <span>Total Payable on Delivery</span>
          <span>Rs. ${total.toLocaleString()}</span>
        </div>
        <div class="co-cod-note">💵 Pay cash when your order arrives. No advance payment needed.</div>
      </div>

      <div class="co-form">
        <div class="co-form-title">📋 Your Details</div>

        <div class="form-group">
          <label class="co-label">Full Name *</label>
          <input type="text" id="coName" placeholder="e.g. Ahmed Khan" />
        </div>

        <div class="form-group">
          <label class="co-label">Phone Number *</label>
          <input type="tel" id="coPhone" placeholder="e.g. 0300 1234567" />
          <div class="co-field-hint">We'll call this number to confirm your order</div>
        </div>

        <div class="form-group">
          <label class="co-label">Delivery Address *</label>
          <textarea id="coAddress" rows="3" placeholder="House/flat no., street, area, city…"></textarea>
        </div>

        <div class="form-group">
          <label class="co-label">Preferred Delivery Time *</label>
          <select id="coDeliveryTime">
            <option value="">— Select a time slot —</option>
            <option value="Morning (9am – 12pm)">🌅 Morning (9am – 12pm)</option>
            <option value="Afternoon (12pm – 4pm)">☀️ Afternoon (12pm – 4pm)</option>
            <option value="Evening (4pm – 8pm)">🌆 Evening (4pm – 8pm)</option>
            <option value="Anytime">✅ Anytime — whatever suits you</option>
          </select>
        </div>

        <div class="form-group">
          <label class="co-label">Special Instructions <span style="opacity:0.6">(optional)</span></label>
          <textarea id="coNote" rows="2" placeholder="Gift wrapping, fragile handling, landmark near address…"></textarea>
        </div>

        <button class="btn btn-primary full co-submit-btn" id="coBtn" onclick="confirmOrder()">
          ✦ &nbsp; Place Order (Cash on Delivery)
        </button>

        <div class="co-reassurance">
          <span>🔒 No payment now</span>
          <span>📞 We call to confirm</span>
          <span>🚚 Delivered to your door</span>
        </div>

        <div id="coSuccess" class="co-success" style="display:none"></div>
      </div>
    </div>
  `;

  document.getElementById('checkoutModalOverlay').classList.add('open');
  document.getElementById('checkoutModal').classList.add('open');
}

async function confirmOrder() {
  const name         = document.getElementById('coName').value.trim();
  const phone        = document.getElementById('coPhone').value.trim();
  const address      = document.getElementById('coAddress').value.trim();
  const deliveryTime = document.getElementById('coDeliveryTime').value;
  const note         = document.getElementById('coNote').value.trim();

  if (!name)         { showToast('✦ Please enter your full name'); return; }
  if (!phone)        { showToast('✦ Please enter your phone number'); return; }
  if (!address)      { showToast('✦ Please enter your delivery address'); return; }
  if (!deliveryTime) { showToast('✦ Please select a preferred delivery time'); return; }

  const btn = document.getElementById('coBtn');
  btn.disabled = true;
  btn.innerHTML = '⏳ Placing your order…';

  const res = await API.placeOrder(cart, { name, phone, address, deliveryTime, note });

  if (res.ok) {
    const orderedItems = [...cart];
    cart = [];
    saveCart();
    updateCartUI();

    // Notify you (shop owner) via Formspree email
    await notifyShopByEmail(res.orderId, name, phone, address, deliveryTime, orderedItems, res.total, note);

    // Also ping your WhatsApp silently with order details
    notifyShopWhatsApp(res.orderId, name, phone, address, deliveryTime, note, orderedItems, res.total);

    btn.style.display = 'none';
    const successEl = document.getElementById('coSuccess');
    successEl.style.display = 'block';
    successEl.innerHTML = `
      <div class="co-success-inner">
        <div class="co-success-icon">✦</div>
        <strong>Order ${res.orderId} Placed!</strong>
        <p>Thank you, <strong>${name}</strong>! Your order has been received.</p>
        <div class="co-success-details">
          <div>📞 We'll call <strong>${phone}</strong> to confirm</div>
          <div>🚚 Delivery: <strong>${deliveryTime}</strong></div>
          <div>💵 Pay <strong>Rs. ${res.total.toLocaleString()}</strong> on delivery</div>
        </div>
        <button class="btn btn-ghost" onclick="closeCheckoutModal()" style="margin-top:1.2rem;width:100%">Done ✓</button>
      </div>
    `;
  } else {
    btn.disabled = false;
    btn.innerHTML = '✦ &nbsp; Place Order (Cash on Delivery)';
    showToast('Something went wrong. Please try again.');
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

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const phone   = document.querySelector('#contactForm [name="phone"]')?.value.trim() || '';
  const type    = document.getElementById('ftype').value;
  const message = document.getElementById('fmessage').value.trim();

  // Save locally
  DB.saveEnquiry({ name, email, type, message });

  // Send to Formspree — real email to you
  try {
    const res = await fetch(CONFIG.formspreeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name, email, phone,
        enquiry_type: type || 'General',
        message,
        _subject: `New Enquiry from ${name} — DeSi Paanday`
      })
    });
    if (!res.ok) throw new Error('Formspree failed');
  } catch (err) {
    // Fallback: open WhatsApp with the enquiry
    const waMsg = `New Enquiry from website:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nType: ${type}\nMessage: ${message}`;
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`, '_blank');
  }

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