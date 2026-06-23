"use client";

import { useEffect, useRef } from "react";
import type { ExercisePhase } from "@/data/exercises";

export default function PhaseIndicator({ phases }: { phases: ExercisePhase[] }) {
  const rafRef = useRef<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start: number | null = null;
    const duration = 3000;

    const getPhase = (t: number) =>
      phases.find((p) => t >= p.startRatio && t <= p.endRatio) ?? phases[0];

    function tick(ts: number) {
      if (start === null) start = ts;
      const elapsed = (ts - start) % (duration * 2);
      const rawT = elapsed / duration;
      const t = rawT <= 1 ? rawT : 2 - rawT;
      const phase = getPhase(t);

      if (barRef.current) {
        barRef.current.style.width = `${t * 100}%`;
        barRef.current.style.background = phase.color;
      }
      if (labelRef.current) {
        labelRef.current.textContent = phase.name;
        labelRef.current.style.color = phase.color;
      }
      if (pctRef.current) {
        pctRef.current.textContent = `${Math.round(t * 100)}%`;
      }
      if (dotRef.current) {
        dotRef.current.style.left = `calc(${t * 100}% - 5px)`;
        dotRef.current.style.backgroundColor = phase.color;
        dotRef.current.style.boxShadow = `0 0 10px ${phase.color}`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phases]);

  return (
    <div className="px-5 py-4 border-t border-ink-line">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="eyebrow text-bone-faint">Phase</span>
          <span
            ref={labelRef}
            className="font-mono text-xs font-medium transition-colors"
          >
            {phases[0].name}
          </span>
        </div>
        <span ref={pctRef} className="font-mono text-xs text-bone-faint">
          0%
        </span>
      </div>

      <div className="relative h-1 bg-ink-500 rounded-full">
        <div
          ref={barRef}
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: "0%", background: phases[0].color }}
        />
        <div
          ref={dotRef}
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
          style={{ left: "-5px", backgroundColor: phases[0].color }}
        />
      </div>

      {/* Phase legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        {phases.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="font-mono text-[10px] text-bone-faint">
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
