"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, User, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/logo";
import { Field, PasswordField, Spinner, GoogleIcon } from "@/app/auth/login/page";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center px-5 bp-dots">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-ink-700 border border-ink-line rounded-3xl p-10 text-center max-w-md w-full tick-corners"
        >
          <div className="w-16 h-16 rounded-2xl bg-volt flex items-center justify-center mx-auto mb-6 text-ink-900 text-3xl font-bold">
            ✓
          </div>
          <h2 className="font-display font-extrabold text-2xl text-bone mb-3">
            Vérifie tes emails
          </h2>
          <p className="text-bone-muted mb-6">
            Un lien de confirmation a été envoyé à{" "}
            <span className="text-bone font-mono text-sm">{email}</span>
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 btn-volt px-6 py-3 rounded-xl"
          >
            Retour à la connexion
          </Link>
        </motion.div>
      </div>
    );
  }

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
              Commence ici.
            </h1>
            <p className="text-bone-muted text-sm mt-1">Gratuit, sans carte bancaire</p>
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

          <form onSubmit={handleSignup} className="space-y-4">
            <Field
              icon={<User className="w-4 h-4" />}
              label="Prénom"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Ton prénom"
            />
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
              placeholder="6 caractères minimum"
              minLength={6}
            />

            {error && (
              <p className="text-ember text-xs bg-ember/10 border border-ember/20 rounded-lg px-3 py-2 font-mono">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-volt disabled:opacity-50"
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  Créer mon compte
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-bone-muted text-sm mt-6">
            Déjà inscrit ?{" "}
            <Link href="/auth/login" className="text-volt hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
