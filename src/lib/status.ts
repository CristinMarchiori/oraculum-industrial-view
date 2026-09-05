import type { ConnectionState, CycleStatus, LogLevel, MachineState } from "@/mock/types";

export type Tone = "ok" | "warn" | "fault" | "info" | "idle";

export const toneText: Record<Tone, string> = {
  ok: "text-ok",
  warn: "text-warn",
  fault: "text-fault",
  info: "text-info",
  idle: "text-muted-foreground",
};

export const toneDot: Record<Tone, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  fault: "bg-fault",
  info: "bg-info",
  idle: "bg-muted-foreground",
};

export const toneBorder: Record<Tone, string> = {
  ok: "border-ok/40",
  warn: "border-warn/40",
  fault: "border-fault/40",
  info: "border-info/40",
  idle: "border-border",
};

export const toneSurface: Record<Tone, string> = {
  ok: "bg-ok/10",
  warn: "bg-warn/10",
  fault: "bg-fault/10",
  info: "bg-info/10",
  idle: "bg-muted/40",
};

export function machineStateTone(state: MachineState): Tone {
  switch (state) {
    case "RUNNING":
      return "ok";
    case "READY":
      return "info";
    case "PAUSED":
      return "idle";
    case "WARNING":
      return "warn";
    case "FAULT":
      return "fault";
    default:
      return "idle";
  }
}

export function connectionTone(state: ConnectionState): Tone {
  return state === "connected" ? "ok" : state === "unstable" ? "warn" : "fault";
}

export function connectionLabel(state: ConnectionState): string {
  return state === "connected"
    ? "Connected"
    : state === "unstable"
      ? "Unstable"
      : "Disconnected";
}

export function cycleStatusTone(status: CycleStatus): Tone {
  return status === "OK" ? "ok" : status === "WARNING" ? "warn" : "fault";
}

export function logLevelTone(level: LogLevel): Tone {
  return level === "INFO" ? "info" : level === "WARNING" ? "warn" : "fault";
}
