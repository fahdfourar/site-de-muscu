"use client";

import { cn } from "@/lib/utils";

export default function Marquee({
  children,
  className,
  reverse = false,
  speed = 28,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: number;
}) {
  return (
    <div className={cn("group flex overflow-hidden", className)}>
      <div
        className="flex shrink-0 items-center"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
