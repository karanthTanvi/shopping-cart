const API = '';
let allProducts = []; // saved here so filtering doesn't need to ask the server again
let currentProduct = null;

// runs when the page loads — fills the database with products if empty, then loads everything
async function init() {
  await fetch(`${API}/api/seed`, { method: 'POST' });
  await loadProducts();
  await loadCart();
}

// --- Products ---

// asks the server for all products and saves them in allProducts
async function loadProducts() {
  try {
    const res = await fetch(`${API}/api/products`);
    allProducts = await res.json();
    renderProducts('all'); // show all categories on first load
  } catch (err) {
    // if something goes wrong, show a message instead of a blank screen
    document.getElementById('productGrid').innerHTML =
      '<p style="text-align:center;color:#999;padding:4rem;">Unable to load products. Please try again.</p>';
  }
}

// builds and displays the product cards on the page
// if a category is selected, only shows products in that category
function renderProducts(category) {
  const grid = document.getElementById('productGrid');
  const filtered = category === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === category);

  // show a message if no products match the selected category
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:#999;padding:4rem;">No products found.</p>';
    return;
  }

  // build a card for each product and inject into the grid
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick="openDetail('${p._id}')">
      <div class="product-image-wrap">
        <img class="img-main" src="${p.image}" alt="${p.name}">
        <img class="img-hover" src="${p.hoverImage || p.image}" alt="${p.name}">
        <button class="quick-add" onclick="event.stopPropagation(); quickAdd('${p._id}')">
          ADD TO BAG
        </button>
      </div>
      <div class="product-category-tag">${p.category}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">$ ${p.price.toLocaleString()}</div>
    </div>
  `).join('');
}

// --- Product Detail ---

// opens the full product detail overlay when a card is clicked
function openDetail(id) {
  const p = allProducts.find(p => p._id === id);
  if (!p) return;
  currentProduct = p;

  // fill in all the text fields in the modal
  document.getElementById('detailCategory').textContent = p.category;
  document.getElementById('detailName').textContent = p.name;
  document.getElementById('detailPrice').textContent = `$ ${p.price.toLocaleString()}`;
  document.getElementById('detailDesc').textContent = p.description;
  document.getElementById('detailMaterial').textContent = p.material || '—';
  document.getElementById('detailReference').textContent = p.reference || '—';

  // swap the image by rewriting the container — this keeps the detailImage id alive across multiple opens
  const imageWrap = document.getElementById('detailImage').parentElement;
  imageWrap.innerHTML = p.image
    ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">
       <div id="detailImage" style="display:none"></div>`
    : `<div id="detailImage" style="font-size:7rem;opacity:0.35;">◈</div>`;

  // wire up the add to bag button for this specific product
  document.getElementById('detailAddBtn').onclick = () => {
    addToCart(p._id, p.name, p.price, p.image);
    closeDetail();
  };

  // show the overlay and stop the page from scrolling behind it
  document.getElementById('detailOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// closes the detail overlay and allows the page to scroll again
function closeDetail() {
  document.getElementById('detailOverlay').classList.remove('active');
  document.body.style.overflow = '';
  currentProduct = null;
}

// adds product to cart directly from the grid without opening the detail view
async function quickAdd(id) {
  const p = allProducts.find(p => p._id === id);
  if (!p) return;
  await addToCart(p._id, p.name, p.price, p.image);
}

// --- Cart ---

// asks the server for the current cart contents and displays them
async function loadCart() {
  try {
    const res = await fetch(`${API}/api/cart`);
    const items = await res.json();
    renderCart(items);
  } catch (err) {
    console.error('Failed to load cart:', err);
  }
}

// builds and displays all cart items in the sidebar
function renderCart(items) {
  const countEl = document.getElementById('cartCount');
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  // work out the total number of items and the total price
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // update the bag count shown in the navbar
  countEl.textContent = totalCount;

  // show empty state if there's nothing in the cart
  if (items.length === 0) {
    itemsEl.innerHTML = `<div class="empty-cart">YOUR BAG IS EMPTY</div>`;
    footerEl.innerHTML = '';
    return;
  }

  // build a row for each cart item
  itemsEl.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.image
          ? `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">`
          : '◈'
        }
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$ ${(item.price * item.quantity).toLocaleString()}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty('${item._id}', ${item.quantity - 1})">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQty('${item._id}', ${item.quantity + 1})">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeItem('${item._id}')">✕</button>
    </div>
  `).join('');

  // show the subtotal and action buttons at the bottom of the cart
  footerEl.innerHTML = `
    <div class="cart-subtotal">
      <span class="cart-subtotal-label">SUBTOTAL</span>
      <span class="cart-subtotal-amount">$ ${totalPrice.toLocaleString()}</span>
    </div>
    <button class="checkout-btn" onclick="checkout()">PROCEED TO CHECKOUT</button>
    <button class="clear-btn" onclick="clearCart()">CLEAR BAG</button>
    <p class="cart-shipping">Complimentary shipping on all orders</p>
  `;
}

// sends a request to add a product to the cart
// the price is saved at the time of adding — not updated if the product price changes later
async function addToCart(productId, name, price, image) {
  try {
    await fetch(`${API}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, name, price, image }),
    });
    await loadCart();
    showToast(`${name} — ADDED TO BAG`);
  } catch (err) {
    showToast('SOMETHING WENT WRONG — PLEASE TRY AGAIN');
  }
}

// updates the quantity of a cart item
// sending quantity 0 tells the server to remove the item completely
async function updateQty(id, quantity) {
  try {
    await fetch(`${API}/api/cart/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    await loadCart();
  } catch (err) {
    console.error('Failed to update quantity:', err);
  }
}

// removes a single item from the cart
async function removeItem(id) {
  try {
    await fetch(`${API}/api/cart/${id}`, { method: 'DELETE' });
    await loadCart();
    showToast('ITEM REMOVED');
  } catch (err) {
    console.error('Failed to remove item:', err);
  }
}

// removes everything from the cart at once
async function clearCart() {
  try {
    await fetch(`${API}/api/cart`, { method: 'DELETE' });
    await loadCart();
    showToast('BAG CLEARED');
  } catch (err) {
    console.error('Failed to clear cart:', err);
  }
}

// clears the cart and closes the sidebar to simulate a completed order
async function checkout() {
  await clearCart();
  closeCart();
  showToast('ORDER PLACED — THANK YOU FOR SHOPPING WITH AUREL', 6000);
}

// --- UI Events ---

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

document.getElementById('detailClose').addEventListener('click', closeDetail);
document.getElementById('detailOverlay').addEventListener('click', (e) => {
  // only close if clicking the dark background, not the modal itself
  if (e.target === document.getElementById('detailOverlay')) closeDetail();
});

// tab bar — highlight the active tab and filter the product grid
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.category);
  });
});

// opens the cart sidebar and stops the page from scrolling behind it
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// closes the cart sidebar and allows the page to scroll again
function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// --- Toast ---

// shows a brief message at the top of the screen, disappears after 3 seconds
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

init();