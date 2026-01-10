const API_URL = "https://store-backend-a653.onrender.com/api";
const productsContainer = document.getElementById("productsContainer");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Dummy products
const products = [
  { id: 1, title: "Toddler-Pajama", price: 320, image: "images/toddler-pajama.png" },
  { id: 2, title: "Dress", price: 350, image: "images/dress.png" },
  { id: 3, title: "Jacket", price: 650, image: "images/jacket.png" },
  { id: 4, title: "Girl-Dress", price: 500, image: "images/girl-dress.jfif" },
  { id: 5, title: "Sweatshirt", price: 450, image: "images/sweatshirt.png" }
];

// ---------------------- Cart Functions ----------------------
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartButton();
}

function updateCartButton() {
  const btn = document.getElementById("goToCartBtn");
  const countElem = document.getElementById("cartCount");
  if (!btn || !countElem) return;

  const count = cart.length;
  if (count > 0) {
    btn.style.display = "inline-block";
    countElem.textContent = count;
  } else {
    btn.style.display = "none";
  }
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Optional: authentication check
  if (!localStorage.getItem("token")) {
    alert("Please login to add to cart!");
    window.location.href = "login.html";
    return;
  }

  cart.push(product);
  saveCart();
  alert(`${product.title} added to cart!`);
}

// ---------------------- Render Products ----------------------
function renderProducts() {
  if (!productsContainer) return;

  const token = localStorage.getItem("token");
  productsContainer.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})" ${!token ? "disabled title='Login to add to cart'" : ""}>
        Add to Cart
      </button>
    </div>
  `).join('');
}

// ---------------------- Auth & Nav ----------------------
function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  updateNav(); // Update nav links after logout
  window.location.href = "index.html";
}

function updateNav() {
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const logoutLink = document.getElementById("logoutLink");

  if (!loginLink || !signupLink || !logoutLink) return;

  if (getToken()) {
    loginLink.style.display = "none";
    signupLink.style.display = "none";
    logoutLink.style.display = "inline-block";
  } else {
    loginLink.style.display = "inline-block";
    signupLink.style.display = "inline-block";
    logoutLink.style.display = "none";
  }
}

// Call this on page load
document.addEventListener("DOMContentLoaded", () => {
  updateNav();
});

// ---------------------- Initialize ----------------------
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartButton();
});

