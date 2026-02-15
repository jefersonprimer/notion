import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LayoutProvider } from "@/context/LayoutContext";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { NoteProvider } from "@/context/NoteContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NoteProvider>
            <FavoriteProvider>
              <LayoutProvider>
                {children}
              </LayoutProvider>
            </FavoriteProvider>
          </NoteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
