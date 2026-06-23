"use client";

import { cn } from "@/lib/utils";

/**
 * Wraps content with an animated light travelling around the border.
 * Use on cards/badges that deserve a premium accent. Pure CSS (conic mask).
 */
export default function BorderBeam({
  children,
  className,
  color = "#cdff47",
  radius = "1.5rem",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  radius?: string;
}) {
  return (
    <div
      className={cn("border-beam relative", className)}
      style={
        {
          borderRadius: radius,
          ["--beam-color" as string]: color,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
