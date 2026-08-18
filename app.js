/* ═══════════════════════════════════════════════
   Desi PanDay — app.js  (Complete Final Version)
   Direct Website Checkout + EmailJS Order Emails
   (customer confirmation + shop owner notification)
   ═══════════════════════════════════════════════ */

'use strict';

// ╔══════════════════════════════════════════════╗
// ║         ⚙️  YOUR CONFIGURATION               ║
// ║   Fill these in — everything else is done    ║
// ╚══════════════════════════════════════════════╝
const CONFIG = {

  // ── FORMSPREE (optional extra: you get order email) ──
  // 1. Go to https://formspree.io → Sign Up free
  // 2. New Form → name it "Desi Panday Orders"
  // 3. Paste the endpoint below (looks like /f/xxxxxxxx)
  // Leave as-is (with YOUR_FORM_ID) to skip this — it's optional
  // since the EmailJS owner notification below already emails you.
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
  //
  // ── EMAILJS (YOU get notified of every new order) ─
  // Create a SECOND template on the same EmailJS service, e.g.:
  //    Subject: "🏺 New Order {{order_id}} — Desi Panday"
  //    Body:
  //    New order received!
  //    Order ID: {{order_id}}
  //    Customer: {{customer_name}} ({{customer_phone}})
  //    Address: {{delivery_address}}
  //    Items: {{order_items}}
  //    Delivery: {{delivery_zone}} — {{delivery_fee}}
  //    Total: {{order_total}}
  // Set "To Email" on THIS template to your own shop email
  // (fixed value, not a variable — so it always comes to you).
  // Paste that template's ID into ownerTemplateId below.
  emailjs: {
    serviceId:      'service_0qomaoh',
    templateId:     'template_v7xx188',
    ownerTemplateId:'template_5pcpkkl',
    publicKey:      'uR8ppRJai5yn5p_oX',
  },

  // ── SHOP INFO ─────────────────────────────────
  shopName:  'Desi Panday',
  shopPhone: '+92 324 8825813',
  shopEmail: 'desipanday83@gmail.com',

  // ── YOUR WHATSAPP NUMBER ──────────────────────
  // Customer's order opens a pre-filled WhatsApp
  // message to you. No API needed — just your number.
  // Format: country code + number, no + or spaces
  whatsappNumber: '923267727448',   // ← your number

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
    id: 10, category: 'bottles', badge: 'Top Seller',
    image: 'images/copper-water-bottle.jpg',
    name: 'Pure Copper Water Bottle — 600ml',
    shortDesc: 'Hand-hammered 100% pure copper bottle, perfect for daily use',
    fullDesc: 'Our signature pure copper water bottle, hand-hammered by Lahore artisans into a dimpled surface that catches the light. Rooted in Ayurvedic tradition, copper vessels are believed to aid digestion, boost immunity, and naturally purify water. Eco-friendly, reusable, and built to last a lifetime — a healthier, more elegant alternative to plastic. Also available in a 1 Litre size.',
    price: 6000, material: '99.9% Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Ayurvedic-Inspired', dimensions: '600ml capacity', weight: 0.3
  },
  {
    id: 11, category: 'bottles', badge: 'Top Seller',
    image: 'images/copper-water-bottle.jpg',
    name: 'Pure Copper Water Bottle — 1 Litre',
    shortDesc: 'Hand-hammered 100% pure copper bottle, ideal for long hours',
    fullDesc: 'Our signature pure copper water bottle in a larger 1 Litre size, hand-hammered by Lahore artisans into a dimpled surface that catches the light. Rooted in Ayurvedic tradition, copper vessels are believed to aid digestion, boost immunity, and naturally purify water. Eco-friendly, reusable, and built to last a lifetime — a healthier, more elegant alternative to plastic. Also available in a 600ml size.',
    price: 7500, material: '99.9% Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Ayurvedic-Inspired', dimensions: '1 Litre capacity', weight: 0.4
  },
  {
    id: 1, category: 'mugs', badge: 'Bestseller',
    image: 'images/1.jpg',
    name: 'Hammered Copper Glass',
    shortDesc: 'Hand-hammered pure copper, traditional lassi glass',
    fullDesc: 'This hand-hammered copper glass carries the ancient tradition of the subcontinent. Each dimple is struck individually by a craftsman\'s hammer, creating a surface that catches the light like a constellation. Perfect for lassi, water, or as a decorative piece.',
    price: 3800, material: 'Pure Copper', origin: 'Lahore Workshop',
    technique: 'Hand Hammering', era: 'Mughal-Inspired', dimensions: '10cm tall, 250ml', weight: 0.15
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
// 0. WHATSAPP — opens pre-filled message for you
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
// 1. EMAILJS — notifies YOU (the shop) the instant
//    a customer places an order on the website.
// ═══════════════════════════════════════════════
async function notifyShopOrderEmail(orderId, name, phone, email, address, note, items, total, deliveryFee, zoneLabel) {
  if (typeof emailjs === 'undefined') { console.error('EmailJS not loaded'); return; }
  if (!CONFIG.emailjs.ownerTemplateId || CONFIG.emailjs.ownerTemplateId.includes('YOUR_OWNER_TEMPLATE_ID')) {
    console.warn('Owner order-notification skipped — set CONFIG.emailjs.ownerTemplateId (see comments in CONFIG).');
    return;
  }
  const itemLines = items.map(i =>
    `${i.name} x${i.qty} = Rs.${(i.price * i.qty).toLocaleString()}`
  ).join('\n');
  const subtotal = items.reduce((s, i) => s + (i.price * i.qty), 0);

  try {
    await emailjs.send(
      CONFIG.emailjs.serviceId,
      CONFIG.emailjs.ownerTemplateId,
      {
        order_id:         orderId,
        customer_name:    name,
        customer_phone:   phone,
        customer_email:   email || '',
        delivery_address: address,
        delivery_zone:    zoneLabel,
        delivery_fee:     `Rs. ${deliveryFee.toLocaleString()}`,
        order_items:      itemLines,
        subtotal:         `Rs. ${subtotal.toLocaleString()}`,
        order_total:      `Rs. ${total.toLocaleString()}`,
        note:              note || '—',
        shop_name:         CONFIG.shopName,
      }
    );
    console.log('✅ Shop notified of new order', orderId);
  } catch (e) { console.error('❌ EmailJS owner-notification error:', e); }
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
// 2b. FORMSPREE — sends enquiry details to YOUR email
// ═══════════════════════════════════════════════
async function notifyShopOfEnquiry(name, email, type, message) {
  if (CONFIG.formspreeEndpoint.includes('YOUR_FORM_ID')) return;
  try {
    await fetch(CONFIG.formspreeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `✉️ NEW ENQUIRY — Desi Panday (${type || 'General'})`,
        enquiry_type: type || 'General',
        customer_name: name,
        customer_email: email,
        message: message
      })
    });
  } catch (e) { console.log('Formspree enquiry error:', e); }
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
          <input type="tel"   id="coPhone"   placeholder="Phone Number *" />
        </div>
        <div class="form-group">
          <input type="email" id="coEmail"   placeholder="Email Address * (for your order confirmation)" />
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
               style="vertical-align:middle;margin-right:8px">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Order via WhatsApp
        </button>
        <p style="font-size:0.72rem;opacity:0.65;text-align:center;margin-top:0.6rem;line-height:1.5">
          Your order is saved with us, and WhatsApp opens next so you can
          confirm the details with our team directly.
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

  if (!name || !phone || !email || !address) {
    showToast('✦ Please fill in your name, phone, email and address');
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

    localStorage.setItem('lastOrderRef', res.orderId);

    // 1. Notify the shop that a new order came in (EmailJS — see CONFIG)
    await notifyShopOrderEmail(res.orderId, name, phone, email, address, note, orderedItems, grandTotal, deliveryFee, zone.label);

    // 2. Notify the shop via Formspree too, if that's set up (optional, CONFIG.formspreeEndpoint)
    await notifyShopByEmail(res.orderId, name, phone, address, orderedItems, grandTotal, deliveryFee, zone.label);

    // 3. Send confirmation email to the customer
    await sendConfirmationEmail(res.orderId, name, email, phone, orderedItems, grandTotal, deliveryFee, zone.label);

    // 4. Open WhatsApp with a pre-filled order message so the
    //    customer can confirm directly with the shop
    openWhatsAppOrder(res.orderId, name, phone, address, note, orderedItems, grandTotal, deliveryFee, zone.label);

    // Show success state in the modal instead of redirecting immediately —
    // this gives the WhatsApp tab a moment to open before anything else happens.
    document.getElementById('coSuccess').style.display = 'block';
    document.getElementById('coSuccess').innerHTML = `
      <div class="co-success-inner">
        <div class="co-success-icon">✦</div>
        <strong>Order ${res.orderId} Confirmed!</strong>
        <p>WhatsApp is opening with your order details.</p>
        <p>Just tap <strong>Send</strong> to confirm your order with us.</p>
        ${email ? `<p style="font-size:0.85rem;opacity:0.75">A confirmation email is being sent to ${email}</p>` : ''}
        <button class="btn btn-ghost" onclick="window.location.href='Thankyou.html?ref=${encodeURIComponent(res.orderId)}'" style="margin-top:1rem;width:100%">
          View Order Confirmation
        </button>
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
  const fName    = document.getElementById('fname').value;
  const fEmail   = document.getElementById('femail').value;
  const fType    = document.getElementById('ftype').value;
  const fMessage = document.getElementById('fmessage').value;

  await API.submitEnquiry({ name: fName, email: fEmail, type: fType, message: fMessage });
  await notifyShopOfEnquiry(fName, fEmail, fType, fMessage);

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