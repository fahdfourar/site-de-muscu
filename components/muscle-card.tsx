"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { MuscleGroup } from "@/data/exercises";
import MagicCard from "@/components/ui/magic-card";

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
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link href={`/muscles/${group.slug}`} className="block h-full group">
        <MagicCard spot={group.color} className="h-full p-5">
          {/* corner color glow */}
          <div
            className="absolute -top-20 -right-20 w-44 h-44 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-3xl"
            style={{ background: group.color }}
          />

          {/* side accent bar */}
          <div
            className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full transition-all duration-300 group-hover:top-4 group-hover:bottom-4"
            style={{
              backgroundColor: group.color,
              boxShadow: `0 0 16px ${group.color}`,
            }}
          />

          <div className="relative z-10 pl-3 flex flex-col h-full">
            <div className="flex items-start justify-between mb-10">
              <span className="font-mono text-xs text-bone-faint">{num}</span>
              <motion.div
                whileHover={{ scale: 1.12, rotate: 8 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${group.color}18`,
                  boxShadow: `inset 0 0 0 1px ${group.color}30`,
                }}
              >
                <ArrowUpRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: group.color }}
                />
              </motion.div>
            </div>

            <div className="mt-auto">
              <h3 className="font-display font-bold text-xl text-bone tracking-tight mb-1">
                {group.name}
              </h3>
              <p className="text-bone-faint text-sm mb-4 leading-snug">
                {group.description}
              </p>
              <span
                className="font-mono text-[11px] px-2.5 py-1 rounded-md inline-flex"
                style={{
                  backgroundColor: `${group.color}14`,
                  color: group.color,
                  boxShadow: `inset 0 0 0 1px ${group.color}25`,
                }}
              >
                {group.exercises.length} exercices
              </span>
            </div>
          </div>
        </MagicCard>
      </Link>
    </motion.div>
  );
}
