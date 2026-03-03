"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users/login", { email, password });
      signIn(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || t("errors.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t("title")}
          </h2>
        
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("fields.emailLabel")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                placeholder={t("fields.emailPlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("fields.passwordLabel")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                placeholder={t("fields.passwordPlaceholder")}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-800 transition-colors"
            >
              {loading ? t("submitting") : t("submit")}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button className="text-sm">
              <Link href="#" className="font-medium uppercase text-blue-600 hover:text-blue-500 dark:text-blue-400">
                {t("forgotPassword")}
              </Link>
            </button>
            <button className="text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/signup"
                className="font-medium uppercase text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
              >
                {t("subtitleLink")}
              </Link>
            </button>
          </div>

          <div className="text-center text-sm">
            Ao continuar, você confirma que entende e aceita os <Link href="/terms-of-policy" className="underline">Termos e Condições</Link> e a <Link href="/privacy-policy" className="underline">Política de Privacidade</Link> 
          </div>
        </form>
      </div>
    </div>
  );
}
