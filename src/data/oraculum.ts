/**
 * Data access layer.
 * Today every function reads from the mock layer (src/mock).
 * Later each one becomes an HTTP call to the Python backend
 * (Frontend -> API -> Modbus TCP -> Schneider M340) with no page changes.
 */
import * as mock from "@/mock/data";
import type {
  AcquisitionConfig,
  CommunicationConfig,
  Cycle,
  DiagnosticsSnapshot,
  LogEvent,
  Machine,
  Sample,
  SignalDef,
  TriggerConfig,
} from "@/mock/types";

export const getMachines = (): Machine[] => mock.machines;
export const getMachine = (id: string): Machine =>
  mock.machines.find((m) => m.id === id) ?? mock.machines[0];

export const getSignals = (): SignalDef[] => mock.signals;
export const getCommunicationConfig = (): CommunicationConfig => mock.communicationConfig;
export const getAcquisitionConfig = (): AcquisitionConfig => mock.acquisitionConfig;
export const getTrigger = (): TriggerConfig => mock.triggerConfig;
export const getDiagnostics = (): DiagnosticsSnapshot => mock.diagnostics;

export const getCycles = (): Cycle[] => mock.cycles;
export const getCycle = (id: string): Cycle | undefined =>
  mock.cycles.find((c) => c.id === id);
export const getCycleWaveform = (cycle: Cycle): Sample[] => mock.cycleWaveform(cycle);

export const getLiveBuffer = (setpoint?: number): Sample[] =>
  mock.seedLiveBuffer(240, setpoint);
export const getNextSample = (prev: Sample, index: number, setpoint?: number): Sample =>
  mock.nextLiveSample(prev, index, setpoint);

export const getLogEvents = (): LogEvent[] => mock.logEvents;

export type {
  AcquisitionConfig,
  CommunicationConfig,
  Cycle,
  DiagnosticsSnapshot,
  LogEvent,
  Machine,
  Sample,
  SignalDef,
  TriggerConfig,
};
