"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Premium CTA: volt fill, layered shadow, conic light running around the
 * inner edge, and a shimmer sweep on hover. Renders as a Link when `href`
 * is provided, otherwise a button.
 */
export default function ShimmerButton({
  children,
  href,
  className,
  onClick,
  type,
  disabled,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const inner = (
    <span
      className={cn(
        "group/sb relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-7 py-4 font-bold text-ink-900 shimmer",
        "bg-[linear-gradient(180deg,#d8ff5e_0%,#cdff47_100%)]",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset,0_0_0_1px_rgba(205,255,71,0.5),0_8px_24px_-6px_rgba(205,255,71,0.55),0_2px_4px_-1px_rgba(0,0,0,0.4)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_0_0_1px_rgba(205,255,71,0.75),0_16px_40px_-8px_rgba(205,255,71,0.75)] active:translate-y-0",
        className
      )}
    >
      {/* running light along inner edge */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
        style={{
          background:
            "conic-gradient(from var(--beam-angle), transparent 0%, rgba(255,255,255,0.9) 9%, transparent 22%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1.5px",
          animation: "beam-spin 4s linear infinite",
        }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {inner}
      </Link>
    );
  }
  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex disabled:opacity-50 disabled:pointer-events-none"
    >
      {inner}
    </button>
  );
}
