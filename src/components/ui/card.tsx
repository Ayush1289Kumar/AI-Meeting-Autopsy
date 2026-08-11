import { cn } from "@/lib/utils";
import { InfoTooltip } from "@/components/ui/tooltip";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("card-surface", className)}>{children}</section>;
}

export function CardHeader({
  title,
  icon,
  info,
  action,
}: {
  title: string;
  icon?: React.ReactNode;
  info?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-4 flex items-start justify-between gap-3">
      <h2 className="section-title">
        {icon}
        {title}
        {info ? <InfoTooltip text={info} /> : null}
      </h2>
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
