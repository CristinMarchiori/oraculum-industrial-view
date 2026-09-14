import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PressureUnit, Sample } from "@/mock/types";
import { cn } from "@/lib/utils";

export interface TraceDef {
  key: "pressure" | "setpoint" | "temperature" | "temperature2" | "pressureMin" | "pressureMax" | "temperatureMin" | "temperatureMax";
  label: string;
  color: string;
  unit: string;
  dashed?: boolean;
  axis?: "left" | "right";
}

const traces = (pressureUnit: PressureUnit): TraceDef[] => [
  {
    key: "pressure",
    label: "Pressão",
    color: "var(--signal-pressure)",
    unit: pressureUnit,
    axis: "left",
  },
  {
    key: "setpoint",
    label: "Pressão Programada",
    color: "var(--signal-setpoint)",
    unit: pressureUnit,
    dashed: true,
    axis: "left",
  },
  {
    key: "temperature",
    label: "Temperatura",
    color: "var(--signal-temp)",
    unit: "°C",
    axis: "right",
  },
];

const TEMP_TRACES: TraceDef[] = [
  { key: "temperature", label: "Temperatura lida 1", color: "var(--signal-pressure)", unit: "°C", axis: "right" },
  { key: "temperature2", label: "Temperatura lida 2", color: "var(--signal-temp)", unit: "°C", axis: "right" },
  { key: "temperatureMin", label: "Limite mínimo", color: "var(--warn)", unit: "°C", axis: "right", dashed: true },
  { key: "temperatureMax", label: "Limite máximo", color: "var(--fault)", unit: "°C", axis: "right", dashed: true },
];

const pressureTraces = (pressureUnit: PressureUnit): TraceDef[] => {
  const definitions = traces(pressureUnit);
  return [
    definitions[0] as TraceDef,
    definitions[1] as TraceDef,
    { key: "pressureMin", label: "Limite mínimo", color: "var(--warn)", unit: pressureUnit, dashed: true, axis: "left" },
    { key: "pressureMax", label: "Limite máximo", color: "var(--fault)", unit: pressureUnit, dashed: true, axis: "left" },
  ];
};

interface OscilloscopeProps {
  data: Sample[];
  visible: Record<string, boolean>;
  height?: number;
  className?: string;
  mode?: "pressure" | "temperature" | "all";
  domain?: [number, number];
  pressureUnit?: PressureUnit;
}

function ScopeTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-border bg-popover/95 px-3 py-2 shadow-lg">
      <div className="tech-label mb-1">t = {Number(label).toFixed(2)} s</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: p.stroke as string }}
          />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="readout ml-auto text-foreground">
            {Number(p.value).toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Oscilloscope({
  data,
  visible,
  height = 340,
  className,
  mode = "all",
  domain,
  pressureUnit = "bar",
}: OscilloscopeProps) {
  const definitions = mode === "pressure" ? pressureTraces(pressureUnit) : mode === "temperature" ? TEMP_TRACES : traces(pressureUnit);
  const shown = useMemo(() => definitions.filter((t) => visible[t.key] !== false), [definitions, visible]);

  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
          <CartesianGrid stroke="var(--grid)" strokeOpacity={0.5} />
          <XAxis
            dataKey="t"
            type="number"
            domain={domain ?? ["dataMin", "dataMax"]}
            tickFormatter={(v: number) => `${v.toFixed(1)}s`}
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            width={52}
            domain={[0, (max: number) => Math.ceil((max * 1.15) / 20) * 20]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            width={44}
            domain={[0, 120]}
          />
          <Tooltip
            content={<ScopeTooltip />}
            cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "4 4" }}
            isAnimationActive={false}
          />
          {shown.map((t) => (
            <Line
              key={t.key}
              yAxisId={t.axis ?? "left"}
              type="linear"
              dataKey={t.key}
              name={t.label}
              stroke={t.color}
              strokeWidth={1.6}
              strokeDasharray={t.dashed ? "6 4" : undefined}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScopeLegend({
  visible,
  onToggle,
  mode = "all",
  pressureUnit = "bar",
}: {
  visible: Record<string, boolean>;
  onToggle: (key: string) => void;
  mode?: "pressure" | "temperature" | "all";
  pressureUnit?: PressureUnit;
}) {
  const definitions = mode === "pressure" ? pressureTraces(pressureUnit) : mode === "temperature" ? TEMP_TRACES : traces(pressureUnit);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {definitions.map((t) => {
        const on = visible[t.key] !== false;
        return (
          <button
            key={t.key}
            onClick={() => onToggle(t.key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-sm border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors",
              on
                ? "border-border bg-secondary text-foreground"
                : "border-border/60 bg-transparent text-muted-foreground line-through",
            )}
          >
            <span
              className="h-0.5 w-4"
              style={{ backgroundColor: on ? t.color : "var(--muted-foreground)" }}
            />
            {t.label}
            <span className="text-muted-foreground">[{t.unit}]</span>
          </button>
        );
      })}
    </div>
  );
}
