// Product data
const products = [
  { id: 1, name: 'BLOK Heavy Tee', sub: 'Washed Black / Oversized', price: 54.95, emoji: '👕', category: 'tees', badge: 'new', drop: true },
  { id: 2, name: 'Cargo Pants', sub: 'Olive / Relaxed Fit', price: 89.95, emoji: '👖', category: 'bottoms', badge: '', drop: true },
  { id: 3, name: '6-Panel Cap', sub: 'Black / Unstructured', price: 34.95, emoji: '🧢', category: 'accessories', badge: 'low', drop: true },
  { id: 4, name: 'Coach Jacket', sub: 'Navy / Windbreaker', price: 119.95, emoji: '🧥', category: 'hoodies', badge: 'new', drop: true },
  { id: 5, name: 'Acid Wash Hoodie', sub: 'Grey Acid / Heavyweight', price: 79.95, emoji: '🧥', category: 'hoodies', badge: '', drop: false },
  { id: 6, name: 'Track Shorts', sub: 'Black / Mesh Liner', price: 44.95, emoji: '🩳', category: 'bottoms', badge: '', drop: false },
  { id: 7, name: 'Logo Tee', sub: 'White / Regular Fit', price: 39.95, emoji: '👕', category: 'tees', badge: 'sold', drop: false },
  { id: 8, name: 'Bucket Hat', sub: 'Khaki / Cotton', price: 29.95, emoji: '🎩', category: 'accessories', badge: '', drop: false },
  { id: 9, name: 'Zip Hoodie', sub: 'Black / Heavyweight', price: 84.95, emoji: '🧥', category: 'hoodies', badge: '', drop: false },
  { id: 10, name: 'Graphic Tee Vol.2', sub: 'Charcoal / Oversized', price: 54.95, emoji: '👕', category: 'tees', badge: 'new', drop: false },
  { id: 11, name: 'Baggy Jeans', sub: 'Washed Blue / Baggy', price: 94.95, emoji: '👖', category: 'bottoms', badge: '', drop: false },
  { id: 12, name: 'Keychain', sub: 'Metal / BLOK Logo', price: 14.95, emoji: '🔑', category: 'accessories', badge: '', drop: false },
];

// Cart state
let cart = [];

// Render products
function renderProducts(containerId, items) {
  const grid = document.getElementById(containerId);
  grid.innerHTML = items.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-card__img">
        <div class="product-card__emoji">${p.emoji}</div>
        <div class="product-card__name-overlay">${p.name}</div>
        ${p.badge ? `<div class="product-card__badge badge--${p.badge}">${p.badge === 'new' ? 'NEW' : p.badge === 'sold' ? 'SOLD OUT' : 'LOW STOCK'}</div>` : ''}
      </div>
      <div class="product-card__info">
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__sub">${p.sub}</div>
        <div class="product-card__bottom">
          <div class="product-card__price">€ ${p.price.toFixed(2).replace('.', ',')}</div>
          <button class="product-card__add" data-id="${p.id}" ${p.badge === 'sold' ? 'disabled' : ''}>
            ${p.badge === 'sold' ? 'Sold Out' : 'Add +'}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Initial renders
renderProducts('productsGrid', products.filter(p => p.drop));
renderProducts('collectionGrid', products);

// Collection filter
document.getElementById('filters').addEventListener('click', (e) => {
  if (!e.target.classList.contains('filter__btn')) return;
  document.querySelectorAll('.filter__btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  const filter = e.target.dataset.filter;
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  renderProducts('collectionGrid', filtered);
  bindAddButtons();
});

// Cart functions
function openCart() {
  document.getElementById('cart').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product || product.badge === 'sold') return;

  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
}

function updateCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('cartCount').textContent = count;

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart__empty">Your cart is empty.</div>';
    footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item__emoji">${item.emoji}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__price">€ ${(item.price * item.qty).toFixed(2).replace('.', ',')} ${item.qty > 1 ? `(${item.qty}x)` : ''}</div>
        </div>
        <button class="cart-item__remove" data-id="${item.id}">✕</button>
      </div>
    `).join('');
    footerEl.style.display = 'block';
    document.getElementById('cartTotal').textContent = `€ ${total.toFixed(2).replace('.', ',')}`;

    itemsEl.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
    });
  }
}

function bindAddButtons() {
  document.querySelectorAll('.product-card__add:not([disabled])').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(Number(btn.dataset.id));
    });
  });
}

// Cart toggle
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

// Initial bind
bindAddButtons();

// Countdown to next Friday
function updateCountdown() {
  const now = new Date();
  const nextFriday = new Date();
  nextFriday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7 || 7));
  nextFriday.setHours(12, 0, 0, 0);

  const diff = nextFriday - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.borderBottomColor = window.scrollY > 20 ? '#333' : '#2a2a2a';
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Newsletter
document.getElementById('newsletterForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button');
  btn.textContent = 'You\'re in ✓';
  btn.style.background = '#0a0a0a';
  btn.style.color = '#e8ff00';
  this.querySelector('input').value = '';
  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
    btn.style.color = '';
  }, 3000);
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.product-card, .about__stat, .about__img').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = `opacity 0.4s ${i * 0.05}s ease, transform 0.4s ${i * 0.05}s ease`;
  observer.observe(el);
});
