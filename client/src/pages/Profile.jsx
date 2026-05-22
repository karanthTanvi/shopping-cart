import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // only logged-in users can see this page
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  // checks the form, then asks the server to change the password
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirm) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    try {
      await api.changePassword({ currentPassword, newPassword });
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-wrap">
      <Link to="/" className="admin-back">← BACK TO SHOP</Link>
      <h1 className="auth-title">MY ACCOUNT</h1>

      {/* account details — read from the logged-in user */}
      <div className="profile-info">
        <div className="profile-row">
          <span className="profile-label">NAME</span>
          <span className="profile-value">{user.name}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">EMAIL</span>
          <span className="profile-value">{user.email}</span>
        </div>

      </div>

      <h2 className="profile-subtitle">CHANGE PASSWORD</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="profile-success">{success}</p>}
        <input
          className="auth-input"
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button className="auth-btn" type="submit">UPDATE PASSWORD</button>
      </form>
    </div>
  );
}