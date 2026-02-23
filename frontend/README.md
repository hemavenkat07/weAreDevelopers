# FreshMart E‑commerce Project

Full-stack e‑commerce with **React (Vite) + Redux** frontend and **Node.js + Express + MongoDB** backend. Payment is **wallet-only** with dummy refill; user profiles and orders are dynamic per user.

---

## Quick Start

### 1. Backend (Terminal 1)

```bash
cd backend
npm install
# First time only: seed DB (admin user + products)
npm run seed
# Start server (uses .env for MongoDB Atlas)
npm run dev
```

Server runs at **http://localhost:5000**. Admin login after seed: `admin@freshmart.com` / `admin123`.

### 2. Frontend (Terminal 2)

```bash
# From project root (Ecommerce website design)
npm install
npm run dev
```

App runs at **http://localhost:5173**.

### 3. Environment

- **Backend:** Copy `backend/.env.example` to `backend/.env`. Set `MONGODB_URI` (MongoDB Atlas) and `JWT_SECRET`.
- **Frontend:** `.env` should have `VITE_API_URL=http://localhost:5000/api`.

---

## What You’ll See (Output)

1. **Home** – Hero, product carousel, category filter, product grid (from API).
2. **Login / Sign up** – Form; after signup user gets **joining bonus** in wallet (amount set by admin).
3. **Profile** – **Wallet balance**, total/pending orders, total spent; **Edit** to change name, phone, address (saved to DB); **Refill wallet (+₹500)** for dummy refill.
4. **Cart** – Items from Redux; **Proceed to Checkout**.
5. **Checkout** – Delivery address form; **Pay with wallet** only; if balance is low, link to **Refill wallet** on profile; place order deducts from wallet.
6. **Orders** – List of current user’s orders (from API).
7. **Admin** (`/admin`, admin user only) – **Settings** (joining bonus), **Users & Wallet** (edit any user’s wallet), **Orders** (change status), **Products** list.

UI (green theme, Tailwind, layout) is unchanged from the original design.

---

## API Tests

With backend running:

```bash
cd backend
node test-api.js
```

Runs: health, register, login, /me, products, wallet refill, place order, get orders.

---

## Project Layout

- **Frontend:** `src/app/` – `App.jsx`, `api/client.js`, `pages/`, `components/`, `store/slices/`.
- **Backend:** `backend/` – `index.js`, `config/db.js`, `models/`, `routes/`, `middleware/auth.js`.
- **Mentor explanation:** See **PROJECT_EXPLANATION_FOR_MENTORS.md** (file structure, REST API, integration, flows).

---

## Zip / Deliverable

If you received **FreshMart-Ecommerce-Project.zip** (or created it excluding `node_modules`):

1. Unzip the project.
2. In **project root:** `npm install` then `npm run dev`.
3. In **backend:** `npm install`, add `.env` from `.env.example`, run `npm run seed` once, then `npm run dev`.

Then open **http://localhost:5173** to see the app.
