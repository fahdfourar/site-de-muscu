"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * A card with a cursor-following spotlight + lift. The spotlight tint
 * is driven by the `spot` colour so each muscle card glows in its own hue.
 */
export default function MagicCard({
  children,
  className,
  spot = "#cdff47",
}: {
  children: React.ReactNode;
  className?: string;
  spot?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group/magic relative overflow-hidden rounded-3xl border border-ink-line bg-ink-700 transition-all duration-300 hover:border-ink-500",
        className
      )}
      style={{ ["--spot" as string]: spot } as React.CSSProperties}
    >
      {/* spotlight layer */}
      <div className="magic-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/magic:opacity-100" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
