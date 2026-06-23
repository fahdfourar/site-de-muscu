"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PLANS = [
  {
    id: "free",
    name: "Starter",
    price: "0",
    period: "pour toujours",
    description: "Pour découvrir la méthode",
    features: [
      "3 groupes musculaires",
      "Animations 3D interactives",
      "Instructions étape par étape",
      "Erreurs courantes",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "9,99",
    period: "/ mois",
    description: "Accès total au labo",
    popular: true,
    features: [
      "9 groupes musculaires complets",
      "27 exercices en 3D HD",
      "Phases détaillées de chaque mouvement",
      "Erreurs + corrections illustrées",
      "Progression sauvegardée",
      "Nouveaux exercices chaque mois",
    ],
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
    <div className="min-h-screen bg-ink-900 pt-28 bp-dots">
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-volt-glow pointer-events-none" />

      <div className="max-w-5xl mx-auto px-5 pb-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="eyebrow text-volt mb-4">// Tarifs</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-bone tracking-tightest mb-4">
            Simple. Honnête.
          </h1>
          <p className="text-bone-muted text-lg max-w-md mx-auto">
            Commence gratuitement. Passe Pro quand tu es prêt. Annule quand tu veux.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-8 z-10">
                  <span className="font-mono text-[11px] uppercase tracking-widest px-3 py-1 rounded-full bg-volt text-ink-900 font-bold">
                    Recommandé
                  </span>
                </div>
              )}

              <div
                className={`h-full flex flex-col rounded-3xl p-8 border ${
                  plan.popular
                    ? "bg-ink-700 border-volt/40 shadow-volt-sm"
                    : "bg-ink-800 border-ink-line"
                }`}
              >
                <div className="flex-1">
                  <h2 className="font-display font-bold text-2xl text-bone mb-1">
                    {plan.name}
                  </h2>
                  <p className="text-bone-muted text-sm mb-6">{plan.description}</p>

                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="font-display font-extrabold text-5xl text-bone tracking-tight">
                      {plan.price === "0" ? "Gratuit" : `${plan.price}€`}
                    </span>
                    {plan.price !== "0" && (
                      <span className="text-bone-faint text-sm font-mono">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.popular ? "bg-volt" : "bg-ink-600"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${
                              plan.popular ? "text-ink-900" : "text-volt"
                            }`}
                          />
                        </span>
                        <span className="text-bone-muted text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.id === "free" ? (
                  <Link
                    href="/auth/signup"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-ink-line text-bone font-semibold hover:bg-ink-600 transition-colors"
                  >
                    Commencer gratuitement
                  </Link>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-volt disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                    ) : (
                      <>
                        Passer Pro
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center font-mono text-xs text-bone-faint mt-10">
          Paiement sécurisé par Stripe · Sans engagement
        </p>
      </div>
    </div>
  );
}
