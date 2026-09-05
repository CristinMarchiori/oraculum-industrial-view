import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
  bodyClassName,
}: PanelProps) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-sm border border-border bg-panel",
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex min-h-11 flex-wrap items-center justify-between gap-2 border-b border-border bg-panel-header px-3 py-2">
          <div className="flex items-baseline gap-3">
            {title && (
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                {title}
              </h2>
            )}
            {subtitle && <span className="tech-label">{subtitle}</span>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn("flex-1 p-3", bodyClassName)}>{children}</div>
    </section>
  );
}
