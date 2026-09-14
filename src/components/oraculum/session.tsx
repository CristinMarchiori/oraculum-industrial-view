import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { getMachines } from "@/data/oraculum";
import type { ConnectionState, DemoScenario, MachineState, MonitoringState } from "@/mock/types";

interface SessionValue {
  machineId: string;
  pendingMachineId: string;
  setPendingMachineId: (id: string) => void;
  confirmMachine: () => Promise<void>;
  connection: ConnectionState;
  setConnection: (c: ConnectionState) => void;
  machineState: MachineState;
  setMachineState: (s: MachineState) => void;
  monitoring: MonitoringState;
  setMonitoring: (s: MonitoringState) => void;
  commandBusy: boolean;
  operationalMessage: string;
  setOperationalMessage: (message: string) => void;
  scenario: DemoScenario;
  applyScenario: (scenario: DemoScenario) => void;
  temperaturesConfigured: boolean;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [machineId, setMachineId] = useState("");
  const [pendingMachineId, setPendingMachineId] = useState("");
  const [connection, setConnection] = useState<ConnectionState>("waiting");
  const [machineState, setMachineState] = useState<MachineState>("READY");
  const [monitoring, setMonitoring] = useState<MonitoringState>("stopped");
  const [commandBusy, setCommandBusy] = useState(false);
  const [operationalMessage, setOperationalMessage] = useState("Selecione e confirme uma máquina para iniciar.");
  const [scenario, setScenario] = useState<DemoScenario>("no-machine");
  const [temperaturesConfigured, setTemperaturesConfigured] = useState(true);

  const confirmMachine = async () => {
    if (!pendingMachineId || monitoring === "running" || monitoring === "paused") return;
    setCommandBusy(true);
    setOperationalMessage("Confirmando máquina de demonstração...");
    await new Promise((resolve) => setTimeout(resolve, 450));
    setMachineId(pendingMachineId);
    setConnection("connected");
    setMachineState("READY");
    setOperationalMessage("Máquina confirmada. Monitoração liberada.");
    setCommandBusy(false);
  };

  const applyScenario = (next: DemoScenario) => {
    const machines = getMachines();
    const schneider = machines.find((machine) => machine.protocol === "Modbus TCP");
    const rockwell = machines.find((machine) => machine.protocol === "EtherNet/IP");
    setScenario(next);
    setTemperaturesConfigured(next !== "no-temperature");
    if (next === "no-machine") {
      setMachineId(""); setPendingMachineId(""); setConnection("waiting"); setMonitoring("stopped"); setMachineState("READY");
      setOperationalMessage("Nenhuma máquina selecionada."); return;
    }
    const selected = next === "rockwell" ? rockwell : schneider;
    if (selected) { setMachineId(selected.id); setPendingMachineId(selected.id); }
    if (next === "communication-fault") {
      setConnection("disconnected"); setMonitoring("stopped"); setMachineState("FAULT"); setOperationalMessage("Falha simulada de comunicação. Últimos dados preservados."); return;
    }
    setConnection("connected");
    if (next === "waiting-trigger") { setMonitoring("waiting_trigger"); setMachineState("READY"); }
    else if (next === "running") { setMonitoring("running"); setMachineState("RUNNING"); }
    else if (next === "paused") { setMonitoring("paused"); setMachineState("PAUSED"); }
    else if (next === "completed" || next === "partial-save") { setMonitoring("completed"); setMachineState("READY"); }
    else { setMonitoring("stopped"); setMachineState("READY"); }
    setOperationalMessage(next === "partial-save" ? "Ciclo concluído; CSV pendente no modo de demonstração." : "Cenário de demonstração aplicado.");
  };

  const value = useMemo(
    () => ({
      machineId,
      pendingMachineId,
      setPendingMachineId,
      confirmMachine,
      connection,
      setConnection,
      machineState:
        connection === "disconnected" ? ("DISCONNECTED" as MachineState) : machineState,
      setMachineState,
      monitoring,
      setMonitoring,
      commandBusy,
      operationalMessage,
      setOperationalMessage,
      scenario,
      applyScenario,
      temperaturesConfigured,
    }),
    [machineId, pendingMachineId, connection, machineState, monitoring, commandBusy, operationalMessage, scenario, temperaturesConfigured],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
