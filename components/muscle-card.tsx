"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { MuscleGroup } from "@/data/exercises";

export default function MuscleCard({
  group,
  index,
}: {
  group: MuscleGroup;
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06, ease: "easeOut" }}
    >
      <Link href={`/muscles/${group.slug}`} className="block group">
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="relative h-full bg-ink-700 border border-ink-line rounded-2xl p-5 overflow-hidden transition-colors group-hover:border-ink-500"
        >
          {/* Color glow on hover */}
          <div
            className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
            style={{ background: group.color }}
          />

          {/* Side accent bar */}
          <div
            className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full transition-all duration-300 group-hover:top-3 group-hover:bottom-3"
            style={{ backgroundColor: group.color }}
          />

          <div className="relative z-10 pl-3">
            <div className="flex items-start justify-between mb-8">
              <span className="font-mono text-xs text-bone-faint">{num}</span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${group.color}1A` }}
              >
                <ArrowUpRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: group.color }}
                />
              </div>
            </div>

            <h3 className="font-display font-bold text-xl text-bone tracking-tight mb-1">
              {group.name}
            </h3>
            <p className="text-bone-faint text-sm mb-4 leading-snug">
              {group.description}
            </p>

            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[11px] px-2 py-1 rounded-md"
                style={{ backgroundColor: `${group.color}14`, color: group.color }}
              >
                {group.exercises.length} exos
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
