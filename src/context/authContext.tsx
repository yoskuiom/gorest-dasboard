import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  mode: 'users' | 'posts';
  setToken: (token: string) => void;
  setMode: (mode: 'users' | 'posts') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [token, setTokenState] = useState<string | null>(localStorage.getItem('gorest_token'));
  const [mode, setMode] = useState<'users' | 'posts'>('users');

  const setToken = (newToken: string) => {
    localStorage.setItem('gorest_token', newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    localStorage.removeItem('gorest_token');
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, mode, setToken, setMode, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};