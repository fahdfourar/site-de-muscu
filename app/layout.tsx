import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "KINEFORM — Perfectionne chaque mouvement.",
  description:
    "Le labo du mouvement. Animations 3D interactives pour apprendre la technique parfaite en musculation. Conçu pour les débutants.",
  keywords: ["musculation", "technique", "débutant", "exercice", "3D", "mouvement"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${syne.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans antialiased bg-ink-900 text-bone grain">
        <Navbar />
        <main className="relative z-[2]">{children}</main>
      </body>
    </html>
  );
}
