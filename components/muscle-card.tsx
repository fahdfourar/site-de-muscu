"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { MuscleGroup } from "@/data/exercises";

export default function MuscleCard({
  group,
  index,
}: {
  group: MuscleGroup;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
    >
      <Link href={`/muscles/${group.slug}`} className="block group">
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative bg-bg-card border border-white/8 rounded-2xl p-6 cursor-pointer overflow-hidden"
        >
          {/* Gradient glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${group.color}20 0%, transparent 70%)`,
            }}
          />

          {/* Top color bar */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(90deg, transparent, ${group.color}, transparent)` }}
          />

          <div className="relative z-10">
            {/* Icon circle */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white text-xl font-bold"
              style={{ backgroundColor: `${group.color}25` }}
            >
              <span
                className="text-2xl"
                style={{ color: group.color }}
              >
                {getIcon(group.icon)}
              </span>
            </div>

            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-white transition-colors">
              {group.name}
            </h3>
            <p className="text-white/50 text-sm mb-4">{group.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40 font-mono">
                {group.exercises.length} exercices
              </span>
              <ArrowRight
                className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all"
                style={{ color: group.color }}
              />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function getIcon(icon: string): string {
  const icons: Record<string, string> = {
    chest: "🫁",
    back: "⬛",
    shoulders: "💪",
    bicep: "💪",
    tricep: "✊",
    quads: "🦵",
    hamstrings: "🦵",
    abs: "⬜",
    glutes: "🍑",
  };
  return icons[icon] ?? "💪";
}
