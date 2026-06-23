"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Email ou mot de passe incorrect.");
    else router.push("/dashboard");
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-5 py-24 bp-dots">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-volt-glow pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-ink-700 border border-ink-line rounded-3xl p-8 tick-corners">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <Logo className="w-9 h-9" />
              <span className="font-display font-extrabold text-xl text-bone tracking-tight">
                KINE<span className="text-volt">FORM</span>
              </span>
            </Link>
            <h1 className="font-display font-extrabold text-3xl text-bone tracking-tight">
              Re-bonjour.
            </h1>
            <p className="text-bone-muted text-sm mt-1">Connecte-toi pour continuer</p>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-ink-line text-bone hover:bg-ink-600 transition-colors mb-6 font-medium"
          >
            <GoogleIcon />
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-ink-line" />
            <span className="font-mono text-xs text-bone-faint">ou</span>
            <div className="flex-1 h-px bg-ink-line" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Field
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="toi@exemple.com"
              required
            />
            <PasswordField
              value={password}
              onChange={setPassword}
              show={showPw}
              toggle={() => setShowPw((v) => !v)}
              placeholder="••••••••"
            />

            {error && (
              <p className="text-ember text-xs bg-ember/10 border border-ember/20 rounded-lg px-3 py-2 font-mono">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-volt shimmer disabled:opacity-50"
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  Se connecter
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-bone-muted text-sm mt-6">
            Pas de compte ?{" "}
            <Link
              href="/auth/signup"
              className="text-volt hover:underline font-medium"
            >
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function Field({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[11px] text-bone-muted uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bone-faint">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full bg-ink-800 border border-ink-line rounded-xl pl-10 pr-4 py-3 text-bone placeholder-bone-faint text-sm focus:outline-none focus:border-volt/60 transition-colors"
        />
      </div>
    </div>
  );
}

export function PasswordField({
  value,
  onChange,
  show,
  toggle,
  placeholder,
  minLength,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggle: () => void;
  placeholder: string;
  minLength?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[11px] text-bone-muted uppercase tracking-wider">
        Mot de passe
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone-faint" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={minLength}
          placeholder={placeholder}
          className="w-full bg-ink-800 border border-ink-line rounded-xl pl-10 pr-10 py-3 text-bone placeholder-bone-faint text-sm focus:outline-none focus:border-volt/60 transition-colors"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-bone-faint hover:text-bone"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
  );
}

export function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
