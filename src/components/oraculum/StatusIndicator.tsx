import { cn } from "@/lib/utils";
import { toneBorder, toneDot, toneSurface, toneText, type Tone } from "@/lib/status";

export function StatusDot({
  tone,
  pulse = false,
  className,
}: {
  tone: Tone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex h-2.5 w-2.5", className)}>
      {pulse && (
        <span
          className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", toneDot[tone])}
        />
      )}
      <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", toneDot[tone])} />
    </span>
  );
}

export function StatusBadge({
  tone,
  label,
  className,
}: {
  tone: Tone;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em]",
        toneBorder[tone],
        toneSurface[tone],
        toneText[tone],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", toneDot[tone])} />
      {label}
    </span>
  );
}

export function StatusPlate({
  tone,
  state,
  caption,
}: {
  tone: Tone;
  state: string;
  caption: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-sm border px-4 py-3",
        toneBorder[tone],
        toneSurface[tone],
      )}
    >
      <StatusDot tone={tone} pulse className="h-3.5 w-3.5" />
      <div className="min-w-0">
        <div className={cn("font-display text-2xl font-bold tracking-[0.14em]", toneText[tone])}>
          {state}
        </div>
        <div className="tech-label truncate">{caption}</div>
      </div>
    </div>
  );
}
