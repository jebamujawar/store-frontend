// ---------------------- Global Variables ----------------------
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

// ---------------------- Auth ----------------------
function setToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

// Login
async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw data;

    // Save token AND username
    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.user.name); // <-- must match 'name' from API
    return data;
  } catch (err) {
    return Promise.reject({ error: err.error || "Invalid email or password" });
  }
}


//Signup
async function signup(name, email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    setToken(data.token);
    return data;
  } catch (err) {
    return Promise.reject({ error: err.error || "Signup failed" });
  }
}


// ---------------------- Cart ----------------------
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartButton();
}

function updateCartButton() {
  const countElem = document.getElementById("cartCount");
  const goToCartBtn = document.getElementById("goToCartBtn");
  if (!countElem || !goToCartBtn) return;

  if (cart.length > 0) {
    countElem.textContent = cart.length;
    goToCartBtn.style.display = "inline-block";
  } else {
    countElem.textContent = "0";
    goToCartBtn.style.display = "none";
  }
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

// ---------------------- Render Products ----------------------
function renderProducts() {
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

// ---------------------- Render Nav ----------------------
function updateNav() {
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const logoutLink = document.getElementById("logoutLink");
  const userNameSpan = document.getElementById("userName");

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("userName") || "";

  if (token && name) {
    loginLink.style.display = "none";
    signupLink.style.display = "none";
    logoutLink.style.display = "inline-block";
    userNameSpan.style.display = "inline-block";
    userNameSpan.textContent = `Hello, ${name}`;
  } else {
    loginLink.style.display = "inline-block";
    signupLink.style.display = "inline-block";
    logoutLink.style.display = "none";
    userNameSpan.style.display = "none";
  }
}


// Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  updateNav();
  window.location.href = "index.html";
}


// ---------------------- Initialize ----------------------
document.addEventListener("DOMContentLoaded", () => {
  updateNav();
  renderProducts();
  updateCartButton();

  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) logoutLink.addEventListener("click", logout);
});
