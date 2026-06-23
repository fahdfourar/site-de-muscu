"use client";

import { useState, Suspense, lazy, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Orbit, Hand } from "lucide-react";
import { getMuscleGroup, MUSCLE_GROUPS } from "@/data/exercises";
import StepInstructions from "@/components/step-instructions";
import PhaseIndicator from "@/components/phase-indicator";
import MuscleCard from "@/components/muscle-card";

const ExerciseViewer3D = lazy(() => import("@/components/exercise-viewer-3d"));

function CanvasFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-volt border-t-transparent animate-spin mx-auto" />
        <p className="font-mono text-xs text-bone-faint">chargement 3D…</p>
      </div>
    </div>
  );
}

export default function MusclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const group = getMuscleGroup(slug);
  if (!group) notFound();

  const [activeExIdx, setActiveExIdx] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const exercise = group.exercises[activeExIdx];
  const otherGroups = MUSCLE_GROUPS.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-ink-900 pt-24">
      <div className="max-w-7xl mx-auto px-5 pb-20">
        {/* Back + breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-mono text-xs text-bone-faint hover:text-bone transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            accueil
          </Link>
          <span className="text-bone-faint">/</span>
          <span
            className="font-mono text-xs"
            style={{ color: group.color }}
          >
            {group.name.toLowerCase()}
          </span>
        </div>

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-end gap-4 mb-10"
        >
          <span
            className="w-1.5 h-16 rounded-full"
            style={{ backgroundColor: group.color }}
          />
          <div>
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-bone tracking-tightest leading-none">
              {group.name}
            </h1>
            <p className="text-bone-muted mt-2">{group.description}</p>
          </div>
        </motion.div>

        {/* Exercise tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {group.exercises.map((ex, i) => {
            const active = activeExIdx === i;
            return (
              <button
                key={ex.id}
                onClick={() => setActiveExIdx(i)}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border"
                style={{
                  backgroundColor: active ? group.color : "transparent",
                  color: active ? "#0A0A0B" : "#9A9A93",
                  borderColor: active ? group.color : "#2C2C33",
                }}
              >
                {ex.name}
              </button>
            );
          })}
        </div>

        {/* Main 2-col */}
        <div className="grid lg:grid-cols-[1.45fr_1fr] gap-5 mb-20">
          {/* 3D viewer */}
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-ink-700 border border-ink-line rounded-3xl overflow-hidden"
          >
            <div className="scene-bg h-[440px] sm:h-[540px] relative tick-corners">
              <Suspense fallback={<CanvasFallback />}>
                <ExerciseViewer3D exercise={exercise} autoRotate={autoRotate} accent={group.color} />
              </Suspense>

              {/* top bar */}
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
                <div
                  className="px-3 py-1.5 rounded-lg font-mono text-xs font-medium pointer-events-auto"
                  style={{
                    backgroundColor: "rgba(10,10,11,0.6)",
                    color: group.color,
                    border: `1px solid ${group.color}40`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {exercise.name}
                </div>
                <button
                  onClick={() => setAutoRotate((v) => !v)}
                  className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-900/60 backdrop-blur border border-ink-line text-bone-muted hover:text-bone font-mono text-xs transition-colors"
                >
                  <Orbit className="w-3.5 h-3.5" />
                  {autoRotate ? "auto" : "manuel"}
                </button>
              </div>

              {/* hint */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 font-mono text-[11px] text-bone-faint pointer-events-none">
                <Hand className="w-3.5 h-3.5" />
                glisse pour tourner
              </div>
            </div>

            <PhaseIndicator phases={exercise.phases} />
          </motion.div>

          {/* Instructions */}
          <motion.div
            key={`inst-${exercise.id}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-ink-700 border border-ink-line rounded-3xl p-7"
          >
            <StepInstructions exercise={exercise} accentColor={group.color} />
          </motion.div>
        </div>

        {/* Other groups */}
        <div>
          <p className="eyebrow text-volt mb-5">// Continue</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherGroups.map((g, i) => (
              <MuscleCard key={g.slug} group={g} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
