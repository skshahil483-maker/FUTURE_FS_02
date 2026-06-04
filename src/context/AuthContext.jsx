import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem('crm_session');
    if (session) {
      try {
        const userData = JSON.parse(session);
        setIsAuthenticated(true);
        setCurrentUser(userData);
      } catch (e) {
        localStorage.removeItem('crm_session');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Validate simple hardcoded admin credentials
    if (email.toLowerCase() === 'admin@crm.com' && password === 'admin123') {
      const userData = { email: email.toLowerCase(), name: 'System Admin' };
      localStorage.setItem('crm_session', JSON.stringify(userData));
      setIsAuthenticated(true);
      setCurrentUser(userData);
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password. Use admin@crm.com / admin123' };
    }
  };

  const logout = () => {
    localStorage.removeItem('crm_session');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
