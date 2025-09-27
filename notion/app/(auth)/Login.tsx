// /app/(auth)/Login.tsx

import { useState, useEffect } from "react";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import ForgotPassword from "@/components/auth/ForgotPassword";
import { useAuth } from "@/context/AuthProvider";

export default function AuthScreen() {
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const { setSession } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure this runs only in browser environment
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1)); // Remove # and parse
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const expiresIn = params.get('expires_in');

      if (accessToken && refreshToken && expiresIn) {
        setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: parseInt(expiresIn),
          // Supabase also provides user data here, but we might fetch it later
          user: null, // Placeholder, actual user data will be fetched on login
        });
        // Clear the hash from the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        setAuthView('login'); // Ensure we are on the login screen after processing
      }
    }
  }, [setSession]);

  if (authView === 'login') {
    return (
      <Login
        onSwitchToRegister={() => setAuthView('register')}
        onSwitchToForgotPassword={() => setAuthView('forgotPassword')}
      />
    );
  }

  if (authView === 'register') {
    return <Register onSwitchToLogin={() => setAuthView('login')} />;
  }

  if (authView === 'forgotPassword') {
    return <ForgotPassword onSwitchToLogin={() => setAuthView('login')} />;
  }
}
