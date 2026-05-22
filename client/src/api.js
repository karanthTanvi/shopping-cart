// central place for all backend calls
// every request that needs login automatically includes the saved token

const TOKEN_KEY = 'aurel_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// wraps fetch: adds JSON headers, attaches the token, and throws on any error response
async function request(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  // fetch does not throw on 400/500, so we check the status ourselves
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Something went wrong');
  }
  return res.json();
}

// --- auth ---
export const register = (body) => request('/api/register', { method: 'POST', body: JSON.stringify(body) });
export const login = (body) => request('/api/login', { method: 'POST', body: JSON.stringify(body) });

// --- profile ---
export const changePassword = (body) => request('/api/profile/password', { method: 'PUT', body: JSON.stringify(body) });

// --- products ---
export const seed = () => request('/api/seed', { method: 'POST' });
export const getProducts = () => request('/api/products');

// --- cart ---
export const getCart = () => request('/api/cart');
export const addToCart = (body) => request('/api/cart', { method: 'POST', body: JSON.stringify(body) });
export const updateCartItem = (id, quantity) => request(`/api/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
export const removeCartItem = (id) => request(`/api/cart/${id}`, { method: 'DELETE' });
export const clearCart = () => request('/api/cart', { method: 'DELETE' });

// --- admin ---
export const getAllCarts = () => request('/api/admin/carts');