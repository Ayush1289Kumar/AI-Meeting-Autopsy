"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gradient text-white shadow-glow-soft hover:shadow-glow-brand hover:brightness-110",
        secondary:
          "border border-border bg-card text-white backdrop-blur-xl hover:border-border-strong hover:bg-card-hover",
        ghost: "text-muted hover:bg-white/5 hover:text-white",
        danger: "bg-danger text-white hover:bg-danger/85",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}
