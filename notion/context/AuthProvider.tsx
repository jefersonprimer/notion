// /context/AuthProvider.tsx

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { View, ActivityIndicator } from 'react-native';

// 1. Definir o tipo do valor que o contexto irá fornecer
type AuthContextData = {
  session: Session | null;
  loading: boolean;
};

// 2. Criar o Contexto
const AuthContext = createContext<AuthContextData>({
  session: null,
  loading: true,
});

// 3. Criar o Componente Provedor (Provider)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tenta pegar a sessão ativa quando o app inicia
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // O mais importante: escuta as mudanças no estado de autenticação
    // Isso é acionado quando o usuário faz login, logout, etc.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Se não estiver mais carregando, mantém como false
      if (loading) setLoading(false);
    });

    // Limpa a inscrição quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Criar um Hook customizado para usar o contexto facilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
