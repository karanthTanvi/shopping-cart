import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [carts, setCarts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // only admins may see this page — send everyone else back to the shop
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    api.getAllCarts()
      .then(setCarts)
      .catch(() => setError('Unable to load carts.'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) {
    return <div className="admin-wrap"><p>Loading…</p></div>;
  }

  return (
    <div className="admin-wrap">
      <Link to="/" className="admin-back">← BACK TO SHOP</Link>
      <h1 className="admin-title">ALL CUSTOMER BAGS</h1>

      {error && <p className="auth-error">{error}</p>}

      {carts.length === 0 ? (
        <p style={{ color: '#9b9b97', fontSize: '0.75rem' }}>No customers yet.</p>
      ) : (
        carts.map((c) => (
          <div className="admin-user" key={c.userId}>
            <div className="admin-user-head">
              {c.name} <span>· {c.email}</span>
            </div>

            {c.items.length === 0 ? (
              <p style={{ color: '#9b9b97', fontSize: '0.7rem' }}>Empty bag</p>
            ) : (
              <>
                {c.items.map((item) => (
                  <div className="admin-row" key={item._id}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>$ {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="admin-total">$ {c.total.toLocaleString()}</div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}