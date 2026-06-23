"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MUSCLE_GROUPS } from "@/data/exercises";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [muscleOpen, setMuscleOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bg-primary/90 backdrop-blur-xl border-b border-white/5 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              KINE<span className="text-transparent bg-clip-text bg-gradient-hero">FORM</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Muscles dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMuscleOpen(true)}
              onMouseLeave={() => setMuscleOpen(false)}
            >
              <button className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm font-medium">
                Muscles <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {muscleOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-bg-card border border-white/10 rounded-xl shadow-2xl p-2 grid grid-cols-2 gap-1"
                  >
                    {MUSCLE_GROUPS.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/muscles/${g.slug}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                        onClick={() => setMuscleOpen(false)}
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: g.color }}
                        />
                        <span className="text-white/80 group-hover:text-white text-sm transition-colors">
                          {g.name}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/pricing"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === "/pricing"
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              )}
            >
              Tarifs
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-white/70 hover:text-white transition-colors font-medium"
                >
                  Mon espace
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-white/50 hover:text-white/80 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-white/70 hover:text-white transition-colors font-medium"
                >
                  Connexion
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-purple to-accent-cyan text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Pro
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-card border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <p className="text-xs text-white/40 uppercase tracking-wider px-3 py-1 font-mono">
                Muscles
              </p>
              {MUSCLE_GROUPS.map((g) => (
                <Link
                  key={g.slug}
                  href={`/muscles/${g.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: g.color }}
                  />
                  <span className="text-white/80">{g.name}</span>
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link
                  href="/pricing"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-white/70"
                >
                  Tarifs
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2.5 text-white/70"
                    >
                      Mon espace
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-2.5 text-left text-white/50"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2.5 text-white/70"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setMenuOpen(false)}
                      className="mx-3 py-2.5 text-center rounded-lg bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-semibold"
                    >
                      Passer Pro
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
