"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, ArrowRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PLANS = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    description: "Pour découvrir KINEFORM",
    color: "#06B6D4",
    features: [
      "3 groupes musculaires",
      "Animations 3D interactives",
      "Instructions étape par étape",
      "Erreurs courantes",
    ],
    locked: ["Pectoraux, Dos, Quadriceps uniquement"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    description: "Accès complet à tout KINEFORM",
    color: "#7C3AED",
    popular: true,
    features: [
      "8 groupes musculaires complets",
      "24 exercices avec animations 3D HD",
      "Phases détaillées de chaque exercice",
      "Erreurs courantes + corrections",
      "Progression sauvegardée",
      "Nouveaux exercices chaque mois",
    ],
    locked: [],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-16">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full bg-accent-purple/8 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-xs text-accent-purple font-mono uppercase tracking-wider mb-3">
            Tarifs
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Simple et transparent
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Commence gratuitement, passe Pro quand tu veux.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-accent-purple to-accent-cyan text-white text-xs font-bold">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div
                className="bg-bg-card border rounded-3xl p-8 h-full flex flex-col"
                style={{
                  borderColor: plan.popular
                    ? `${plan.color}50`
                    : "rgba(255,255,255,0.08)",
                  boxShadow: plan.popular
                    ? `0 0 40px ${plan.color}15`
                    : "none",
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute inset-0 rounded-3xl opacity-5"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${plan.color}, transparent 70%)`,
                    }}
                  />
                )}

                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <Zap className="w-3.5 h-3.5" style={{ color: plan.color }} />
                    </div>
                    <h2 className="text-white font-bold text-lg">{plan.name}</h2>
                  </div>

                  <div className="flex items-baseline gap-1 mt-4 mb-2">
                    <span className="text-4xl font-black text-white">
                      {plan.price === 0 ? "Gratuit" : `${plan.price}€`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-white/40 text-sm">/mois</span>
                    )}
                  </div>
                  <p className="text-white/50 text-sm mb-6">{plan.description}</p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: plan.color }}
                        />
                        <span className="text-white/80 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10">
                  {plan.id === "free" ? (
                    <a
                      href="/"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/15 text-white/70 hover:bg-white/5 transition-colors font-semibold text-sm"
                    >
                      Commencer gratuitement
                    </a>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Passer Pro
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/30 text-sm mt-10">
          Paiement sécurisé par Stripe · Annulation à tout moment · Pas d&apos;engagement
        </p>
      </div>
    </div>
  );
}
