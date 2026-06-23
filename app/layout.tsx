import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "KINEFORM — Maîtrise chaque rep.",
  description:
    "Animations 3D interactives pour apprendre la technique parfaite en musculation. Conçu pour les débutants.",
  keywords: ["musculation", "technique", "débutant", "exercice", "3D", "animation"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased bg-bg-primary text-text-primary">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
