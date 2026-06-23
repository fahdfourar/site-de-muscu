"use client";

import { useEffect, useRef } from "react";
import type { ExercisePhase } from "@/data/exercises";

export default function PhaseIndicator({
  phases,
}: {
  phases: ExercisePhase[];
}) {
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let start: number | null = null;
    const duration = 3000;

    function getCurrentPhase(t: number) {
      return phases.find((p) => t >= p.startRatio && t <= p.endRatio) ?? phases[0];
    }

    function tick(ts: number) {
      if (start === null) start = ts;
      const elapsed = (ts - start) % (duration * 2);
      const rawT = elapsed / duration;
      const t = rawT <= 1 ? rawT : 2 - rawT;

      progressRef.current = t;

      if (barRef.current) {
        barRef.current.style.width = `${t * 100}%`;
      }

      const phase = getCurrentPhase(t);
      if (barRef.current) {
        barRef.current.style.background = `linear-gradient(90deg, ${phase.color}99, ${phase.color})`;
      }
      if (labelRef.current) {
        labelRef.current.textContent = phase.name;
        labelRef.current.style.color = phase.color;
      }
      if (dotRef.current) {
        dotRef.current.style.left = `calc(${t * 100}% - 6px)`;
        dotRef.current.style.backgroundColor = phase.color;
        dotRef.current.style.boxShadow = `0 0 8px ${phase.color}`;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phases]);

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/40 font-mono">Phase</span>
        <span
          ref={labelRef}
          className="text-xs font-semibold font-mono transition-colors"
        >
          {phases[0].name}
        </span>
      </div>

      <div className="relative h-1.5 bg-white/8 rounded-full overflow-visible">
        <div
          ref={barRef}
          className="absolute left-0 top-0 h-full rounded-full transition-none"
          style={{ width: "0%", background: phases[0].color }}
        />
        <div
          ref={dotRef}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-none"
          style={{ left: "-6px", backgroundColor: phases[0].color }}
        />
      </div>

      {/* Phase markers */}
      <div className="relative mt-3 flex">
        {phases.map((p, i) => (
          <div
            key={i}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${p.startRatio * 100}%` }}
          >
            <div
              className="w-px h-2 opacity-40"
              style={{ backgroundColor: p.color }}
            />
            <span
              className="text-[10px] font-mono mt-0.5 opacity-50 whitespace-nowrap"
              style={{ color: p.color }}
            >
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
