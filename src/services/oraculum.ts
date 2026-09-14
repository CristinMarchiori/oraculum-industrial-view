import {
  getCommunicationConfig,
  getCycle,
  getCycles,
  getCycleWaveform,
  getDiagnostics,
  getLogEvents,
  getMachines,
  getSignals,
} from "@/data/oraculum";
import type { AppConfiguration } from "@/mock/types";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const machineService = { list: getMachines, select: async (id: string) => { await delay(); return getMachines().find((m) => m.id === id); } };
export const resultsService = { list: getCycles, get: getCycle, waveform: getCycleWaveform };
export const diagnosticService = { snapshot: getDiagnostics, events: getLogEvents };
export const configurationService = {
  communication: getCommunicationConfig,
  signals: getSignals,
  save: async (value: AppConfiguration) => { await delay(500); return value; },
  testCommunication: async () => { await delay(650); return { success: true, message: "Comunicação simulada validada." }; },
  testVector: async () => { await delay(650); return { success: true, message: "Leitura simulada: 41 de 41 registros." }; },
};