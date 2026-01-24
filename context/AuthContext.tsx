'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../lib/api';

// --- Types ---
type User = {
  id: string;
  email: string;
  displayName: string | null;
};

type Session = {
  accessToken: string;
  user: User;
};

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signIn: (session: Session) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signIn: () => {},
  signOut: () => {},
});

const SESSION_KEY = 'notion-web-session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadSession() {
      try {
        const storedSession = localStorage.getItem(SESSION_KEY);
        if (storedSession) {
          const parsedSession: Session = JSON.parse(storedSession);
          setSession(parsedSession);
          // Set axios default header if you have a helper for that
          // api.defaults.headers.common['Authorization'] = `Bearer ${parsedSession.access_token}`;
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  const signIn = (newSession: Session) => {
    setSession(newSession);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    // api.defaults.headers.common['Authorization'] = `Bearer ${newSession.access_token}`;
  };

  const signOut = () => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
    // delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  // Redirection Logic
  useEffect(() => {
    if (loading) return;

    const publicRoutes = ['/login', '/signup'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!session && !isPublicRoute) {
      router.push('/login');
    } else if (session && isPublicRoute) {
      router.push('/');
    }
  }, [session, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
