import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { LayoutProvider } from "@/context/LayoutContext";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { NoteProvider } from "@/context/NoteContext";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cognition",
  description: "Cognition is more than just a notepad - Developed by Primer",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <NoteProvider>
              <FavoriteProvider>
                <LayoutProvider>{children}</LayoutProvider>
              </FavoriteProvider>
            </NoteProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
