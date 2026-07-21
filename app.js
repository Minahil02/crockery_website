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
  whatsappNumber: '923267727448',   // ← your number

  // ── FORMSPREE (you get order email) ──────────
  // 1. Go to https://formspree.io → Sign Up free
  // 2. New Form → name it "Desi Panday Orders"
  // 3. Paste the endpoint below (looks like /f/xxxxxxxx)
  formspreeEndpoint: 'https://formspree.io/f/xjgnovpn',  // ← paste here

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

  // ── DELIVERY / SHIPPING ───────────────────────
  // Fee = zone base fee + (extra Rs. per kg for weight
  // above the zone's free allowance).
  // Edit these numbers any time — nothing else needs to change.
  delivery: {
    zones: {
      lahore: {
        label: 'Lahore',
        baseFee: 250,       // covers up to freeKg
        freeKg: 1,          // kg included in baseFee
        perKgFee: 100        // Rs. per kg beyond freeKg
      },
      other: {
        label: 'Rest of Pakistan',
        baseFee: 350,       // covers up to freeKg
        freeKg: 1,          // kg included in baseFee
        perKgFee: 150        // Rs. per kg beyond freeKg
      }
    },
    defaultZone: 'lahore'
  }
};

// ═══════════════════════════════════════════════
// PRODUCT DATA
// ═══════════════════════════════════════════════
const PRODUCT_SEED = [
  {
    id: 12, category: 'sets', badge: 'Bundle Deal',
    image: 'images/6-person-deal.jpg',
    name: '6-Person Pure Copper Dining Set',
    shortDesc: '6 glasses, 6 dishes, 6 spoons & 6 forks — complete dining set',
    fullDesc: 'A complete, healthy dining set for six — hand-hammered from 100% pure copper by our Lahore artisans. Includes 6 dishes, 6 glasses, 6 spoons, and 6 forks, rooted in Ayurvedic tradition for daily use or gifting. Everything your family needs for a healthy, elegant meal, all in one bundle at a special price.',
    price: 59999, originalPrice: 65000, material: '99.9% Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Ayurvedic-Inspired', dimensions: 'Dishes 20cm · Glasses 250ml · Spoons & Forks 14cm', weight: 3.6
  },
  {
    id: 13, category: 'sets', badge: 'Family Deal',
    image: 'images/4-person-deal.jpg',
    name: '4-Person Pure Copper Dining Set',
    shortDesc: '4 glasses, 4 plates, 4 spoons & 4 forks — complete dining set',
    fullDesc: 'A complete, healthy dining set for four — hand-hammered from 100% pure copper by our Lahore artisans. Includes 4 plates, 4 glasses, 4 spoons, and 4 forks, rooted in Ayurvedic tradition for daily use or gifting. A perfect size for smaller households, all in one bundle at a special price.',
    price: 39999, originalPrice: 42000, material: '99.9% Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Ayurvedic-Inspired', dimensions: 'Plates 20cm · Glasses 250ml · Spoons & Forks 14cm', weight: 2.4
  },
  {
    id: 10, category: 'bottles', badge: 'Top Seller',
    image: 'images/copper-water-bottle.jpg',
    name: 'Pure Copper Water Bottle — 600ml',
    shortDesc: 'Hand-hammered 100% pure copper bottle, perfect for daily use',
    fullDesc: 'Our signature pure copper water bottle, hand-hammered by Lahore artisans into a dimpled surface that catches the light. Rooted in Ayurvedic tradition, copper vessels are believed to aid digestion, boost immunity, and naturally purify water. Eco-friendly, reusable, and built to last a lifetime — a healthier, more elegant alternative to plastic. Also available in a 1 Litre size.',
    price: 5499, material: '99.9% Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Ayurvedic-Inspired', dimensions: '600ml capacity', weight: 0.3
  },
  {
    id: 11, category: 'bottles', badge: 'Top Seller',
    image: 'images/copper-water-bottle.jpg',
    name: 'Pure Copper Water Bottle — 1 Litre',
    shortDesc: 'Hand-hammered 100% pure copper bottle, ideal for long hours',
    fullDesc: 'Our signature pure copper water bottle in a larger 1 Litre size, hand-hammered by Lahore artisans into a dimpled surface that catches the light. Rooted in Ayurvedic tradition, copper vessels are believed to aid digestion, boost immunity, and naturally purify water. Eco-friendly, reusable, and built to last a lifetime — a healthier, more elegant alternative to plastic. Also available in a 600ml size.',
    price: 6999, material: '99.9% Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Ayurvedic-Inspired', dimensions: '1 Litre capacity', weight: 0.4
  },
  {
    id: 1, category: 'mugs', badge: 'Bestseller',
    image: 'images/1.jpg',
    name: 'Hammered Copper Glass',
    shortDesc: 'Hand-hammered pure copper, traditional lassi glass',
    fullDesc: 'This hand-hammered copper glass carries the ancient tradition of the subcontinent. Each dimple is struck individually by a craftsman\'s hammer, creating a surface that catches the light like a constellation. Perfect for lassi, water, or as a decorative piece.',
    price: 3300, material: 'Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Mughal-Inspired', dimensions: '10cm tall, 250ml', weight: 0.15
  },
  {
    id: 2, category: 'bowls', badge: null,
    image: 'images/12.jpg',
    name: 'Copper Katori Set (3 pcs)',
    shortDesc: 'Hammered copper katoris, silver-lined interior',
    fullDesc: 'A set of three traditional hammered copper katoris — the essential vessel of the desi thaal. Each katori is hand-beaten from copper sheet with a tin-lined interior for safe food contact. Used for centuries in wedding feasts and daily meals alike.',
    price: 3200, material: 'Copper with Tin Lining', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Mughal-Inspired', dimensions: '10cm diameter each', weight: 0.4
  },
  {
    id: 3, category: 'bowls', badge: null,
    image: 'images/15.jpg',
    name: 'Silver-Finish Katori Set (3 pcs)',
    shortDesc: 'Hammered metal katoris, pewter finish',
    fullDesc: 'Three katoris finished in a classic pewter-silver tone — the colour of old family heirlooms. Hand-hammered with a characteristic dimple pattern, these bowls are equally at home serving daal, achaar, or raita.',
    price: 2800, material: 'Hammered Metal, Pewter Finish', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Traditional', dimensions: '10cm diameter each', weight: 0.35
  },
  {
    id: 4, category: 'bowls', badge: 'New',
    image: 'images/16.jpg',
    name: 'Copper Bowl Set (3 pcs)',
    shortDesc: 'Rose copper bowls, polished interior',
    fullDesc: 'Three rose-copper bowls with a high-polish interior finish. The warm blush of polished copper transforms any dining table into a feast. Hand-beaten exteriors contrast beautifully with the gleaming inner surface.',
    price: 3500, material: 'Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering & Polishing', era: 'Traditional', dimensions: '12cm diameter each', weight: 0.45
  },
  {
    id: 5, category: 'plates', badge: 'Bestseller',
    image: 'images/19.jpg',
    name: 'Hammered Copper Thaal',
    shortDesc: 'Large copper serving plate, hand-hammered',
    fullDesc: 'The great thaal — centrepiece of every desi feast. This large copper plate is hand-hammered across its entire surface, creating a rippling effect that distributes light in every direction. Solid copper, built to last generations.',
    price: 6500, material: 'Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Mughal-Inspired', dimensions: '35cm diameter', weight: 0.9
  },
  {
    id: 6, category: 'plates', badge: 'Limited',
    image: 'images/20.jpg',
    name: 'Copper Thaal Dinner Set',
    shortDesc: 'Full thaal with katori & spoon — complete set',
    fullDesc: 'The complete desi dining experience. This set includes one large hammered copper thaal, two katoris, and a matching copper spoon — everything needed for a traditional meal. A perfect heirloom gift.',
    price: 9800, material: 'Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Traditional', dimensions: 'Thaal: 35cm, Katoris: 10cm', weight: 1.3
  },
  {
    id: 7, category: 'spoons', badge: null,
    image: 'images/34.jpg',
    name: 'Copper Tea Spoon',
    shortDesc: 'Single hand-finished copper spoon',
    fullDesc: 'A single copper tea spoon — slim, elegant, and finished by hand. The subtle warm glow of copper makes even the simplest ritual of stirring chai feel ceremonial.',
    price: 650, material: 'Copper-Finish Steel', origin: 'Lahore Workshop',
    technique: 'Hand Finishing', era: 'Traditional', dimensions: '14cm length', weight: 0.05
  },
  {
    id: 8, category: 'spoons', badge: null,
    image: 'images/32.jpg',
    name: 'Copper Spoon Pair',
    shortDesc: 'Two matching copper-finish spoons',
    fullDesc: 'A matched pair of copper-finish spoons, ideal for serving or everyday use. The warm rose-copper tone complements any traditional thaal or modern table setting.',
    price: 1200, material: 'Copper-Finish Steel', origin: 'Lahore Workshop',
    technique: 'Hand Finishing', era: 'Traditional', dimensions: '14cm length', weight: 0.1
  },
  {
    id: 9, category: 'spoons', badge: 'New',
    image: 'images/37.jpg',
    name: 'Copper Spoon Set (12 pcs)',
    shortDesc: 'Full dozen copper-finish spoons',
    fullDesc: 'A complete set of twelve copper-finish spoons — enough for a full family gathering or formal dinner. Uniform in shape, with the signature warm rose-copper tone.',
    price: 5500, material: 'Copper-Finish Steel', origin: 'Lahore Workshop',
    technique: 'Hand Finishing', era: 'Traditional', dimensions: '14cm length, set of 12', weight: 0.5
  }
];

// ═══════════════════════════════════════════════
// DATABASE (localStorage)
// ═══════════════════════════════════════════════
const DB = {
  _key: 'desipanday_db',
  _seedVersion: 10,  // bumped — updated 6-person & 4-person deal pricing
  init() {
    const existing = localStorage.getItem(this._key);
    let needSeed = !existing;
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        // Force reseed if version mismatch OR products missing/empty
        if (parsed._seedVersion !== this._seedVersion || !parsed.products || parsed.products.length === 0) {
          needSeed = true;
        }
      } catch (e) { needSeed = true; }
    }
    if (needSeed) {
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
      console.log('✅ Products loaded:', PRODUCT_SEED.length);
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
    const subtotal = items.reduce((s, i) => s + (i.price * i.qty), 0);
    const deliveryFee = customer.deliveryFee || 0;
    const total = subtotal + deliveryFee;
    const orderId = DB.saveOrder({ items, subtotal, deliveryFee, total, customer });
    return { ok: true, orderId, total };
  }
};

// ═══════════════════════════════════════════════
// 1. WHATSAPP — opens pre-filled message for you
//    Customer sees order details, taps Send.
//    You receive it on your WhatsApp instantly.
// ═══════════════════════════════════════════════
function openWhatsAppOrder(orderId, name, phone, address, note, items, total, deliveryFee, zoneLabel) {
  const itemLines = items.map(i =>
    `• ${i.name} ×${i.qty} = Rs.${(i.price * i.qty).toLocaleString()}`
  ).join('\n');
  const subtotal = items.reduce((s, i) => s + (i.price * i.qty), 0);

  const msg =
    `🏺 *New Order — Desi Panday*\n` +
    `Order ID: *${orderId}*\n\n` +
    `*Items:*\n${itemLines}\n\n` +
    `Subtotal: Rs. ${subtotal.toLocaleString()}\n` +
    `Delivery (${zoneLabel}): Rs. ${deliveryFee.toLocaleString()}\n` +
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
async function notifyShopByEmail(orderId, name, phone, address, items, total, deliveryFee, zoneLabel) {
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
        delivery_zone: zoneLabel,
        delivery_fee: `Rs. ${deliveryFee.toLocaleString()}`,
        items: itemLines,
        total: `Rs. ${total.toLocaleString()}`
      })
    });
  } catch (e) { console.log('Formspree error:', e); }
}

// ═══════════════════════════════════════════════
// 3. EMAILJS — sends confirmation email to CUSTOMER
// ═══════════════════════════════════════════════
async function sendConfirmationEmail(orderId, name, email, phone, items, total, deliveryFee, zoneLabel) {
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
        delivery_zone:  zoneLabel,
        delivery_fee:   `Rs. ${deliveryFee.toLocaleString()}`,
        order_total:    `Rs. ${total.toLocaleString()}`,
        shop_name:      CONFIG.shopName,
        shop_phone:     CONFIG.shopPhone,
        shop_email:     CONFIG.shopEmail,
      }
    );
    console.log('✅ Confirmation email sent to', email);
  } catch (e) { console.error('❌ EmailJS error:', e); }
}

function cartTotalWeight(items) {
  return items.reduce((s, i) => s + ((i.weight || 0) * i.qty), 0);
}

function calcDeliveryFee(zoneKey, totalWeight) {
  const zone = CONFIG.delivery.zones[zoneKey] || CONFIG.delivery.zones[CONFIG.delivery.defaultZone];
  const extraKg = Math.max(0, totalWeight - zone.freeKg);
  const fee = zone.baseFee + Math.ceil(extraKg) * zone.perKgFee;
  return { fee, zone };
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
  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const totalWeight = cartTotalWeight(cart);
  const initialZone = CONFIG.delivery.defaultZone;
  const { fee: initialFee } = calcDeliveryFee(initialZone, totalWeight);

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
        <div class="co-item"><span>Subtotal</span><span id="coSubtotal">Rs. ${subtotal.toLocaleString()}</span></div>
        <div class="co-item"><span>Delivery (<span id="coWeightLabel">${totalWeight.toFixed(2)}kg</span>)</span><span id="coDeliveryFee">Rs. ${initialFee.toLocaleString()}</span></div>
        <div class="co-total"><span>Total</span><span id="coGrandTotal">Rs. ${(subtotal + initialFee).toLocaleString()}</span></div>
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
          <select id="coZone" onchange="updateDeliveryDisplay()">
            ${Object.entries(CONFIG.delivery.zones).map(([key, z]) =>
              `<option value="${key}" ${key === initialZone ? 'selected' : ''}>Delivery to: ${z.label}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-group">
          <textarea id="coAddress" rows="2"  placeholder="Delivery Address *"></textarea>
        </div>
        <div class="form-group">
          <textarea id="coNote"    rows="2"  placeholder="Special instructions? (optional)"></textarea>
        </div>
        <button class="btn btn-primary full" id="coBtn" onclick="confirmOrder()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               style="vertical-align:middle;margin-right:8px">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          Place Order
        </button>
        <p style="font-size:0.72rem;opacity:0.65;text-align:center;margin-top:0.6rem;line-height:1.5">
          Your order is placed directly with us — no WhatsApp required.
          We'll confirm by phone or email shortly.
        </p>
        <div id="coSuccess" class="co-success" style="display:none"></div>
      </div>
    </div>
  `;

  document.getElementById('checkoutModalOverlay').classList.add('open');
  document.getElementById('checkoutModal').classList.add('open');
}

function updateDeliveryDisplay() {
  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const totalWeight = cartTotalWeight(cart);
  const zoneKey = document.getElementById('coZone').value;
  const { fee } = calcDeliveryFee(zoneKey, totalWeight);
  document.getElementById('coDeliveryFee').textContent = `Rs. ${fee.toLocaleString()}`;
  document.getElementById('coGrandTotal').textContent = `Rs. ${(subtotal + fee).toLocaleString()}`;
}

async function confirmOrder() {
  const name    = document.getElementById('coName').value.trim();
  const phone   = document.getElementById('coPhone').value.trim();
  const email   = document.getElementById('coEmail').value.trim();
  const zoneKey = document.getElementById('coZone').value;
  const address = document.getElementById('coAddress').value.trim();
  const note    = document.getElementById('coNote').value.trim();

  if (!name || !phone || !address) {
    showToast('✦ Please fill in your name, phone and address');
    return;
  }

  const btn = document.getElementById('coBtn');
  btn.disabled = true;
  btn.innerHTML = 'Processing…';

  const totalWeight = cartTotalWeight(cart);
  const { fee: deliveryFee, zone } = calcDeliveryFee(zoneKey, totalWeight);

  // Save order locally
  const res = await API.placeOrder(cart, { name, phone, email, address, note, zone: zone.label, deliveryFee });
  const grandTotal = res.total;

  if (res.ok) {
    const orderedItems = [...cart];
    cart = [];
    saveCart();
    updateCartUI();

    // 1. Notify shop via Formspree email (set CONFIG.formspreeEndpoint above)
    await notifyShopByEmail(res.orderId, name, phone, address, orderedItems, grandTotal, deliveryFee, zone.label);

    // 2. Send confirmation email to customer (if email given)
    await sendConfirmationEmail(res.orderId, name, email, phone, orderedItems, grandTotal, deliveryFee, zone.label);

    // 3. Order is placed on the website itself — no WhatsApp redirect.
    //    Save the order reference and take the customer to the
    //    confirmation page.
    localStorage.setItem('lastOrderRef', res.orderId);
    window.location.href = 'Thankyou.html?ref=' + encodeURIComponent(res.orderId);
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
          <div class="card-price-row">
            <span class="card-price">Rs. ${p.price.toLocaleString()}</span>
            ${p.originalPrice ? `<span class="card-price-original">Rs. ${p.originalPrice.toLocaleString()}</span>` : ''}
          </div>
          <button class="card-add" onclick="event.stopPropagation(); quickAdd(${p.id})">Add</button>
        </div>
        ${p.originalPrice ? `<span class="card-savings">You save Rs. ${(p.originalPrice - p.price).toLocaleString()}</span>` : ''}
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
           style="width:100%;height:100%;object-fit:contain;padding:1.5rem;box-sizing:border-box"
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
      <div class="modal-price">${currentProduct.originalPrice ? `<span class="modal-price-original">Rs. ${currentProduct.originalPrice.toLocaleString()}</span>` : ''}Rs. ${currentProduct.price.toLocaleString()}</div>
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