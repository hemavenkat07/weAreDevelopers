# FreshMart E‑commerce – Project Explanation for Mentors

This document explains the project from scratch to end: file structure, functionality, REST API integration, backend design, and what/why/where each part is used.

---

## 1. Project Overview

**What it is:** A full‑stack e‑commerce web app (like BigBasket) with:

- **Frontend:** React (Vite) + Redux + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)
- **Features:** User auth, wallet-only payment, dummy wallet refill, dynamic per-user profiles, admin panel, product listing, cart, checkout, orders

**UI:** The existing UI (green theme, Tailwind, layout) is kept as-is; only logic and integration were added.

---

## 2. File Structure

### 2.1 Frontend (Root: `Ecommerce website design/`)

```
Ecommerce website design/
├── index.html                 # Entry HTML
├── package.json               # Frontend deps (React, Redux, Vite, axios, etc.)
├── vite.config.js             # Vite config
├── .env                        # VITE_API_URL=http://localhost:5000/api
├── src/
│   ├── main.jsx               # React root, mounts <App />
│   ├── styles/
│   │   └── index.css          # Global Tailwind/styles
│   └── app/
│       ├── App.jsx            # Router, Redux Provider, Header/Footer, routes
│       ├── api/
│       │   └── client.js      # Axios instance, base URL, auth header, 401 logout
│       ├── components/        # UI (Header, Footer, ProductCard, Cart, etc.)
│       ├── pages/              # Route-level pages
│       │   ├── HomePage.jsx
│       │   ├── ProductDetailPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── CheckoutPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── OrdersPage.jsx
│       │   ├── AdminPage.jsx
│       │   └── NotFoundPage.jsx
│       └── store/
│           ├── store.js        # Redux store (products, cart, auth, orders)
│           ├── hooks.js        # useAppDispatch, useAppSelector
│           └── slices/
│               ├── authSlice.js      # Auth + profile + wallet refill (async thunks)
│               ├── productsSlice.js  # Products from API (async thunks)
│               ├── cartSlice.js      # Cart (sync, local state)
│               └── ordersSlice.js    # Orders from API (async thunks)
```

**Why this structure:**  
- `api/client.js`: single place for API base URL and auth so every component uses the same axios instance.  
- `store/slices`: Redux Toolkit slices; async thunks call the backend, sync slices (e.g. cart) stay client-only.  
- `pages/`: one component per route for clear separation.

### 2.2 Backend (Root: `Ecommerce website design/backend/`)

```
backend/
├── package.json         # express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv
├── .env                 # PORT, MONGODB_URI (Atlas), JWT_SECRET
├── .env.example         # Template (no real credentials)
├── index.js             # Entry: connect DB, mount routes, start server
├── config/
│   └── db.js            # Mongoose connect to MONGODB_URI
├── models/
│   ├── User.js          # User schema (name, email, phone, password, walletBalance, role, address)
│   ├── Product.js       # Product schema (name, price, category, image, stock, etc.)
│   ├── Order.js         # Order schema (user, items[], totalAmount, deliveryAddress, paymentMethod, status)
│   └── Settings.js      # App settings (e.g. joiningBonusAmount) – single doc
├── middleware/
│   └── auth.js          # protect (JWT), admin (role check)
├── routes/
│   ├── auth.js          # Register, login, GET/PATCH /me, wallet refill
│   ├── products.js      # CRUD products (GET public, POST/PUT/DELETE admin)
│   ├── orders.js        # GET my orders, POST place order (wallet only)
│   └── admin.js         # Settings, users list, wallet edit, orders list, order status
├── seed.js              # Seed DB: sample products, admin user, settings
└── test-api.js          # Script to test API (run with backend up)
```

**Why this structure:**  
- **models:** one file per collection; Mongoose schemas define what is stored in MongoDB.  
- **routes:** one file per domain (auth, products, orders, admin); keeps index.js small.  
- **middleware/auth.js:** reuse “require login” and “require admin” on routes.  
- **config/db.js:** single place for DB connection so index.js stays clean.

---

## 3. Technology Stack – What We Used and Where

| Technology | Where used | Why |
|------------|------------|-----|
| **React** | All UI (pages, components) | Component-based UI, fits e‑commerce screens. |
| **Vite** | Build & dev server | Fast HMR and build. |
| **Redux Toolkit** | `store/`, slices | Central state for auth, products, cart, orders; async thunks for API. |
| **React Router** | `App.jsx`, routes | Client-side routing (/, /cart, /checkout, /login, etc.). |
| **Axios** | `api/client.js`, thunks | HTTP client; interceptors add token and handle 401. |
| **Tailwind CSS** | All components | Utility-first styling; UI kept as per original design. |
| **Node.js + Express** | Backend | Simple REST API server. |
| **MongoDB + Mongoose** | Backend `models/`, `config/db.js` | NoSQL DB; Mongoose for schema and validation. |
| **JWT (jsonwebtoken)** | Auth routes, middleware | Stateless auth; token in header for protected routes. |
| **bcryptjs** | User model (password hash) | Secure password storage. |
| **cors** | Backend index.js | Allow frontend (different origin) to call API. |
| **dotenv** | Backend .env | PORT, MONGODB_URI, JWT_SECRET without hardcoding. |

---

## 4. REST API – Full List and Usage

Base URL: `http://localhost:5000/api` (or `VITE_API_URL` in frontend).

### 4.1 Auth (`/api/auth`)

| Method | Endpoint | Auth | Purpose | Frontend usage |
|--------|----------|------|---------|----------------|
| POST | `/auth/register` | No | Register; new user gets joining bonus in wallet | `LoginPage` → `registerThunk` |
| POST | `/auth/login` | No | Login; returns user + JWT | `LoginPage` → `loginThunk` |
| GET | `/auth/me` | Yes | Current user (for profile, wallet) | `fetchUserThunk` (App init, Profile, after refill) |
| PATCH | `/auth/me` | Yes | Update name, phone, address | `ProfilePage` → `updateProfileThunk` |
| POST | `/auth/wallet/refill` | Yes | Dummy refill +₹500 | `ProfilePage` → `refillWalletThunk` |

**Why:** One auth module; register/login set JWT; `/me` and PATCH keep profile and wallet in sync with DB.

### 4.2 Products (`/api/products`)

| Method | Endpoint | Auth | Purpose | Frontend usage |
|--------|----------|------|---------|----------------|
| GET | `/products` | No | List all products | `fetchProductsThunk` (App init) |
| GET | `/products/:id` | No | One product | Optional (detail can use Redux list) |
| POST | `/products` | Admin | Create product | Admin (can be extended) |
| PUT | `/products/:id` | Admin | Update product | Admin |
| DELETE | `/products/:id` | Admin | Delete product | Admin |

**Why:** Products are public read; write is admin-only. Frontend loads list once and filters by category/search in Redux.

### 4.3 Orders (`/api/orders`)

| Method | Endpoint | Auth | Purpose | Frontend usage |
|--------|----------|------|---------|----------------|
| GET | `/orders` | Yes | Current user’s orders | `OrdersPage`, `ProfilePage` → `fetchOrdersThunk` |
| POST | `/orders` | Yes | Place order (wallet only) | `CheckoutPage` → `placeOrderThunk` |

**Why:** Orders are per user; backend ensures `user: req.user.id`. Only `paymentMethod: 'wallet'` is accepted; backend deducts from `User.walletBalance`.

### 4.4 Admin (`/api/admin`)

| Method | Endpoint | Auth | Purpose | Frontend usage |
|--------|----------|------|---------|----------------|
| GET | `/admin/settings` | Admin | Get settings (e.g. joining bonus) | `AdminPage` → Settings tab |
| PUT | `/admin/settings` | Admin | Update joining bonus | `AdminPage` → Save |
| GET | `/admin/users` | Admin | List users | `AdminPage` → Users tab |
| PUT | `/admin/users/:id/wallet` | Admin | Set user wallet balance | `AdminPage` → Edit wallet |
| GET | `/admin/orders` | Admin | All orders | `AdminPage` → Orders tab |
| PATCH | `/admin/orders/:id/status` | Admin | Update order status | `AdminPage` → Change status |

**Why:** Admin controls joining bonus, user wallets, and order status in one place; UI unchanged, only logic and API.

### 4.5 Health

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Check server up (e.g. for scripts or monitoring). |

---

## 5. Backend–Database Integration

- **Connection:** `config/db.js` uses `mongoose.connect(process.env.MONGODB_URI)`. Used in `index.js` before starting the server so every route can use models.
- **Models → collections:**
  - `User` → `users` (name, email, phone, password, walletBalance, role, address).
  - `Product` → `products`.
  - `Order` → `orders` (with `user` ref to User).
  - `Settings` → `settings` (single document for app-wide settings).
- **Auth:** JWT stores only user id; on each request `auth.js` loads user from DB and attaches to `req.user`.
- **Orders:** On place order we read `User` by id, check wallet, deduct amount, save user and create order in one flow so wallet and orders stay consistent.

---

## 6. Frontend–Backend Integration

- **API client:** `src/app/api/client.js` creates axios with `baseURL: VITE_API_URL`. Every request adds `Authorization: Bearer <token>` from `localStorage`. On 401, token is cleared and `auth:logout` is fired so the app redirects to login.
- **Redux async thunks:** Each thunk calls the API and dispatches pending/fulfilled/rejected. Examples:
  - `authSlice`: `loginThunk`, `registerThunk`, `fetchUserThunk`, `updateProfileThunk`, `refillWalletThunk`.
  - `productsSlice`: `fetchProductsThunk`.
  - `ordersSlice`: `fetchOrdersThunk`, `placeOrderThunk`.
- **When data is loaded:**
  - On app load: if token exists, `fetchUserThunk()`; always `fetchProductsThunk()`.
  - Login/Register: thunks call `/auth/login` or `/auth/register`, store user + token in Redux and localStorage.
  - Profile: `fetchUserThunk` and `fetchOrdersThunk` so profile and orders are always from backend (dynamic per user).
  - Checkout: `placeOrderThunk` sends cart + address + `paymentMethod: 'wallet'`; on success, cart cleared and `fetchUserThunk` to refresh wallet.
- **UI:** No change to layout or visual design; only data source and flows are wired to the backend.

---

## 7. Main User Flows (End-to-End)

1. **Sign up**  
   User fills form → `registerThunk` → `POST /auth/register` → backend creates user with `walletBalance = settings.joiningBonusAmount` → returns user + token → frontend stores token and user (including wallet) in Redux/localStorage.

2. **Login**  
   User submits → `loginThunk` → `POST /auth/login` → backend returns user + token → same storage and redirect.

3. **Profile (dynamic per user)**  
   Profile page runs `fetchUserThunk` and `fetchOrdersThunk` → GET `/auth/me` and GET `/orders` with token → each user sees only their name, email, phone, address, wallet, and their orders. Edit profile → `updateProfileThunk` → PATCH `/auth/me` → DB and Redux updated.

4. **Refill wallet (dummy)**  
   User clicks “Refill wallet” → `refillWalletThunk` → POST `/auth/wallet/refill` → backend adds 500 to `user.walletBalance` → returns updated user → Redux updated so UI shows new balance.

5. **Cart → Checkout → Order**  
   User adds items (cart in Redux only). On checkout: form has delivery address; payment is wallet only. Submit → `placeOrderThunk` → POST `/orders` with items, totalAmount, deliveryAddress, paymentMethod: 'wallet'. Backend checks wallet, deducts amount, creates order. Frontend clears cart and refreshes user so wallet and orders list update.

6. **Admin**  
   Admin user opens `/admin` → `AdminPage` loads settings, users, orders via `/admin/*` with same token; backend checks `role === 'admin'`. Admin can change joining bonus, user wallets, and order status; UI layout unchanged.

---

## 8. Why Certain Decisions Were Made

- **Wallet only (no card/UPI/COD):** Simplifies implementation and matches “dummy wallet” requirement; all payments go through one flow (deduct from `User.walletBalance`).
- **Dummy refill:** No payment gateway; users can keep testing by refilling from Profile; admin can also set any user’s wallet from Admin.
- **Joining bonus in DB (Settings):** Admin can change the amount without code change; new users get the current value at signup.
- **Redux async thunks:** Keeps async logic (API calls) in one place and integrates with Redux (loading, error, data); components stay simple.
- **Axios interceptors:** Token and 401 handling in one place so every request is authenticated and logout is consistent.
- **MongoDB Atlas:** Cloud DB so the project runs without local MongoDB; connection string in `.env` only.

---

## 9. How to Run and Test

1. **Backend**
   - `cd backend`
   - `npm install`
   - Copy `.env.example` to `.env` and set `MONGODB_URI`, `JWT_SECRET`
   - First time: `npm run seed` (creates admin + products)
   - `npm run dev` → server on http://localhost:5000

2. **Frontend**
   - From project root: `npm install` (or pnpm)
   - `.env`: `VITE_API_URL=http://localhost:5000/api`
   - `npm run dev` → app on http://localhost:5173 (or similar)

3. **API tests**
   - With backend running: `cd backend && node test-api.js`
   - Exercises: health, register, login, /me, products, wallet refill, place order, get orders.

4. **Manual test**
   - Register → check Profile (wallet = joining bonus).
   - Refill wallet → balance increases.
   - Add products to cart → Checkout → fill address → Pay with wallet → place order.
   - Profile/Orders show updated wallet and new order.
   - Admin: login as admin (from seed), open `/admin`, change settings and user wallets.

---

## 10. Summary for Mentors

- **Scope:** Full-stack e‑commerce with auth, wallet-only payment, dummy refill, dynamic profiles, and admin controls.
- **Frontend:** React + Vite + Redux + React Router; one API client; async thunks for all server calls; UI preserved.
- **Backend:** Express + Mongoose; REST API; JWT auth; MongoDB for users, products, orders, settings.
- **Integration:** Frontend talks to backend only via REST; backend talks to DB only via Mongoose; no UI changes, only wiring and logic.
- **Deliverables:** Working codebase, this explanation document, optional API test script and zip for easy handover and demo.

You can use this document to walk through file structure, functionality, REST API integration, backend design, and end-to-end flows in a mentor review or presentation.

---

## 11. Downloadable Zip

- **Location:** The project zip is created at:  
  `C:\Users\HP\Desktop\TS_REACT\ts_project_01\FreshMart-Ecommerce-Project.zip`  
  (or in the same folder as the project, named `FreshMart-Ecommerce-Project.zip`.)
- **Contents:** Full project **excluding** `node_modules` and `dist` (smaller size). After unzip, run `npm install` in the project root and in `backend/` before running.
- **Included:** All source code, backend, frontend, `.env.example`, `PROJECT_EXPLANATION_FOR_MENTORS.md`, `README.md`, and `backend/test-api.js` for API testing.
