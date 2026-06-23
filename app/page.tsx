"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Box, Layers, ShieldCheck, MousePointerClick } from "lucide-react";
import MuscleCard from "@/components/muscle-card";
import { MUSCLE_GROUPS } from "@/data/exercises";

const MARQUEE = [
  "DÉVELOPPÉ COUCHÉ",
  "SQUAT",
  "TRACTIONS",
  "SOULEVÉ DE TERRE",
  "DÉVELOPPÉ MILITAIRE",
  "DIPS",
  "HIP THRUST",
  "CURL BARRE",
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-ink-900">
      {/* ───────────────── HERO ───────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden bp-grid pt-28 pb-16"
      >
        {/* volt glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-volt-glow pointer-events-none" />

        <motion.div
          style={{ y: yTitle, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-5 w-full"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="flex items-center gap-2 eyebrow text-volt">
              <span className="w-2 h-2 rounded-full bg-volt animate-pulse" />
              Le labo du mouvement
            </span>
            <span className="h-px flex-1 max-w-[120px] bg-ink-line" />
            <span className="eyebrow text-bone-faint">v.2026</span>
          </motion.div>

          {/* Massive headline */}
          <h1 className="display-hero text-bone text-[clamp(2.25rem,8vw,7.5rem)] break-words">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="block"
            >
              PERFECTIONNE
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="block"
            >
              CHAQUE{" "}
              <span className="text-volt italic">mouvement.</span>
            </motion.span>
          </h1>

          {/* Sub + CTA row */}
          <div className="mt-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-bone-muted text-lg max-w-md leading-relaxed"
            >
              Des animations <span className="text-bone">3D interactives</span> qui
              te montrent exactement comment exécuter chaque exercice. Conçu pour
              ceux qui débutent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="#muscles"
                className="flex items-center justify-center gap-2 btn-volt px-7 py-4 rounded-2xl text-base"
              >
                Choisir un muscle
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                href="/muscles/pectoraux"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-ink-line text-bone font-semibold hover:bg-ink-700 hover:border-ink-500 transition-all"
              >
                <MousePointerClick className="w-4 h-4 text-volt" />
                Voir une démo 3D
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="eyebrow text-bone-faint">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-volt to-transparent animate-scan" />
        </motion.div>
      </section>

      {/* ───────────────── MARQUEE ───────────────── */}
      <div className="border-y border-ink-line py-4 overflow-hidden bg-ink-800">
        <div className="marquee-track items-center gap-8">
          {[...MARQUEE, ...MARQUEE].map((w, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="font-display font-bold text-2xl text-bone-faint whitespace-nowrap">
                {w}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-volt" />
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────── MUSCLE GRID ───────────────── */}
      <section id="muscles" className="py-24 px-5 relative bp-dots">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow text-volt mb-3">// Bibliothèque</p>
              <h2 className="font-display font-extrabold text-bone text-4xl sm:text-5xl tracking-tightest">
                Quel muscle
                <br />
                aujourd&apos;hui ?
              </h2>
            </div>
            <p className="text-bone-muted max-w-xs text-sm leading-relaxed">
              Les 9 groupes musculaires les plus travaillés. Choisis-en un, regarde
              le mouvement, reproduis-le.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MUSCLE_GROUPS.map((group, i) => (
              <MuscleCard key={group.slug} group={group} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── FEATURES ───────────────── */}
      <section className="py-24 px-5 border-t border-ink-line">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow text-volt mb-3">// Méthode</p>
          <h2 className="font-display font-extrabold text-bone text-4xl sm:text-5xl tracking-tightest mb-14 max-w-2xl">
            Apprendre vite, sans se blesser.
          </h2>

          <div className="grid md:grid-cols-3 gap-px bg-ink-line rounded-3xl overflow-hidden border border-ink-line">
            {[
              {
                n: "01",
                icon: <Box className="w-6 h-6" />,
                title: "Visualise en 3D",
                desc: "Une animation que tu peux faire tourner à 360°. Vois chaque angle, chaque phase du mouvement.",
              },
              {
                n: "02",
                icon: <Layers className="w-6 h-6" />,
                title: "Suis les étapes",
                desc: "4 étapes maximum, sans jargon. Clique sur une étape pour comprendre exactement quoi faire.",
              },
              {
                n: "03",
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Évite les erreurs",
                desc: "Les fautes classiques de débutant et leur correction, listées pour chaque exercice.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-ink-800 p-8 hover:bg-ink-700 transition-colors group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-sm text-bone-faint">{f.n}</span>
                  <div className="w-11 h-11 rounded-xl bg-volt/10 text-volt flex items-center justify-center group-hover:bg-volt group-hover:text-ink-900 transition-colors">
                    {f.icon}
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-bone mb-2">
                  {f.title}
                </h3>
                <p className="text-bone-muted text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-[2rem] overflow-hidden bg-volt p-10 sm:p-16 tick-corners"
          >
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(#0a0a0b 1px, transparent 1px), linear-gradient(90deg, #0a0a0b 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div>
                <p className="font-mono text-xs text-ink-900/60 tracking-widest uppercase mb-4">
                  Gratuit pour commencer
                </p>
                <h2 className="font-display font-extrabold text-ink-900 text-4xl sm:text-6xl tracking-tightest leading-[0.95]">
                  Prêt à bien
                  <br />
                  débuter ?
                </h2>
              </div>
              <Link
                href="/auth/signup"
                className="group flex items-center gap-3 bg-ink-900 text-bone px-8 py-5 rounded-2xl font-bold text-lg hover:bg-ink-800 transition-colors self-start lg:self-auto"
              >
                Créer mon compte
                <ArrowUpRight className="w-6 h-6 text-volt transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="border-t border-ink-line py-10 px-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-bone tracking-tight">
              KINE<span className="text-volt">FORM</span>
            </span>
            <span className="font-mono text-xs text-bone-faint">
              — Le labo du mouvement
            </span>
          </div>
          <p className="font-mono text-xs text-bone-faint">
            © 2026 · Perfectionne chaque mouvement
          </p>
        </div>
      </footer>
    </div>
  );
}
