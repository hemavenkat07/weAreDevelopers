# Ecommerce Backend (FreshMart)

Node.js + Express + MongoDB API for the Ecommerce frontend.

## Setup

1. Install dependencies:
   ```bash
   cd backend && npm install
   ```

2. Copy environment file and set variables:
   ```bash
   copy .env.example .env
   ```
   Edit `.env`: set `MONGODB_URI` (default: `mongodb://127.0.0.1:27017/ecommerce_freshmart`) and `JWT_SECRET`.

3. Ensure MongoDB is running locally (or use a cloud URI).

4. Seed the database (creates admin user and sample products):
   ```bash
   node seed.js
   ```
   **Admin login:** `admin@freshmart.com` / `admin123`

5. Start the server:
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:5000`.

## API Overview

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (Bearer token)
- **Products:** `GET /api/products`, `GET /api/products/:id` (public); `POST/PUT/DELETE /api/products` (admin)
- **Orders:** `GET /api/orders`, `POST /api/orders` (authenticated). Payment method `wallet` deducts from user balance.
- **Admin:** `GET/PUT /api/admin/settings` (joining bonus), `GET /api/admin/users`, `PUT /api/admin/users/:id/wallet`, `GET /api/admin/orders`, `PATCH /api/admin/orders/:id/status`

New signups receive the **joining bonus** (default ₹2000) in their wallet; amount is configurable in Admin → Settings.
