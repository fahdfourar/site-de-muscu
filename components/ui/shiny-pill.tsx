"use client";

import { cn } from "@/lib/utils";

/** Animated bordered pill with a glowing dot — the brand "badge". */
export default function ShinyPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "shimmer-loop relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-volt/25 bg-volt/[0.06] px-4 py-1.5",
        className
      )}
    >
      <span className="glow-dot relative h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
      <span className="eyebrow relative text-volt">{children}</span>
    </span>
  );
}
