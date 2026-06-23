"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        volt: "btn-volt shimmer",
        ember:
          "bg-ember text-bone shadow-[0_6px_16px_-4px_rgba(255,84,54,0.5),0_0_0_1px_rgba(255,84,54,0.4)_inset] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-6px_rgba(255,84,54,0.65)] active:translate-y-0 shimmer",
        outline:
          "border border-ink-line text-bone bg-ink-800/40 hover:bg-ink-700 hover:border-ink-500 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm",
        ghost: "text-bone-muted hover:text-bone hover:bg-ink-600/50",
        dark: "bg-ink-900 text-bone border border-ink-line hover:bg-ink-800 hover:-translate-y-0.5 active:translate-y-0 shadow-lift",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-xl",
        md: "h-11 px-5 text-sm rounded-xl",
        lg: "h-14 px-7 text-base rounded-2xl",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "volt",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
