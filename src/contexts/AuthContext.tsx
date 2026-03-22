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

  const loginWithGithub = useCallback(async () => {
    try {
      const authData = await pb.collection('users').listAuthMethods();
      const githubProvider = authData.oauth2?.providers.find(p => p.name === 'github');
      
      if (!githubProvider) {
        console.error('GitHub OAuth provider not configured');
        alert('GitHub OAuth is not configured. Please contact support.');
        return;
      }

      const redirectUrl = `${window.location.origin}/auth/callback`;
      const state = githubProvider.state;
      const codeVerifier = githubProvider.codeVerifier;
      
      const authUrl = new URL(githubProvider.authURL);
      authUrl.searchParams.set('redirect_uri', redirectUrl);
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('code_challenge', githubProvider.codeChallenge);
      authUrl.searchParams.set('code_challenge_method', githubProvider.codeChallengeMethod);
      
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('OAuth error:', error);
      alert('Failed to start GitHub login. Please try again.');
    }
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
