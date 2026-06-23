"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle } from "lucide-react";
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
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-mono text-[11px] uppercase tracking-wider px-2 py-1 rounded-md"
            style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
          >
            {exercise.difficulty}
          </span>
          <span className="font-mono text-[11px] text-bone-faint">
            {exercise.secondaryMuscles.join(" · ")}
          </span>
        </div>
        <h2 className="font-display font-extrabold text-3xl text-bone tracking-tight leading-tight">
          {exercise.name}
        </h2>
        <p className="text-bone-muted text-sm mt-2">
          Cible :{" "}
          <span className="text-bone font-medium">{exercise.primaryMuscle}</span>
        </p>
      </div>

      {/* Steps */}
      <div>
        <p className="eyebrow text-bone-faint mb-3">Exécution</p>
        <div className="space-y-2">
          {exercise.steps.map((step, i) => {
            const active = activeStep === i;
            return (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className="w-full text-left"
              >
                <div
                  className="flex gap-4 p-4 rounded-2xl border transition-all duration-200"
                  style={{
                    backgroundColor: active ? `${accentColor}0F` : "transparent",
                    borderColor: active ? `${accentColor}40` : "#2C2C33",
                  }}
                >
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-mono text-sm font-bold transition-all"
                    style={{
                      backgroundColor: active ? accentColor : "#1D1D21",
                      color: active ? "#0A0A0B" : "#5E5E60",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 pt-1">
                    <p
                      className="font-semibold text-[15px] transition-colors"
                      style={{ color: active ? "#F4F4EF" : "#9A9A93" }}
                    >
                      {step.title}
                    </p>
                    <AnimatePresence>
                      {active && (
                        <motion.p
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 6 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-bone-muted text-sm leading-relaxed overflow-hidden"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="border border-ink-line rounded-2xl overflow-hidden">
        <button
          onClick={() => setMistakesOpen(!mistakesOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-ink-600/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-ember" />
            <span className="text-bone text-sm font-semibold">
              Erreurs courantes
            </span>
            <span className="font-mono text-xs text-bone-faint">
              ({exercise.commonMistakes.length})
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-bone-faint transition-transform ${
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
              <div className="px-4 pb-4 space-y-4 border-t border-ink-line pt-4">
                {exercise.commonMistakes.map((m, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-ember text-xs mt-0.5 flex-shrink-0">
                        ✗
                      </span>
                      <p className="text-bone-muted text-sm">{m.mistake}</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-volt text-xs mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      <p className="text-bone text-sm">{m.correction}</p>
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
