import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import pb from '@/services/pocketbase';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGithub: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      if (pb.authStore.isValid && pb.authStore.record) {
        setUser(pb.authStore.record as unknown as User);
      }
      setIsLoading(false);
    };

    initAuth();

    const unsubscribe = pb.authStore.onChange((token, record) => {
      if (token && record) {
        setUser(record as unknown as User);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGithub = useCallback(() => {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    
    const callbackUrl = `${import.meta.env.VITE_POCKETBASE_URL}/api/auth/providers/github?redirectTo=${encodeURIComponent(redirectUrl)}`;
    window.location.href = callbackUrl;
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (pb.authStore.isValid) {
      try {
        await pb.collection('users').authRefresh();
      } catch (error) {
        console.error('Failed to refresh auth:', error);
        logout();
      }
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithGithub,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
