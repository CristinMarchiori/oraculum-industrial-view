import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneText, type Tone } from "@/lib/status";
import { StatusDot } from "./StatusIndicator";

export type Trend = "up" | "down" | "flat";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  tone?: Tone;
  trend?: Trend;
  hint?: string;
  target?: string;
  className?: string;
}

const trendIcon = { up: ArrowUpRight, down: ArrowDownRight, flat: ArrowRight };

export function MetricCard({
  label,
  value,
  unit,
  tone = "info",
  trend = "flat",
  hint,
  target,
  className,
}: MetricCardProps) {
  const TrendIcon = trendIcon[trend];
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-sm border border-border bg-panel px-3 py-2.5",
        className,
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-0.5", toneText[tone], "bg-current")} />
      <div className="flex items-center justify-between gap-2">
        <span className="tech-label truncate">{label}</span>
        <StatusDot tone={tone} />
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="readout text-3xl font-semibold leading-none text-foreground">
          {value}
        </span>
        {unit && <span className="readout text-sm text-muted-foreground">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1 font-mono">
          <TrendIcon className={cn("h-3.5 w-3.5", toneText[tone])} />
          {hint ?? "Estável"}
        </span>
        {target && <span className="readout">{target}</span>}
      </div>
    </div>
  );
}
