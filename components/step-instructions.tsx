"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, CheckCircle } from "lucide-react";
import type { Exercise } from "@/data/exercises";

export default function StepInstructions({
  exercise,
  accentColor,
}: {
  exercise: Exercise;
  accentColor: string;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [mistakesOpen, setMistakesOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-mono px-2 py-1 rounded-full"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {exercise.difficulty}
          </span>
          <span className="text-xs text-white/40">
            {exercise.secondaryMuscles.join(", ")}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
        <p className="text-white/50 text-sm mt-1">
          Muscle principal :{" "}
          <span className="text-white/80">{exercise.primaryMuscle}</span>
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider font-mono">
          Exécution
        </p>
        {exercise.steps.map((step, i) => (
          <motion.button
            key={i}
            onClick={() => setActiveStep(i)}
            whileTap={{ scale: 0.98 }}
            className="w-full text-left"
          >
            <div
              className="flex gap-4 p-4 rounded-xl border transition-all duration-200"
              style={{
                backgroundColor:
                  activeStep === i ? `${accentColor}12` : "transparent",
                borderColor:
                  activeStep === i ? `${accentColor}50` : "rgba(255,255,255,0.06)",
              }}
            >
              {/* Step number */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  backgroundColor:
                    activeStep === i ? accentColor : "rgba(255,255,255,0.06)",
                  color: activeStep === i ? "white" : "rgba(255,255,255,0.4)",
                }}
              >
                {i + 1}
              </div>

              <div>
                <p
                  className="font-semibold text-sm transition-colors"
                  style={{ color: activeStep === i ? "white" : "rgba(255,255,255,0.7)" }}
                >
                  {step.title}
                </p>
                <AnimatePresence>
                  {activeStep === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/60 text-sm mt-1 leading-relaxed overflow-hidden"
                    >
                      {step.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Common mistakes */}
      <div className="border border-white/8 rounded-xl overflow-hidden">
        <button
          onClick={() => setMistakesOpen(!mistakesOpen)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/3 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent-orange" />
            <span className="text-white/80 text-sm font-semibold">
              Erreurs courantes ({exercise.commonMistakes.length})
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-white/40 transition-transform ${
              mistakesOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {mistakesOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3 border-t border-white/5">
                {exercise.commonMistakes.map((m, i) => (
                  <div key={i} className="pt-3 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 text-xs mt-0.5 flex-shrink-0">✗</span>
                      <p className="text-red-400/80 text-sm">{m.mistake}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-emerald-400/80 text-sm">{m.correction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
