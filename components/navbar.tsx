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

const NAV = [
  { label: "Muscles", href: "#", dropdown: true },
  { label: "Tarifs", href: "/pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [muscleOpen, setMuscleOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
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
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "max-w-7xl mx-auto flex items-center justify-between h-14 pl-4 pr-3 rounded-2xl transition-all duration-300 border",
          scrolled
            ? "bg-ink-800/70 backdrop-blur-2xl border-ink-line shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8),0_1px_0_0_rgba(244,244,239,0.05)_inset]"
            : "bg-ink-900/20 backdrop-blur-md border-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <motion.div whileHover={{ rotate: -8, scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
            <Logo className="w-8 h-8" />
          </motion.div>
          <span className="font-display font-extrabold text-lg tracking-tightest text-bone">
            KINE<span className="text-volt">FORM</span>
          </span>
        </Link>

        {/* Desktop nav with sliding hover indicator */}
        <div
          className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
          onMouseLeave={() => setHovered(null)}
        >
          <div
            className="relative"
            onMouseEnter={() => {
              setMuscleOpen(true);
              setHovered("Muscles");
            }}
            onMouseLeave={() => setMuscleOpen(false)}
          >
            <button className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-bone-muted hover:text-bone transition-colors z-10">
              Muscles
              <ChevronDown
                className={cn("w-3.5 h-3.5 transition-transform", muscleOpen && "rotate-180")}
              />
            </button>
            {hovered === "Muscles" && (
              <motion.div
                layoutId="nav-hover"
                className="absolute inset-0 rounded-xl bg-ink-600/60"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <AnimatePresence>
              {muscleOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[20rem] bg-ink-700/95 backdrop-blur-xl border border-ink-line rounded-2xl shadow-lift p-2.5"
                >
                  <p className="eyebrow text-bone-faint px-3 pt-1 pb-2">
                    09 groupes — choisis le tien
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {MUSCLE_GROUPS.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/muscles/${g.slug}`}
                        onClick={() => setMuscleOpen(false)}
                        className="group/item flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-ink-600 transition-colors"
                      >
                        <span
                          className="w-1.5 h-6 rounded-full flex-shrink-0 transition-all group-hover/item:h-7"
                          style={{ backgroundColor: g.color }}
                        />
                        <span className="text-bone-muted group-hover/item:text-bone text-sm font-medium transition-colors">
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
            onMouseEnter={() => setHovered("Tarifs")}
            className={cn(
              "relative px-4 py-2 rounded-xl text-sm font-medium transition-colors z-10",
              pathname === "/pricing" ? "text-bone" : "text-bone-muted hover:text-bone"
            )}
          >
            Tarifs
            {hovered === "Tarifs" && (
              <motion.div
                layoutId="nav-hover"
                className="absolute inset-0 -z-10 rounded-xl bg-ink-600/60"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
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
                className="btn-volt shimmer group flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm"
              >
                Commencer
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="md:hidden max-w-7xl mx-auto mt-2 bg-ink-700/95 backdrop-blur-xl border border-ink-line rounded-2xl overflow-hidden shadow-lift"
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
