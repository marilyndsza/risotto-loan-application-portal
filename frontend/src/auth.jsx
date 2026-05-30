import { createContext, useContext, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { loginAgent } from './api.js';

const STORAGE_KEY = 'risotto-session';
const AuthContext = createContext(null);

function readSession() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  } catch (_err) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  async function login(credentials) {
    const nextSession = await loginAgent(credentials);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession;
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  const value = useMemo(() => ({
    isAuthenticated: Boolean(session?.token),
    session,
    user: session?.user || null,
    login,
    logout
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
