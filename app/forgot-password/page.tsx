"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { AxiosError } from "axios";
import api from "@/lib/api";

function getApiErrorMessage(error: unknown): string | null {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? null;
}

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgotPasswordPage");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/users/forgot-password", { email });
      setSuccess(true);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err) || t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white p-6 dark:bg-zinc-800 md:bg-gray-50 md:dark:bg-zinc-900">
      <main className="flex flex-1 flex-col items-center px-4 py-6 md:py-10">
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="w-full space-y-6 md:bg-white p-6 md:dark:bg-zinc-800 md:max-w-md md:rounded-xl md:border md:border-gray-200 md:p-8 md:shadow-lg md:dark:border-zinc-700">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t("title")}
            </h2>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
                {t("success")}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                  placeholder={t("fields.emailPlaceholder")}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-zinc-800"
              >
                {loading ? t("submitting") : t("submit")}
              </button>
            </form>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                {t("backToLogin")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
