export type ConnectionState = "connected" | "unstable" | "disconnected";

export type MachineState =
  | "READY"
  | "RUNNING"
  | "PAUSED"
  | "WARNING"
  | "FAULT"
  | "DISCONNECTED";

export type CycleStatus = "OK" | "WARNING" | "FAULT";

export interface Machine {
  id: string;
  name: string;
  model: string;
  protocol: string;
  ip: string;
  port: number;
  line: string;
}

export interface SignalDef {
  id: string;
  name: string;
  address: string;
  type: string;
  unit: string;
  scale: number;
  enabled: boolean;
}

export interface Sample {
  /** seconds since acquisition start */
  t: number;
  pressure: number;
  setpoint: number;
  temperature: number;
}

export interface LiveReading {
  pressure: number;
  setpoint: number;
  pressureTime: number;
  reliefTime: number;
  t1: number;
  t2: number;
  t3: number;
}

export interface Cycle {
  id: string;
  machineId: string;
  startedAt: string;
  endedAt: string;
  durationS: number;
  operator: string;
  maxPressure: number;
  avgPressure: number;
  setpoint: number;
  pressureTime: number;
  reliefTime: number;
  maxTemperature: number;
  status: CycleStatus;
}

export type LogLevel = "INFO" | "WARNING" | "ERROR";

export interface LogEvent {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
}

export interface CommunicationConfig {
  ip: string;
  protocol: string;
  port: number;
  timeoutMs: number;
  modbusUnit: number;
}

export interface AcquisitionConfig {
  intervalMs: number;
  sampleCount: number;
  mode: "continuous" | "triggered" | "single";
  storeHistory: boolean;
  retentionDays: number;
}

export interface DiagnosticsSnapshot {
  latencyMs: number;
  lastReadAt: string;
  errorCount: number;
  threadState: "RUNNING" | "IDLE" | "STOPPED";
  sampleRateHz: number;
  samplesReceived: number;
  samplesLost: number;
  version: string;
  backend: string;
  frontend: string;
  updatedAt: string;
}

export interface TriggerConfig {
  status: "Armed" | "Triggered" | "Idle";
  source: string;
  level: number;
  unit: string;
  edge: "Rising" | "Falling";
  time: string;
}
