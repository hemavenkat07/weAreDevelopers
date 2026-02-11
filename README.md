# FreshMart - E-commerce Web Application

A full-featured e-commerce platform similar to Zomato and BigBasket, built with modern web technologies.

## Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client (ready for API integration)
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend (Ready for Integration)
The application is structured to work with:
- **Node.js** - Runtime
- **Express** - Server framework
- **MongoDB** - Database
- **JWT** - Authentication
- **dotenv** - Environment variables
- **cors** - CORS handling

## Features

### 🛍️ Product Management
- Browse products by categories (Vegetables, Fruits, Dairy, Bakery, Snacks, Beverages)
- Search products by name or description
- Filter products by category
- View detailed product information
- Product ratings and reviews
- Stock availability indicators
- Discount badges

### 🛒 Shopping Cart
- Add products to cart
- Update product quantities
- Remove items from cart
- Real-time cart total calculation
- Persistent cart state with Redux
- Empty cart state handling

### 👤 User Authentication
- Login/Signup functionality
- User profile management
- Protected routes for authenticated users
- JWT token simulation (ready for backend integration)

### 📦 Order Management
- Complete checkout process
- Multiple payment methods (COD, Card, UPI)
- Order history
- Order status tracking
- Delivery address management

### 🎨 UI/UX Features
- Responsive design (mobile, tablet, desktop)
- Clean and modern interface
- Smooth transitions and animations
- Toast notifications for user actions
- Loading states
- Empty states for cart and orders
- Product image fallbacks

## Pages

1. **Home Page** (`/`) - Product listing with search and category filters
2. **Product Detail** (`/product/:id`) - Detailed product view
3. **Cart** (`/cart`) - Shopping cart with quantity controls
4. **Checkout** (`/checkout`) - Order placement form
5. **Login/Signup** (`/login`) - Authentication page
6. **Orders** (`/orders`) - Order history
7. **Profile** (`/profile`) - User profile and quick actions

## Redux Store Structure

### Slices
- **products** - Product catalog, filtering, and search
- **cart** - Shopping cart management
- **auth** - User authentication state
- **orders** - Order history and management

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Backend Integration

The application is ready for backend integration. To connect to a Node.js/Express backend:

1. Replace mock data in Redux slices with API calls using Axios
2. Update authentication flow to use real JWT tokens
3. Connect to MongoDB for persistent data storage
4. Implement API endpoints for:
   - Product CRUD operations
   - User authentication
   - Cart management
   - Order processing

## Environment Variables (For Backend)

Create a `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## API Endpoints (Suggested Structure)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

## Mock Data

The application includes mock data for:
- 8 sample products across different categories
- User authentication simulation
- Order management simulation

## Future Enhancements

- Product reviews and ratings system
- Wishlist functionality
- Advanced search with filters
- Product recommendations
- Order tracking with real-time updates
- Payment gateway integration
- Admin dashboard
- Inventory management
- Email notifications
- Social authentication
