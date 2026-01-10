let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContainer = document.getElementById("cartContainer");
const cartTotalElem = document.getElementById("cartTotal");

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(p => p.id !== productId);
  saveCart();
  renderCart();
}

// Save cart and update localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartButton();
}

function updateCartButton() {
  const countElem = document.getElementById("cartCount");
  if (countElem) countElem.textContent = cart.length;
}

// Render cart page
function renderCart() {
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalElem.textContent = "0";
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

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalElem.textContent = total.toFixed(2);
}

// Checkout
function checkout() {
  if (!localStorage.getItem("token")) {
    alert("Please login to place an order!");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price, 0).toFixed(2);
  alert(`Order placed successfully! Total: $${total}`);

  // Clear cart
  cart = [];
  saveCart();
  renderCart();

  // Redirect to home
  window.location.href = "index.html";
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

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
});
