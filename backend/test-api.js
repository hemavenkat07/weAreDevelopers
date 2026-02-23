/**
 * API Testing Script - Run with: node test-api.js
 * Ensure backend is running on http://localhost:5000 first (npm run dev)
 */
const BASE = 'http://localhost:5000/api';

async function request(method, path, body = null, token = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function run() {
  console.log('=== API Tests (Backend must be running on port 5000) ===\n');

  let token = null;

  // 1. Health
  const health = await request('GET', '/health');
  console.log('1. GET /api/health:', health.status === 200 ? 'PASS' : 'FAIL', health.data);

  // 2. Register
  const email = `test${Date.now()}@example.com`;
  const reg = await request('POST', '/auth/register', {
    name: 'Test User',
    email,
    phone: '9876543210',
    password: 'test123',
  });
  console.log('2. POST /api/auth/register:', reg.status === 201 ? 'PASS' : 'FAIL', reg.data.token ? 'token received' : reg.data);

  if (reg.data.token) token = reg.data.token;

  // 3. Login
  const login = await request('POST', '/auth/login', { email, password: 'test123' });
  console.log('3. POST /api/auth/login:', login.status === 200 ? 'PASS' : 'FAIL', login.data.token ? 'token received' : login.data);
  if (login.data.token) token = login.data.token;

  // 4. Get profile (auth required)
  const me = await request('GET', '/auth/me', null, token);
  console.log('4. GET /api/auth/me:', me.status === 200 ? 'PASS' : 'FAIL', me.data.name || me.data);

  // 5. Products
  const products = await request('GET', '/products');
  console.log('5. GET /api/products:', products.status === 200 ? 'PASS' : 'FAIL', Array.isArray(products.data) ? `${products.data.length} products` : products.data);

  // 6. Wallet refill
  const refill = await request('POST', '/auth/wallet/refill', null, token);
  console.log('6. POST /api/auth/wallet/refill:', refill.status === 200 ? 'PASS' : 'FAIL', refill.data.walletBalance != null ? `balance ${refill.data.walletBalance}` : refill.data);

  // 7. Place order (wallet)
  const orderPayload = {
    items: [{ id: '1', name: 'Test', price: 10, quantity: 1, image: '' }],
    totalAmount: 10,
    deliveryAddress: '123 Test St, City, 400001',
    paymentMethod: 'wallet',
  };
  const order = await request('POST', '/orders', orderPayload, token);
  console.log('7. POST /api/orders:', order.status === 201 ? 'PASS' : 'FAIL', order.data.id || order.data);

  // 8. Get my orders
  const orders = await request('GET', '/orders', null, token);
  console.log('8. GET /api/orders:', orders.status === 200 ? 'PASS' : 'FAIL', Array.isArray(orders.data) ? `${orders.data.length} orders` : orders.data);

  console.log('\n=== API tests completed ===');
}

run().catch((e) => console.error('Error:', e.message));
