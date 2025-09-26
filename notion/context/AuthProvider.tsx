import { createContext, useContext, useState, useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'my-session';

// Tipos (iguais aos anteriores)
type User = {
  id: string;
  email: string;
};
type Session = {
  access_token: string;
  user: User;
};
type AuthContextData = {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
};

const AuthContext = createContext<AuthContextData>({ 
  session: null, 
  loading: true, // Inicia como true enquanto carrega a sessão do storage
  setSession: () => {} 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const storedSession = await AsyncStorage.getItem(SESSION_KEY);
        if (storedSession) {
          setSessionState(JSON.parse(storedSession));
        }
      } catch (e) {
        console.error("Failed to load session from storage", e);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  const handleSetSession = async (newSession: Session | null) => {
    setSessionState(newSession);
    if (newSession) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    } else {
      await AsyncStorage.removeItem(SESSION_KEY);
    }
  };

  // Lógica de redirecionamento
  const segments = useSegments();
  useEffect(() => {
    if (loading) return; // Não faz nada enquanto carrega a sessão

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!session && !inAuthGroup) {
      router.replace('/(auth)/Login');
    }
  }, [session, segments, loading]);

  return (
    <AuthContext.Provider value={{ session, loading, setSession: handleSetSession }}>
      {children}
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
