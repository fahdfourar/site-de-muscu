"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Zap, Play, ArrowRight, Box, List, ShieldCheck } from "lucide-react";
import MuscleCard from "@/components/muscle-card";
import { MUSCLE_GROUPS } from "@/data/exercises";

export default function HomePage() {
  const gridRef = useRef(null);
  const featRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-100px" });
  const featInView = useInView(featRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-purple/10 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent-cyan/10 blur-[100px]" />
        </div>

        {/* Grid lines bg */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-accent-purple" />
            <span className="text-xs text-accent-purple font-semibold tracking-wider uppercase">
              Musculation pour débutants
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-black text-white leading-tight mb-6"
          >
            Maîtrise{" "}
            <span className="gradient-text">chaque rep.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Des animations 3D interactives pour apprendre la technique parfaite
            dès ta première séance. Simple, clair, efficace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="#muscles"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-bold text-base hover:opacity-90 transition-opacity glow-purple"
            >
              <Zap className="w-4 h-4" />
              Commencer gratuitement
            </Link>
            <Link
              href="/muscles/pectoraux"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/15 text-white/80 font-semibold text-base hover:border-white/30 hover:text-white transition-all"
            >
              <Play className="w-4 h-4" />
              Voir une démo
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 flex items-center justify-center gap-8 text-white/30 text-sm"
          >
            <span>✦ 8 groupes musculaires</span>
            <span>✦ Animations 3D interactives</span>
            <span>✦ Gratuit pour commencer</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20"
        >
          <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </div>
        </motion.div>
      </section>

      {/* ── Muscle grid ── */}
      <section id="muscles" className="py-24 px-4" ref={gridRef}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-xs text-accent-cyan font-mono uppercase tracking-wider mb-3">
              Groupes musculaires
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Quel muscle veux-tu travailler ?
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MUSCLE_GROUPS.map((group, i) => (
              <MuscleCard key={group.slug} group={group} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4" ref={featRef}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Box className="w-6 h-6" />,
                color: "#7C3AED",
                title: "Visualise le mouvement",
                desc: "Animations 3D interactives que tu peux faire pivoter. Vois chaque phase du mouvement clairement.",
              },
              {
                icon: <List className="w-6 h-6" />,
                color: "#06B6D4",
                title: "Étape par étape",
                desc: "Instructions claires en 4 étapes max. Adaptées aux débutants, sans jargon technique.",
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                color: "#10B981",
                title: "Évite les blessures",
                desc: "Les erreurs les plus courantes sont listées avec leur correction. Apprends à faire juste dès le départ.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-bg-card border border-white/8 rounded-2xl p-6"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${f.color}20`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Pro ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden border border-accent-purple/20 p-10 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.08) 100%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-hero opacity-5" />
            <div className="relative z-10">
              <p className="text-xs text-accent-purple font-mono uppercase tracking-wider mb-3">
                KINEFORM PRO
              </p>
              <h2 className="text-3xl font-black text-white mb-4">
                Débloque tous les muscles
              </h2>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Accès complet aux 8 groupes musculaires, HD animations, phases
                détaillées et progression sauvegardée.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-bold hover:opacity-90 transition-opacity"
              >
                Voir les tarifs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <p className="text-white/30 text-sm">
          © 2025 KINEFORM — Maîtrise chaque rep.
        </p>
      </footer>
    </div>
  );
}
