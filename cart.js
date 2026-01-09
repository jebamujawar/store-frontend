const API_URL = "https://store-backend-a653.onrender.com/api"; // Backend API URL

const productsContainer = document.getElementById("productsContainer");
const cartCount = document.getElementById("cartCount");

// Dummy product list
const products = [
  { id: 1, title: "Toddler-Pajama", price: 320, image: "images/toddler-pajama.png" },
  { id: 2, title: "Dress", price: 350, image: "images/dress.png" },
  { id: 3, title: "Jacket", price: 650, image: "images/jacket.png" },
  { id: 4, title: "Girl-Dress", price: 500, image: "images/girl-dress.jfif" },
  { id: 5, title: "Sweatshirt", price: 450, image: "images/sweatshirt.png" }
];


let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage and update cart count
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  cartCount.textContent = cart.length;
}

// Add product to cart
function addToCart(productId) {
  if (!getToken()) {
    alert("You must log in to add items to the cart!");
    window.location.href = "login.html";  // optional: redirect to login
    return;
  }

  const product = products.find(p => p.id === productId);
  if (!product) return;

  cart.push(product);
  saveCart();
  renderCart(); // update cart UI if needed
}


// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(p => p.id !== productId);
  saveCart();
  renderCart();
}

// Render product list
function renderProducts() {
  productsContainer.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('');
}

// Render cart items (optional checkout page)
function renderCart() {
  const cartContainer = document.getElementById("cartContainer");
  if (!cartContainer) return;
  cartContainer.innerHTML = cart.map((p, i) => `
    <div class="cart-item">
      <img src="${p.image}" alt="${p.title}">
      <span>${p.title}</span>
      <span>$${p.price}</span>
      <button onclick="removeFromCart(${p.id})">Remove</button>
    </div>
  `).join('');
}

/*Dummy checkout
function checkout() {
  if (cart.length === 0) return alert("Cart is empty!");
  alert(`Checked out ${cart.length} items!`);
  cart = [];
  saveCart();
  renderCart();
}*/

// Render cart items
function renderCart() {
  const cartContainer = document.getElementById("cartContainer");
  if (!cartContainer) return;

  cartContainer.innerHTML = cart.length === 0
    ? "<p>Your cart is empty.</p>"
    : cart.map((p, i) => `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.title}">
          <span>${p.title}</span>
          <span>$${p.price}</span>
          <button onclick="removeFromCart(${p.id})">Remove</button>
        </div>
      `).join('');
  
  // Update total
  const totalElem = document.getElementById("cartTotal");
  if (totalElem) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalElem.textContent = total.toFixed(2);
  }
}


// Initial load
saveCart();
renderProducts();
renderCart();
