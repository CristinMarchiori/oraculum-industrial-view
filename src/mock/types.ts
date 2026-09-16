export type ConnectionState =
  | "waiting"
  | "connecting"
  | "connected"
  | "unstable"
  | "disconnected"
  | "backend_unavailable";

export type MonitoringState = "stopped" | "waiting_trigger" | "running" | "paused" | "completed";

export type DemoScenario =
  | "no-machine"
  | "schneider"
  | "rockwell"
  | "waiting-trigger"
  | "running"
  | "warning"
  | "paused"
  | "communication-fault"
  | "completed"
  | "partial-save"
  | "no-temperature";

export type MachineState =
  | "READY"
  | "RUNNING"
  | "PAUSED"
  | "WARNING"
  | "FAULT"
  | "DISCONNECTED";

export type CycleStatus = "OK" | "WARNING" | "FAULT";

export type PressureUnit = "bar" | "kgf/cm²";

export interface Machine {
  id: string;
  name: string;
  model: string;
  protocol: string;
  ip: string;
  port: number;
  line: string;
  available: boolean;
  pressureUnit: PressureUnit;
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
  temperature2?: number | null;
  pressureMin?: number | null;
  pressureMax?: number | null;
  temperatureMin?: number | null;
  temperatureMax?: number | null;
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
  sampleCount: number;
  pressurePeriods: ProcessPeriod[];
  reliefPeriods: ProcessPeriod[];
  csvSaved: boolean;
  pngSaved: boolean;
  baseFile: string;
  saveMessage: string;
}

export interface ProcessPeriod {
  number: number;
  startS: number;
  endS: number;
  durationS: number;
  startPressure?: number;
  threshold?: number;
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

export interface MonitoringSnapshot {
  monitoring: MonitoringState;
  connection: ConnectionState;
  cycleActive: boolean;
  samples: number;
  pressure: number | null;
  setpoint: number | null;
  inertia: number | null;
  cycleDurationS: number;
  programmedTemperature: number | null;
  temperature1: number | null;
  temperature2: number | null;
  lastFile: string | null;
  message: string;
  stale: boolean;
}

export interface AppConfiguration {
  offsetModbus: number;
  triggerTag: string;
  monitorFlagTag: string;
  triggerType: "NIVEL" | "BORDA" | "SUBIDA" | "DESCIDA";
  triggerEnabled: boolean;
  monitorZeroPressure: boolean;
  pressureTag: string;
  setpointTag: string;
  inertiaTag: string;
  programmedTemperatureTag: string;
  temperature1Tag: string;
  temperature2Tag: string;
}
