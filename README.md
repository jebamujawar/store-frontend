# My Store Web App

A full-stack shopping web application with authentication, cart, and checkout functionality.

---
## 🚀 Live Project Links

🔗 **Frontend (GitHub Pages)**  
 https://jebamujawar.github.io/store-frontend/

🔗 **Backend API (Render)**  
https://store-backend-a653.onrender.com

---

## Features

- **User Authentication**
  - Signup and login using email and password
  - Token-based authentication stored in `localStorage`
  - Logout clears token and redirects to home

- **Products & Cart**
  - Dynamic product listing
  - Add/remove items to cart
  - Cart persists using `localStorage`
  - Cart count displayed in navbar

- **Checkout**
  - Validates user login
  - Calculates total price
  - Clears cart on checkout
  - Redirects to home page
  - Navbar updates based on login state

---
## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt
- **Frontend:** HTML, CSS,JS
- **Deployment:** GitHub Pages (frontend), Render (backend)
