import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TabBar from '../components/TabBar';
import ProductGrid from '../components/ProductGrid';
import ProductDetail from '../components/ProductDetail';
import CartSidebar from '../components/CartSidebar';
import Toast from '../components/Toast';

export default function Shop() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null); // product shown in the detail overlay
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  // load products once when the page first opens
  useEffect(() => {
    api.seed()
      .then(() => api.getProducts())
      .then(setProducts)
      .catch(() => setError('Unable to load products. Please try again.'));
  }, []);

  // load the logged-in user's cart; runs when the user changes
  useEffect(() => {
    if (!user) return;
    let active = true; // guards against a stale response after logout
    api.getCart()
      .then((items) => { if (active) setCart(items); })
      .catch(() => {});
    return () => { active = false; };
  }, [user]);

  // shows a toast message that clears itself after 3 seconds
  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  }

  // adds a product to the bag — sends guests to the login page first
  async function handleAdd(product) {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      const updated = await api.getCart();
      setCart(updated);
      showToast(`${product.name} — ADDED TO BAG`);
    } catch {
      showToast('SOMETHING WENT WRONG — PLEASE TRY AGAIN');
    }
  }

  // changes an item's quantity, then refreshes the cart from the server
  async function handleUpdateQty(id, quantity) {
    await api.updateCartItem(id, quantity);
    setCart(await api.getCart());
  }

  async function handleRemove(id) {
    await api.removeCartItem(id);
    setCart(await api.getCart());
    showToast('ITEM REMOVED');
  }

  async function handleClear() {
    await api.clearCart();
    setCart([]);
    showToast('BAG CLEARED');
  }

  // checkout empties the bag to simulate a completed order
  async function handleCheckout() {
    await api.clearCart();
    setCart([]);
    setCartOpen(false);
    showToast('ORDER PLACED — THANK YOU FOR SHOPPING WITH AUREL');
  }

  // filter products by the selected category, then by the search text
  const visible = products
    .filter((p) => category === 'all' || p.category === category)
    // match the search text against the START of any word in the product name
    .filter((p) => {
      const term = search.toLowerCase().trim();
      if (!term) return true; // empty search shows everything
      return p.name
        .toLowerCase()
        .split(' ')                       // break the name into words
        .some((word) => word.startsWith(term)); // keep it if any word starts with the term
    });

  // logged-out visitors always see an empty bag
  const displayCart = user ? cart : [];
  const cartCount = displayCart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <Navbar
        cartCount={cartCount}
        search={search}
        onSearchChange={setSearch}
        onCartClick={() => setCartOpen(true)}
      />
      <TabBar active={category} onSelect={setCategory} />

      <main>
        {error
          ? <p style={{ textAlign: 'center', color: '#999', padding: '4rem' }}>{error}</p>
          : <ProductGrid products={visible} onOpen={setSelected} onAdd={handleAdd} />}
      </main>

      <ProductDetail product={selected} onClose={() => setSelected(null)} onAdd={handleAdd} />

      <CartSidebar
        open={cartOpen}
        items={displayCart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onClear={handleClear}
        onCheckout={handleCheckout}
      />

      <Toast message={toast} />
    </>
  );
}