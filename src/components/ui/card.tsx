"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { InfoTooltip } from "@/components/ui/tooltip";

export function Card({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("card-surface", className)}
    >
      {children}
    </motion.section>
  );
}

export function CardHeader({
  title,
  icon,
  info,
  action,
  subtitle,
}: {
  title: string;
  icon?: React.ReactNode;
  info?: string;
  action?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <header className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="section-title">
          {icon}
          {title}
          {info ? <InfoTooltip text={info} /> : null}
        </h2>
        {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function CardFooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="mt-4 inline-block text-xs font-medium text-brand hover:underline">
      {label} →
    </a>
  );
}
