import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// top bar — brand in the centre, bag count and account links on the right
export default function Navbar({ cartCount, onCartClick }) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left"></div>
      <div className="nav-center">
        <Link to="/" className="logo">AUREL</Link>
      </div>
      <div className="nav-right">
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