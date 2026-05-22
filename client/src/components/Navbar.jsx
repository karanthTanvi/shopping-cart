import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// top bar — full row on desktop; collapses into a hamburger menu on phones
export default function Navbar({ cartCount, search, onSearchChange, onCartClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false); // controls the mobile dropdown

  // the search box — reused in both the desktop bar and the mobile menu
  const searchBox = (
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
        <button className="nav-search-clear" onClick={() => onSearchChange('')} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );

  // the account links — reused in both layouts
  const accountLinks = (
    <>
      {user ? (
        <>
          {user.role === 'admin' && <Link to="/admin" className="cart-btn">ADMIN</Link>}
          <Link to="/profile" className="cart-btn">ACCOUNT</Link>
          <button className="cart-btn" onClick={logout}>LOG OUT</button>
        </>
      ) : (
        <Link to="/login" className="cart-btn">LOG IN</Link>
      )}
    </>
  );

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">AUREL</Link>
      </div>

      {/* desktop layout — everything in one row */}
      <div className="nav-right nav-desktop">
        {searchBox}
        {accountLinks}
        <button className="cart-btn" onClick={onCartClick}>BAG ({cartCount})</button>
      </div>

      {/* mobile layout — bag + hamburger button */}
      <div className="nav-mobile">
        <button className="cart-btn" onClick={onCartClick}>BAG ({cartCount})</button>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* mobile dropdown — shown only when the menu is open */}
      {menuOpen && (
        <div className="nav-menu">
          {searchBox}
          <div className="nav-menu-links" onClick={() => setMenuOpen(false)}>
            {accountLinks}
          </div>
        </div>
      )}
    </nav>
  );
}