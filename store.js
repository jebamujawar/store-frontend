// ---------------------- Constants ----------------------
const productsContainer = document.getElementById("productsContainer");

//Dummy product list
const products = [
  { id: 1, title: "Toddler-Pajama", price: 320, image: "images/toddler-pajama.png" },
  { id: 2, title: "Dress", price: 350, image: "images/dress.png" },
  { id: 3, title: "Jacket", price: 650, image: "images/jacket.png" },
  { id: 4, title: "Girl-Dress", price: 500, image: "images/girl-dress.jfif" },
  { id: 5, title: "Sweatshirt", price: 450, image: "images/sweatshirt.png" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------------------- Cart Functions ----------------------
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product to cart (login required)
function addToCart(productId) {
  if (!getToken()) {
    alert("You must log in to add items to the cart!");
    window.location.href = "login.html"; // optional redirect
    return;
  }

  const product = products.find(p => p.id === productId);
  if (!product) return;

  cart.push(product);
  saveCart();
  renderCart();
  alert(`${product.title} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(p => p.id !== productId);
  saveCart();
  renderCart();
}

// ---------------------- Render Products ----------------------
function renderProducts() {
  if (!productsContainer) return;

  const token = getToken(); // check login

  productsContainer.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price}</p>
      <button 
        onclick="addToCart(${p.id})"
        ${!token ? "disabled title='Login to add to cart'" : ""}
      >
        Add to Cart
      </button>
    </div>
  `).join('');
}

// ---------------------- Render Cart ----------------------
function renderCart() {
  const cartContainer = document.getElementById("cartContainer");
  if (!cartContainer) return;

  cartContainer.innerHTML = cart.length === 0
    ? "<p>Your cart is empty.</p>"
    : cart.map(p => `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.title}">
          <span>${p.title}</span>
          <span>$${p.price}</span>
          <button onclick="removeFromCart(${p.id})">Remove</button>
        </div>
      `).join('');

  const totalElem = document.getElementById("cartTotal");
  if (totalElem) {
    totalElem.textContent = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  }
}

// ---------------------- Checkout ----------------------
function checkout() {
  if (!getToken()) {
    alert("You must log in to place an order!");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Dummy checkout logic
  alert(`Your order successfully placed! Total: $${cart.reduce((sum, i) => sum + i.price, 0).toFixed(2)}`);
  cart = [];
  saveCart();
  renderCart();
}

// ---------------------- Initial Render ----------------------
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  // Checkout button handler
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }
});
