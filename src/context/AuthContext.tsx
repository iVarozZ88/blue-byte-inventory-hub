
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const PASSWORD_STORAGE_KEY = "inventory-app-authenticated";

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on mount
    const authStatus = localStorage.getItem(PASSWORD_STORAGE_KEY) === "true";
    setIsAuthenticated(authStatus);
  }, []);

  const login = () => {
    localStorage.setItem(PASSWORD_STORAGE_KEY, "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(PASSWORD_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
