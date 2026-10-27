import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdminUser {
  username: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const TOKEN_KEY = 'diwali_glow_admin_token';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdminUser(null);
    try {
      fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    } catch {}
  }, []);

  // Verify existing token on initial load
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setAdminUser(data.user);
          setToken(storedToken);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.warn('Could not verify admin session with server:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [logout]);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid credentials' };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setAdminUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error connecting to server' };
    }
  };

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (!token) return {};
    return {
      'Authorization': `Bearer ${token}`
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        adminUser,
        isAuthenticated: !!token && !!adminUser,
        isLoading,
        login,
        logout,
        getAuthHeaders
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
