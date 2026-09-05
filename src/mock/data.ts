import type {
  AcquisitionConfig,
  CommunicationConfig,
  Cycle,
  CycleStatus,
  DiagnosticsSnapshot,
  LogEvent,
  LogLevel,
  Machine,
  Sample,
  SignalDef,
  TriggerConfig,
} from "./types";

export const machines: Machine[] = [
  {
    id: "M01",
    name: "Machine 01",
    model: "SCHNEIDER M340",
    protocol: "Modbus TCP",
    ip: "172.25.217.210",
    port: 502,
    line: "Press Line A",
  },
  {
    id: "M02",
    name: "Machine 02",
    model: "SCHNEIDER M340",
    protocol: "Modbus TCP",
    ip: "172.25.217.211",
    port: 502,
    line: "Press Line A",
  },
  {
    id: "M03",
    name: "Machine 03",
    model: "SCHNEIDER M580",
    protocol: "Modbus TCP",
    ip: "172.25.217.220",
    port: 502,
    line: "Press Line B",
  },
];

export const signals: SignalDef[] = [
  {
    id: "sig-pressure",
    name: "Pressão",
    address: "MW413",
    type: "UINT",
    unit: "bar",
    scale: 1,
    enabled: true,
  },
  {
    id: "sig-setpoint",
    name: "Pressão Programada",
    address: "MW3002",
    type: "UINT",
    unit: "bar",
    scale: 1,
    enabled: true,
  },
  {
    id: "sig-t1",
    name: "Temperatura 1",
    address: "MW409",
    type: "UINT",
    unit: "°C",
    scale: 0.1,
    enabled: true,
  },
  {
    id: "sig-t2",
    name: "Temperatura 2",
    address: "MW410",
    type: "UINT",
    unit: "°C",
    scale: 0.1,
    enabled: true,
  },
  {
    id: "sig-t3",
    name: "Temperatura 3",
    address: "MW411",
    type: "UINT",
    unit: "°C",
    scale: 0.1,
    enabled: false,
  },
];

export const communicationConfig: CommunicationConfig = {
  ip: "172.25.217.210",
  protocol: "Schneider M340",
  port: 502,
  timeoutMs: 1500,
  modbusUnit: 1,
};

export const acquisitionConfig: AcquisitionConfig = {
  intervalMs: 250,
  sampleCount: 600,
  mode: "continuous",
  storeHistory: true,
  retentionDays: 90,
};

export const triggerConfig: TriggerConfig = {
  status: "Armed",
  source: "Pressure",
  level: 180,
  unit: "bar",
  edge: "Rising",
  time: "14:22:07.412",
};

export const diagnostics: DiagnosticsSnapshot = {
  latencyMs: 12,
  lastReadAt: "14:31:58.204",
  errorCount: 3,
  threadState: "RUNNING",
  sampleRateHz: 4,
  samplesReceived: 184_923,
  samplesLost: 27,
  version: "2.0.0-rc1",
  backend: "Python 3.11 · pymodbus 3.6",
  frontend: "React 19 · TanStack Start",
  updatedAt: "2026-09-05 14:31:58",
};

/** Deterministic pseudo-random so SSR and client agree. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const operators = ["A. Ferreira", "M. Souza", "R. Tanaka", "J. Oliveira"];

function cycleStatusFor(i: number, max: number, setpoint: number): CycleStatus {
  if (max < setpoint * 0.85) return "FAULT";
  if (Math.abs(max - setpoint) > setpoint * 0.06 || i % 11 === 0) return "WARNING";
  return "OK";
}

export const cycles: Cycle[] = Array.from({ length: 64 }, (_, i) => {
  const machine = machines[i % machines.length];
  const setpoint = machine.id === "M03" ? 240 : 200;
  const r = rand(i + 1);
  const max = Math.round(setpoint * (0.82 + r * 0.24) * 10) / 10;
  const start = new Date(Date.UTC(2026, 8, 5, 6, 0, 0) + i * 17 * 60_000);
  const duration = Math.round((14 + rand(i + 7) * 9) * 10) / 10;
  const end = new Date(start.getTime() + duration * 1000);
  return {
    id: `CY-${(2481 - i).toString().padStart(5, "0")}`,
    machineId: machine.id,
    startedAt: start.toISOString(),
    endedAt: end.toISOString(),
    durationS: duration,
    operator: operators[i % operators.length],
    maxPressure: max,
    avgPressure: Math.round(max * 0.78 * 10) / 10,
    setpoint,
    pressureTime: Math.round((10 + rand(i + 3) * 5) * 10) / 10,
    reliefTime: Math.round((2.4 + rand(i + 5) * 2) * 10) / 10,
    maxTemperature: Math.round((39 + rand(i + 11) * 12) * 10) / 10,
    status: cycleStatusFor(i, max, setpoint),
  };
});

/** Waveform of a single cycle: ramp-up, hold, relief. */
export function cycleWaveform(cycle: Cycle): Sample[] {
  const points = 180;
  const total = cycle.durationS;
  const rampEnd = total * 0.18;
  const holdEnd = rampEnd + cycle.pressureTime * 0.9;
  return Array.from({ length: points }, (_, i) => {
    const t = Math.round(((i / (points - 1)) * total) * 100) / 100;
    let pressure: number;
    if (t < rampEnd) {
      pressure = (t / rampEnd) * cycle.maxPressure;
    } else if (t < holdEnd) {
      pressure = cycle.maxPressure - rand(i + cycle.durationS) * 3;
    } else {
      const k = Math.min(1, (t - holdEnd) / Math.max(0.5, cycle.reliefTime));
      pressure = cycle.maxPressure * (1 - k) * (1 - k);
    }
    const temperature =
      cycle.maxTemperature - 4 + (t / total) * 4 + rand(i * 3 + 2) * 0.6;
    return {
      t,
      pressure: Math.round(Math.max(0, pressure) * 10) / 10,
      setpoint: cycle.setpoint,
      temperature: Math.round(temperature * 10) / 10,
    };
  });
}

/** Rolling live buffer used by the oscilloscope before RUN starts. */
export function seedLiveBuffer(length = 240, setpoint = 200): Sample[] {
  return Array.from({ length }, (_, i) => {
    const t = Math.round((i - length + 1) * 0.25 * 100) / 100;
    return {
      t,
      pressure: livePressureAt(i, setpoint),
      setpoint,
      temperature: Math.round((42 + Math.sin(i / 37) * 1.8 + rand(i) * 0.4) * 10) / 10,
    };
  });
}

export function livePressureAt(i: number, setpoint = 200) {
  const phase = (i % 96) / 96;
  let base: number;
  if (phase < 0.22) base = setpoint * (phase / 0.22) * 0.94;
  else if (phase < 0.72) base = setpoint * 0.92 + Math.sin(i / 5) * 3;
  else base = setpoint * 0.92 * Math.max(0, 1 - (phase - 0.72) / 0.2) ** 2;
  return Math.round(Math.max(0, base + rand(i) * 2.5) * 10) / 10;
}

export function nextLiveSample(prev: Sample, index: number, setpoint = 200): Sample {
  return {
    t: Math.round((prev.t + 0.25) * 100) / 100,
    pressure: livePressureAt(index, setpoint),
    setpoint,
    temperature:
      Math.round((42 + Math.sin(index / 37) * 1.8 + rand(index) * 0.4) * 10) / 10,
  };
}

const logLevels: LogLevel[] = ["INFO", "INFO", "INFO", "WARNING", "INFO", "ERROR"];
const logMessages: Record<LogLevel, string[]> = {
  INFO: [
    "PLC connected",
    "Acquisition started",
    "Cycle recorded",
    "Signal map reloaded",
    "Heartbeat OK",
  ],
  WARNING: ["Communication delay", "Sample buffer 82% full", "Pressure below setpoint"],
  ERROR: ["Read timeout", "Modbus exception code 0x04", "Socket reset by peer"],
};

export const logEvents: LogEvent[] = Array.from({ length: 40 }, (_, i) => {
  const level = logLevels[i % logLevels.length];
  const msgs = logMessages[level];
  const ts = new Date(Date.UTC(2026, 8, 5, 14, 31, 58) - i * 47_000);
  return {
    id: `EV-${1000 + i}`,
    timestamp: ts.toISOString(),
    level,
    source: i % 3 === 0 ? "acquisition" : i % 3 === 1 ? "modbus" : "system",
    message: msgs[i % msgs.length],
  };
});
