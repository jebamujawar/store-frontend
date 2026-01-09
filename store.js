const productsContainer = document.getElementById("productsContainer");

const products = [
  { id: 1, title: "Toddler Pajama", price: 320, image: "images/toddler-pajama.png" },
  { id: 2, title: "Kids Jacket", price: 850, image: "images/jacket.png" },
  { id: 3, title: "Girl Dress", price: 400, image: "images/dress.png" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  cart.push(product);
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(p => p.id !== productId);
  saveCart();
  renderCart();
}

function renderProducts() {
  if (!productsContainer) return;

  productsContainer.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('');
}

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
    totalElem.textContent = cart.reduce((s, i) => s + i.price, 0).toFixed(2);
  }
}
