// auth.js
const API_URL = "https://store-backend-a653.onrender.com/api";

function setToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

function checkAuth() {
  const authLink = document.getElementById("authLink");
  if (!authLink) return;

  if (getToken()) {
    authLink.textContent = "Logout";
    authLink.href = "#";
    authLink.onclick = logout;
  }
}

async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw await res.json();
  const data = await res.json();
  setToken(data.token);
  return data;
}

async function signup(name, email, password) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  if (!res.ok) throw await res.json();
  const data = await res.json();
  setToken(data.token);
  return data;
}
