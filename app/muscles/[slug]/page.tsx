"use client";

import { useState, Suspense, lazy } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, ChevronRight } from "lucide-react";
import { getMuscleGroup, MUSCLE_GROUPS } from "@/data/exercises";
import StepInstructions from "@/components/step-instructions";
import PhaseIndicator from "@/components/phase-indicator";
import MuscleCard from "@/components/muscle-card";

const ExerciseViewer3D = lazy(() => import("@/components/exercise-viewer-3d"));

function CanvasFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full border-2 border-accent-purple border-t-transparent animate-spin mx-auto" />
        <p className="text-white/40 text-sm font-mono">Chargement 3D…</p>
      </div>
    </div>
  );
}

export default function MusclePage({
  params,
}: {
  params: { slug: string };
}) {
  const group = getMuscleGroup(params.slug);
  if (!group) notFound();

  const [activeExIdx, setActiveExIdx] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const exercise = group.exercises[activeExIdx];

  const otherGroups = MUSCLE_GROUPS.filter((g) => g.slug !== params.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-bg-primary pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Accueil
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span style={{ color: group.color }}>{group.name}</span>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: group.color }}
            />
            <h1 className="text-3xl font-black text-white">{group.name}</h1>
          </div>
          <p className="text-white/50">{group.description}</p>
        </motion.div>

        {/* Exercise tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {group.exercises.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => setActiveExIdx(i)}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor:
                  activeExIdx === i ? `${group.color}25` : "rgba(255,255,255,0.05)",
                color: activeExIdx === i ? group.color : "rgba(255,255,255,0.5)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor:
                  activeExIdx === i ? `${group.color}60` : "rgba(255,255,255,0.08)",
              }}
            >
              {ex.name}
            </button>
          ))}
        </div>

        {/* Main 2-column layout */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-6 mb-12">
          {/* 3D Viewer */}
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-bg-card border border-white/8 rounded-2xl overflow-hidden"
          >
            <div className="canvas-container h-[420px] sm:h-[500px] relative">
              <Suspense fallback={<CanvasFallback />}>
                <ExerciseViewer3D
                  exercise={exercise}
                  autoRotate={autoRotate}
                />
              </Suspense>

              {/* Controls overlay */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => setAutoRotate((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white text-xs transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  {autoRotate ? "Stop" : "Rotation"}
                </button>
              </div>

              {/* Exercise name overlay */}
              <div className="absolute top-3 left-3">
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold font-mono"
                  style={{
                    backgroundColor: `${group.color}20`,
                    color: group.color,
                    border: `1px solid ${group.color}40`,
                  }}
                >
                  {exercise.name}
                </div>
              </div>
            </div>

            {/* Phase indicator */}
            <PhaseIndicator phases={exercise.phases} />
          </motion.div>

          {/* Instructions */}
          <motion.div
            key={`inst-${exercise.id}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-bg-card border border-white/8 rounded-2xl p-6"
          >
            <StepInstructions exercise={exercise} accentColor={group.color} />
          </motion.div>
        </div>

        {/* Other muscle groups */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">
            Autres groupes musculaires
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherGroups.map((g, i) => (
              <MuscleCard key={g.slug} group={g} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
