"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MUSCLE_GROUPS } from "@/data/exercises";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Logo from "./logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [muscleOpen, setMuscleOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 pt-3">
      <div
        className={cn(
          "max-w-7xl mx-auto flex items-center justify-between h-14 px-3 sm:px-4 rounded-2xl transition-all duration-300 border",
          scrolled
            ? "bg-ink-800/80 backdrop-blur-xl border-ink-line shadow-lift"
            : "bg-transparent border-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo className="w-8 h-8 transition-transform group-hover:rotate-[-6deg]" />
          <span className="font-display font-extrabold text-lg tracking-tightest text-bone">
            KINE<span className="text-volt">FORM</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <div
            className="relative"
            onMouseEnter={() => setMuscleOpen(true)}
            onMouseLeave={() => setMuscleOpen(false)}
          >
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-bone-muted hover:text-bone hover:bg-ink-600/50 transition-colors">
              Muscles
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {muscleOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-ink-700 border border-ink-line rounded-2xl shadow-lift p-2"
                >
                  <p className="eyebrow text-bone-faint px-3 py-2">
                    08 groupes
                  </p>
                  <div className="grid grid-cols-2 gap-0.5">
                    {MUSCLE_GROUPS.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/muscles/${g.slug}`}
                        onClick={() => setMuscleOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-ink-600 transition-colors group"
                      >
                        <span
                          className="w-1.5 h-6 rounded-full flex-shrink-0"
                          style={{ backgroundColor: g.color }}
                        />
                        <span className="text-bone-muted group-hover:text-bone text-sm font-medium transition-colors">
                          {g.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/pricing"
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
              pathname === "/pricing"
                ? "text-bone bg-ink-600/50"
                : "text-bone-muted hover:text-bone hover:bg-ink-600/50"
            )}
          >
            Tarifs
          </Link>
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-bone-muted hover:text-bone transition-colors font-medium px-3"
              >
                Mon espace
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-bone-faint hover:text-bone-muted transition-colors"
              >
                Sortir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-bone-muted hover:text-bone transition-colors font-medium px-3"
              >
                Connexion
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-1 btn-volt px-4 py-2 rounded-xl text-sm"
              >
                Commencer
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-bone-muted hover:text-bone"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden max-w-7xl mx-auto mt-2 bg-ink-700 border border-ink-line rounded-2xl overflow-hidden shadow-lift"
          >
            <div className="p-3">
              <p className="eyebrow text-bone-faint px-2 py-2">Muscles</p>
              <div className="grid grid-cols-2 gap-1">
                {MUSCLE_GROUPS.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/muscles/${g.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-ink-600 transition-colors"
                  >
                    <span
                      className="w-1.5 h-5 rounded-full"
                      style={{ backgroundColor: g.color }}
                    />
                    <span className="text-bone-muted text-sm">{g.name}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-ink-line flex flex-col gap-1">
                <Link
                  href="/pricing"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-bone-muted rounded-xl hover:bg-ink-600"
                >
                  Tarifs
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2.5 text-bone-muted rounded-xl hover:bg-ink-600"
                    >
                      Mon espace
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-2.5 text-left text-bone-faint rounded-xl hover:bg-ink-600"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2.5 text-bone-muted rounded-xl hover:bg-ink-600"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMenuOpen(false)}
                      className="btn-volt mt-1 py-3 text-center rounded-xl"
                    >
                      Commencer gratuitement
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
