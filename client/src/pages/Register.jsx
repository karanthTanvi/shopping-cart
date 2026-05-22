import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../api';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  // creates the account, then sends the user to the login page
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // check the two passwords match before contacting the server
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    // enforce a basic minimum length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await api.register({ name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-wrap">
      <h1 className="auth-title">CREATE ACCOUNT</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        <input
          className="auth-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button className="auth-btn" type="submit">CREATE ACCOUNT</button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}