import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// top bar — brand on the left; search, account and bag grouped on the right
export default function Navbar({ cartCount, search, onSearchChange, onCartClick }) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">AUREL</Link>
      </div>

      <div className="nav-right">
        <div className="nav-search-wrap">
          <svg className="nav-search-icon" viewBox="0 0 24 24" width="14" height="14"
  fill="none" stroke="currentColor" strokeWidth="1.5">
  <circle cx="11" cy="11" r="7" />
  <line x1="16" y1="16" x2="21" y2="21" />
</svg>
          <input
            className="nav-search"
            type="text"
            placeholder="SEARCH"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              className="nav-search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {user ? (
          <>
            {user.role === 'admin' && <Link to="/admin" className="cart-btn">ADMIN</Link>}
            <button className="cart-btn" onClick={logout}>LOG OUT</button>
          </>
        ) : (
          <Link to="/login" className="cart-btn">LOG IN</Link>
        )}
        <button className="cart-btn" onClick={onCartClick}>
          BAG ({cartCount})
        </button>
      </div>
    </nav>
  );
}