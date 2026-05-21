import { createContext, useContext, useState } from 'react';
import * as api from '../api';

// not exported — kept private to this file, which satisfies the lint rule
const AuthContext = createContext();

// makes the logged-in user available anywhere in the app
export function AuthProvider({ children }) {
  // load the saved user on startup so a refresh keeps you logged in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aurel_user');
    return saved ? JSON.parse(saved) : null;
  });

  // logs in, then saves both the token and user details
  async function login(email, password) {
    const data = await api.login({ email, password });
    api.setToken(data.token);
    localStorage.setItem('aurel_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  // logs out and clears everything saved
  function logout() {
    api.clearToken();
    localStorage.removeItem('aurel_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// shortcut hook so components can just call useAuth()
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}