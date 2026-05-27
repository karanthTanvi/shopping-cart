import { createContext, useContext, useState } from 'react';
import * as api from '../api';

// the shared container that holds login info for the whole app
const AuthContext = createContext();

// wraps the app so every component can access the logged-in user
export function AuthProvider({ children }) {
  // user holds the logged-in person, or null if nobody is logged in
  // it starts by checking localStorage so a page refresh keeps you logged in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aurel_user');
    // saved data is text, so parse it back into an object
    return saved ? JSON.parse(saved) : null;
  });

  // runs when someone logs in
  async function login(email, password) {
    // send the email and password to the backend, get back a token and user
    const data = await api.login({ email, password });
    // store the token so future requests can prove who we are
    api.setToken(data.token);
    // store the user details as text so they survive a refresh
    localStorage.setItem('aurel_user', JSON.stringify(data.user));
    // update state so the whole app re-renders as logged in
    setUser(data.user);
  }

  // runs when someone logs out
  function logout() {
    // remove the saved token
    api.clearToken();
    // remove the saved user details
    localStorage.removeItem('aurel_user');
    // clear state so the app re-renders as logged out
    setUser(null);
  }

  // make the user and the login and logout functions available to the app
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// shortcut so components can call useAuth() instead of useContext every time
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}