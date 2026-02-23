# Backend API Integration Guide

## Overview
This document outlines the API structure needed to integrate this React frontend with a Node.js/Express backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All authenticated routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "securepassword"
}

Response (201):
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "token": "jwt_token_here"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response (200):
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "Mumbai, 400001"
  },
  "token": "jwt_token_here"
}
```

---

### Products

#### Get All Products
```http
GET /products?category=Vegetables&search=tomato
Response (200):
{
  "success": true,
  "products": [
    {
      "id": "product_id",
      "name": "Fresh Tomatoes",
      "description": "Fresh red tomatoes",
      "price": 40,
      "originalPrice": 60,
      "image": "image_url",
      "category": "Vegetables",
      "unit": "1 kg",
      "stock": 50,
      "rating": 4.5,
      "reviews": 128
    }
  ]
}
```

#### Get Product by ID
```http
GET /products/:id
Response (200):
{
  "success": true,
  "product": { /* product object */ }
}
```

#### Get Categories
```http
GET /products/categories
Response (200):
{
  "success": true,
  "categories": ["Vegetables", "Fruits", "Dairy", "Bakery", "Snacks", "Beverages"]
}
```

---

### Cart (Authenticated)

#### Get User Cart
```http
GET /cart
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "cart": {
    "items": [
      {
        "productId": "product_id",
        "name": "Fresh Tomatoes",
        "price": 40,
        "image": "image_url",
        "quantity": 2
      }
    ],
    "totalItems": 2,
    "totalPrice": 80
  }
}
```

#### Add Item to Cart
```http
POST /cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 1
}

Response (200):
{
  "success": true,
  "message": "Item added to cart",
  "cart": { /* updated cart */ }
}
```

#### Update Cart Item Quantity
```http
PUT /cart/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 3
}

Response (200):
{
  "success": true,
  "cart": { /* updated cart */ }
}
```

#### Remove Item from Cart
```http
DELETE /cart/remove/:productId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Item removed from cart",
  "cart": { /* updated cart */ }
}
```

#### Clear Cart
```http
DELETE /cart/clear
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Cart cleared"
}
```

---

### Orders (Authenticated)

#### Get User Orders
```http
GET /orders
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "orders": [
    {
      "id": "order_id",
      "items": [/* cart items */],
      "totalAmount": 500,
      "status": "pending",
      "orderDate": "2026-02-10T10:30:00Z",
      "deliveryAddress": "123 Street, Mumbai, 400001",
      "paymentMethod": "cod"
    }
  ]
}
```

#### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "order": { /* order object */ }
}
```

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 40
    }
  ],
  "totalAmount": 80,
  "deliveryAddress": "123 Street, Mumbai, 400001",
  "paymentMethod": "cod"
}

Response (201):
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "id": "order_id",
    "items": [/* items */],
    "totalAmount": 80,
    "status": "pending",
    "orderDate": "2026-02-10T10:30:00Z",
    "deliveryAddress": "123 Street, Mumbai, 400001",
    "paymentMethod": "cod"
  }
}
```

---

### User Profile (Authenticated)

#### Get Profile
```http
GET /profile
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "Mumbai, 400001"
  }
}
```

#### Update Profile
```http
PUT /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543211",
  "address": "New Address, Mumbai, 400002"
}

Response (200):
{
  "success": true,
  "message": "Profile updated",
  "user": { /* updated user */ }
}
```

---

## MongoDB Schema Examples

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  image: String,
  category: String,
  unit: String,
  stock: Number,
  rating: Number,
  reviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Schema
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number
  }],
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  status: String (enum: ['pending', 'confirmed', 'delivered', 'cancelled']),
  deliveryAddress: String,
  paymentMethod: String (enum: ['cod', 'card', 'upi']),
  orderDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Integration Steps

1. **Install Backend Dependencies**
   ```bash
   npm install express mongoose dotenv cors jsonwebtoken bcryptjs
   npm install --save-dev nodemon
   ```

2. **Update Frontend API Calls**
   - Replace mock data in Redux slices with Axios API calls
   - Add API base URL to environment variables
   - Handle loading and error states

3. **Example API Service**
   ```javascript
   // src/app/services/api.ts
   import axios from 'axios';
   
   const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';
   
   const api = axios.create({
     baseURL: API_BASE_URL,
   });
   
   // Add token to requests
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   
   export default api;
   ```

4. **Update Redux Thunks**
   ```javascript
   // Example: Fetch products
   export const fetchProducts = createAsyncThunk(
     'products/fetchProducts',
     async (filters: { category?: string; search?: string }) => {
       const response = await api.get('/products', { params: filters });
       return response.data.products;
     }
   );
   ```
