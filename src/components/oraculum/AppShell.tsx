import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Cable,
  ChevronsLeft,
  ChevronsRight,
  Cpu,
  Gauge,
  ListChecks,
  Settings2,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getMachine, getMachines } from "@/data/oraculum";
import {
  connectionLabel,
  connectionTone,
  machineStateLabel,
  machineStateTone,
  monitoringLabel,
  toneText,
} from "@/lib/status";
import { StatusBadge, StatusDot } from "./StatusIndicator";
import { useSession } from "./session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const APP_VERSION = "v2.0.0-rc1";

const navItems = [
  { to: "/", label: "Monitoração", caption: "Ao vivo", icon: Activity },
  { to: "/resultados", label: "Resultados", caption: "Ciclos", icon: ListChecks },
  { to: "/configuracao", label: "Configuração", caption: "Parâmetros", icon: Settings2 },
  { to: "/diagnostico", label: "Diagnóstico", caption: "Integridade", icon: Stethoscope },
] as const;

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-right">
      <div className="readout text-sm text-foreground">
        {now ? now.toLocaleTimeString("pt-BR", { hour12: false }) : "--:--:--"}
      </div>
      <div className="tech-label">
        {now ? now.toLocaleDateString("pt-BR") : "--/--/----"}
      </div>
    </div>
  );
}

function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { connection } = useSession();
  const tone = connectionTone(connection);

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-primary/50 bg-primary/10">
          <Cpu className="h-5 w-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-display text-lg font-bold leading-none tracking-[0.22em] text-foreground">
              ORACULUM
            </div>
            <div className="tech-label mt-1 truncate text-[9px]">
              Monitoração e análise industrial
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              title={item.label}
              className={cn(
                "group flex items-center gap-3 rounded-sm border border-transparent px-3 py-2.5 transition-colors",
                active
                  ? "border-primary/40 bg-primary/12 text-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              />
              {!collapsed && (
                <span className="flex min-w-0 flex-1 items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium">{item.label}</span>
                  <span className="tech-label text-[9px]">{item.caption}</span>
                </span>
              )}
              {active && <span className="ml-auto h-5 w-0.5 shrink-0 bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2">
          <StatusDot tone={tone} pulse={connection !== "disconnected"} />
          {!collapsed && (
            <span className={cn("readout text-xs", toneText[tone])}>
              {connectionLabel(connection)}
            </span>
          )}
        </div>
        {!collapsed && (
          <>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <UserRound className="h-3.5 w-3.5" />
               <span className="truncate">Operador local</span>
            </div>
            <div className="tech-label">{APP_VERSION}</div>
          </>
        )}
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-sidebar-border py-1.5 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" /> Recolher
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function Header() {
  const { machineId, pendingMachineId, setPendingMachineId, connection, machineState, monitoring } =
    useSession();
  const machine = getMachine(machineId || pendingMachineId);
  const cTone = connectionTone(connection);
  const mTone = machineStateTone(machineState);
  const acquisitionActive = monitoring === "running" || monitoring === "paused";

  return (
    <header className="flex h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-panel-header px-4">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger disabled={acquisitionActive} className="flex items-center gap-3 rounded-sm border border-border bg-panel px-3 py-1.5 text-left transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50">
            <Gauge className="h-4 w-4 text-primary" />
            <span>
              <span className="block font-display text-base font-semibold leading-none tracking-wide text-foreground">
                {machineId || pendingMachineId ? machine.name : "Nenhuma máquina"}
              </span>
              <span className="tech-label">{machineId || pendingMachineId ? machine.line : "Seleção pendente"}</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            <DropdownMenuLabel className="tech-label">Máquinas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {getMachines().map((m) => (
              <DropdownMenuItem
                key={m.id}
                onClick={() => setPendingMachineId(m.id)}
                className="flex flex-col items-start gap-0.5"
              >
                <span className="text-sm">{m.name}</span>
                <span className="readout text-[11px] text-muted-foreground">
                  {m.model} · {m.ip}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden items-center gap-4 border-l border-border pl-4 md:flex">
          <div>
            <div className="tech-label">Protocolo</div>
            <div className="readout text-xs text-foreground">{machineId || pendingMachineId ? machine.protocol : "--"}</div>
          </div>
          <div>
            <div className="tech-label">Endereço técnico</div>
            <div className="readout text-xs text-foreground">
              {machineId || pendingMachineId ? `${machine.ip}:${machine.port}` : "--"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
         <StatusBadge tone={mTone} label={machineStateLabel(machineState)} />
        <div
          className={cn(
            "flex items-center gap-2 rounded-sm border border-border bg-panel px-2.5 py-1.5 text-xs",
            toneText[cTone],
          )}
        >
            <Cable className="h-3.5 w-3.5" />
            <StatusDot tone={cTone} pulse={connection !== "disconnected"} />
            <span className="readout">{connectionLabel(connection)}</span>
        </div>
        <span className="hidden readout text-[11px] text-muted-foreground lg:inline">
           AQUISIÇÃO {monitoringLabel(monitoring)}
        </span>
        <Clock />
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <div className="flex min-h-7 items-center justify-center border-b border-warn/35 bg-warn/10 px-3 text-center font-mono text-[10px] font-semibold uppercase text-warn">
          Modo de demonstração · Dados simulados, sem conexão com o CLP
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">{children}</main>
      </div>
    </div>
  );
}
