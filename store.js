// ---------------------- Global Variables ----------------------
const API_URL = "https://store-backend-a653.onrender.com/api";
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const products = [
  { id: 1, title: "Toddler-Pajama", price: 320, image: "images/toddler-pajama.png" },
  { id: 2, title: "Dress", price: 350, image: "images/dress.png" },
  { id: 3, title: "Jacket", price: 650, image: "images/jacket.png" },
  { id: 4, title: "Girl-Dress", price: 500, image: "images/girl-dress.jfif" },
  { id: 5, title: "Sweatshirt", price: 450, image: "images/sweatshirt.png" }
];

// ---------------------- Auth ----------------------
function setToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  updateNav(); // Update navbar before redirect
  window.location.href = "login.html";
}

// ---------------------- Navbar ----------------------
function updateNav() {
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const logoutLink = document.getElementById("logoutLink");
  const goToCartBtn = document.getElementById("goToCartBtn");
  const cartCount = document.getElementById("cartCount");

  if (getToken()) {
    if (loginLink) loginLink.style.display = "none";
    if (signupLink) signupLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "inline-block";
  } else {
    if (loginLink) loginLink.style.display = "inline-block";
    if (signupLink) signupLink.style.display = "inline-block";
    if (logoutLink) logoutLink.style.display = "none";
  }

  if (goToCartBtn && cartCount) {
    if (cart.length > 0) {
      goToCartBtn.style.display = "inline-block";
      cartCount.textContent = cart.length;
    } else {
      goToCartBtn.style.display = "none";
      cartCount.textContent = "0";
    }
  }
}

// ---------------------- Cart ----------------------
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateNav();
}

function addToCart(productId) {
  if (!getToken()) {
    alert("Please login to add to cart!");
    window.location.href = "login.html";
    return;
  }
  const product = products.find(p => p.id === productId);
  if (!product) return;

  cart.push(product);
  saveCart();
  alert(`${product.title} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(p => p.id !== productId);
  saveCart();
  renderCart();
}

function renderCart(cartContainerId = "cartContainer", cartTotalId = "cartTotal") {
  const cartContainer = document.getElementById(cartContainerId);
  const cartTotalElem = document.getElementById(cartTotalId);
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    if (cartTotalElem) cartTotalElem.textContent = "0";
    return;
  }

  cartContainer.innerHTML = cart.map(p => `
    <div class="cart-item">
      <img src="${p.image}" alt="${p.title}">
      <span>${p.title}</span>
      <span>$${p.price}</span>
      <button onclick="removeFromCart(${p.id})">Remove</button>
    </div>
  `).join('');

  if (cartTotalElem) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalElem.textContent = total.toFixed(2);
  }
}

// ---------------------- Products ----------------------
function renderProducts(containerId = "productsContainer") {
  const productsContainer = document.getElementById(containerId);
  if (!productsContainer) return;

  const token = getToken();

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

// ---------------------- Forms ----------------------
function initLoginForm() {
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginMsg.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      await login(email, password);
      alert("Login successful!");
      updateNav();
      window.location.href = "index.html";
    } catch (err) {
      loginMsg.textContent = err.error;
    }
  });
}

function initSignupForm() {
  const signupForm = document.getElementById("signupForm");
  const signupMsg = document.getElementById("signupMsg");
  if (!signupForm) return;

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupMsg.textContent = "";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      await signup(name, email, password);
      alert("Signup successful!");
      updateNav();
      window.location.href = "index.html";
    } catch (err) {
      signupMsg.textContent = err.error;
    }
  });
}

// ---------------------- API Login/Signup ----------------------
async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw { error: data.error || "Login failed" };
    setToken(data.token);
    return data;
  } catch (err) {
    throw { error: err.error || "Login failed" };
  }
}

async function signup(name, email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) throw { error: data.error || "Signup failed" };
    setToken(data.token);
    return data;
  } catch (err) {
    throw { error: err.error || "Signup failed" };
  }
}

// ---------------------- Checkout ----------------------
function checkout() {
  if (!getToken()) {
    alert("Please login to checkout!");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  alert(`Checkout successful! Total: $${total}`);

  // Clear cart
  cart = [];
  saveCart();

  // Redirect to home page after checkout
  window.location.href = "index.html";
}

// ---------------------- Logout ----------------------
function logout() {
  localStorage.removeItem("token"); // remove token
  updateNav(); // update navbar
  window.location.href = "index.html"; // redirect to home page
}

// ---------------------- Initialize ----------------------
document.addEventListener("DOMContentLoaded", () => {
  updateNav();
  renderProducts();
  renderCart();
  initLoginForm();
  initSignupForm();

  // Attach logout globally if exists
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", () => {
      logout();
    });
  }

  // Attach checkout if exists
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => checkout());
  }
});
