import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { getMachines } from "@/data/oraculum";
import type { ConnectionState, MachineState } from "@/mock/types";

interface SessionValue {
  machineId: string;
  setMachineId: (id: string) => void;
  connection: ConnectionState;
  setConnection: (c: ConnectionState) => void;
  machineState: MachineState;
  setMachineState: (s: MachineState) => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [machineId, setMachineId] = useState(getMachines()[0]!.id);
  const [connection, setConnection] = useState<ConnectionState>("connected");
  const [machineState, setMachineState] = useState<MachineState>("RUNNING");

  const value = useMemo(
    () => ({
      machineId,
      setMachineId,
      connection,
      setConnection,
      machineState:
        connection === "disconnected" ? ("DISCONNECTED" as MachineState) : machineState,
      setMachineState,
    }),
    [machineId, connection, machineState],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
