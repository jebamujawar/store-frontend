// ------------------ Auth ------------------
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

// Update login/signup nav (optional)
function checkAuth() {
  const authLink = document.getElementById("authLink");
  if (!authLink) return;
  if (getToken()) {
    authLink.textContent = "Logout";
    authLink.href = "#";
    authLink.onclick = logout;
  }
}

// ------------------ Login ------------------
async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw data;

    setToken(data.token);
    return data;
  } catch (err) {
    // Show server error or fallback
    return Promise.reject({ error: err.error || "Invalid email or password" });
  }
}

// ------------------ Signup ------------------
async function signup(name, email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      // If email already exists, suggest login
      if (data.error && data.error.toLowerCase().includes("already")) {
        throw { error: "Email already exists. Please login instead." };
      }
      throw data;
    }

    setToken(data.token);
    return data;
  } catch (err) {
    return Promise.reject({ error: err.error || "Signup failed" });
  }
}
