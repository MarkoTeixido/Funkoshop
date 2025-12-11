import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Funkoshop",
  description: "Tienda de Funkos",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${raleway.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
