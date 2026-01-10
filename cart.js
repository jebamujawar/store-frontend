// ---------------------- Global Variables ----------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContainer = document.getElementById("cartContainer");
const cartTotalElem = document.getElementById("cartTotal");

// ---------------------- Cart Functions ----------------------
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

function removeFromCart(productId) {
  cart = cart.filter(p => p.id !== productId);
  saveCart();
  renderCart();
}

function renderCart() {
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    if (cartTotalElem) cartTotalElem.textContent = "0";
    return;
  }

  cartContainer.innerHTML = cart.map((p, index) => `
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

// ---------------------- Checkout ----------------------
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

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  alert(`Order placed successfully! Total:${total}`);

  // Clear cart
  cart = [];
  saveCart();
  renderCart();

  // Redirect to home
  window.location.href = "index.html";
}

// ---------------------- Initialize ----------------------
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartButton();

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
});
