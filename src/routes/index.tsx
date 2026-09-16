import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, RotateCcw, Square, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MetricCard } from "@/components/oraculum/MetricCard";
import { Oscilloscope, ScopeLegend } from "@/components/oraculum/Oscilloscope";
import { Panel } from "@/components/oraculum/Panel";
import { StatusBadge, StatusPlate } from "@/components/oraculum/StatusIndicator";
import { useSession } from "@/components/oraculum/session";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getLiveBuffer, getMachine, getMachines, getNextSample } from "@/data/oraculum";
import { machineStateLabel, machineStateTone, monitoringLabel } from "@/lib/status";
import type { DemoScenario, Sample } from "@/mock/types";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Monitoração — Oraculum" },
    { name: "description", content: "Monitoração simulada de ciclos, pressão e temperatura de prensas industriais." },
    { property: "og:title", content: "Monitoração — Oraculum" },
    { property: "og:description", content: "Monitoração simulada de ciclos, pressão e temperatura de prensas industriais." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const session = useSession();
  const [data, setData] = useState<Sample[]>(() => getLiveBuffer());
  const [visible, setVisible] = useState<Record<string, boolean>>({ pressure: true, setpoint: true, pressureMin: true, pressureMax: true, temperature: true, temperature2: true, temperatureMin: true, temperatureMax: true });
  const [zoom, setZoom] = useState(1);
  const indexRef = useRef(240);
  const machine = getMachine(session.pendingMachineId || session.machineId);
  const confirmedMachine = getMachine(session.machineId);
  const confirmed = Boolean(session.machineId);
  const acquisitionActive = session.monitoring === "running" || session.monitoring === "paused" || session.monitoring === "waiting_trigger";
  const faulted = session.connection === "disconnected" || session.connection === "backend_unavailable" || session.machineState === "FAULT";
  const canStart = confirmed && session.connection === "connected" && session.monitoring === "stopped" && !session.commandBusy && !faulted;
  const canPause = session.connection === "connected" && (session.monitoring === "running" || session.monitoring === "paused") && !session.commandBusy;
  const canStop = acquisitionActive && !session.commandBusy;
  const canConfirm = Boolean(session.pendingMachineId) && session.pendingMachineId !== session.machineId && !acquisitionActive && !session.commandBusy;

  useEffect(() => {
    if (session.monitoring !== "running" || session.connection !== "connected") return;
    const id = window.setInterval(() => {
      setData((current) => {
        const last = current.at(-1);
        if (!last) return getLiveBuffer();
        indexRef.current += 1;
        return [...current.slice(-239), getNextSample(last, indexRef.current, machine.id === "M03" ? 240 : 200)];
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [session.monitoring, session.connection, machine.id]);

  const latest = data.at(-1);
  const displayed = useMemo(() => data.slice(-Math.max(40, Math.round(data.length / zoom))), [data, zoom]);
  const command = (next: "running" | "paused" | "stopped") => {
    if ((next === "running" && session.monitoring !== "paused" && !canStart) || (next === "paused" && !canPause) || (next === "stopped" && !canStop)) return;
    session.setMonitoring(next);
    session.setMachineState(next === "running" ? "RUNNING" : next === "paused" ? "PAUSED" : "READY");
    session.setOperationalMessage(next === "running" ? (session.monitoring === "paused" ? "Aquisição simulada retomada." : "Aquisição simulada iniciada; aguardando disparo do ciclo.") : next === "paused" ? "Aquisição simulada pausada." : "Aquisição simulada encerrada com segurança.");
  };
  const scenarios: { value: DemoScenario; label: string }[] = [
    { value: "running", label: "Linha de Prensa — Ciclo normal" },
    { value: "warning", label: "Linha de Prensa — Ciclo com atenção" },
    { value: "communication-fault", label: "Falha — Máquina desconectada" },
    { value: "waiting-trigger", label: "Aguardando disparo" },
    { value: "paused", label: "Ciclo pausado" },
    { value: "completed", label: "Ciclo concluído" },
    { value: "partial-save", label: "Resultado salvo parcialmente" },
    { value: "no-temperature", label: "Temperaturas não configuradas" },
    { value: "rockwell", label: "Máquina Rockwell conectada" },
    { value: "no-machine", label: "Nenhuma máquina" },
  ];

  return (
    <div className="space-y-3">
      <section className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-2">
        <div><p className="tech-label">Operação / Linha de prensa</p><h1 className="font-display text-2xl font-semibold uppercase text-foreground">Monitoração de ciclo</h1></div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="space-y-1"><span className="tech-label block">Cenário de demonstração</span><Select value={session.scenario} onValueChange={(value) => session.applyScenario(value as DemoScenario)}><SelectTrigger className="w-72 max-w-[80vw]"><SelectValue /></SelectTrigger><SelectContent>{scenarios.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></label>
        </div>
      </section>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px]">
        <Panel title="Osciloscópio de pressão × tempo" subtitle={faulted ? "Dados desatualizados · últimos valores válidos preservados" : "Dados simulados ao vivo · amostragem de 250 ms"} actions={<div className="flex items-center gap-1"><Button size="icon" variant="ghost" title="Aumentar zoom" onClick={() => setZoom((v) => Math.min(4, v + 0.5))}><ZoomIn /></Button><Button size="icon" variant="ghost" title="Reduzir zoom" onClick={() => setZoom((v) => Math.max(1, v - 0.5))}><ZoomOut /></Button><Button size="icon" variant="ghost" title="Restaurar visualização" onClick={() => setZoom(1)}><RotateCcw /></Button></div>}>
          <ScopeLegend mode="pressure" pressureUnit={confirmedMachine.pressureUnit} visible={visible} onToggle={(key) => setVisible((v) => ({ ...v, [key]: !v[key] }))} />
          {confirmed ? <Oscilloscope data={displayed} visible={visible} mode="pressure" pressureUnit={confirmedMachine.pressureUnit} height={270} /> : <EmptyChart text="Confirme uma máquina para visualizar as amostras." />}
        </Panel>
        <div className="space-y-3">
          <StatusPlate tone={machineStateTone(session.machineState)} state={machineStateLabel(session.machineState)} caption={confirmed ? `${confirmedMachine.name} · ${session.monitoring === "waiting_trigger" ? "Aguardando disparo" : faulted ? "Dados desatualizados" : "Dados simulados ao vivo"}` : "Máquina não confirmada"} />
          <MetricCard label="Pressão atual" value={confirmed ? latest?.pressure.toFixed(1).replace(".", ",") ?? "--" : "--"} unit={confirmedMachine.pressureUnit} tone={faulted ? "warn" : confirmed ? "ok" : "idle"} hint={faulted ? "Último valor válido" : "Dentro da faixa"} />
          <MetricCard label="Pressão programada" value={confirmed ? latest?.setpoint.toFixed(1).replace(".", ",") ?? "--" : "--"} unit={confirmedMachine.pressureUnit} tone="info" hint="Referência do ciclo" />
        </div>
      </div>

      <Panel title="Seleção segura de máquina" subtitle={confirmed ? "Máquina confirmada" : "Confirmação necessária"} bodyClassName="grid gap-3 md:grid-cols-[minmax(220px,1fr)_1fr_auto] md:items-end">
        <label className="space-y-1"><span className="tech-label block">Máquina a monitorar</span><Select value={session.pendingMachineId} onValueChange={session.setPendingMachineId} disabled={acquisitionActive}><SelectTrigger><SelectValue placeholder="Selecione uma máquina" /></SelectTrigger><SelectContent>{getMachines().map((item) => <SelectItem key={item.id} value={item.id} disabled={!item.available}>{item.name} · {item.model}</SelectItem>)}</SelectContent></Select></label>
        <div className="grid grid-cols-2 gap-3 rounded-sm border border-border bg-background/30 p-2"><div><span className="tech-label block">Protocolo</span><span className="readout text-sm">{session.pendingMachineId ? machine.protocol : "--"}</span></div><div><span className="tech-label block">Endereço técnico</span><span className="readout text-sm">{session.pendingMachineId ? `${machine.ip}:${machine.port}` : "--"}</span></div></div>
        <Button onClick={() => void session.confirmMachine()} disabled={!canConfirm}>{session.commandBusy ? "Confirmando..." : "Confirmar máquina"}</Button>
      </Panel>

      <Panel title="Controle de aquisição" subtitle="Amostragem simulada · 250 ms" actions={<div className="flex flex-wrap gap-2"><Button size="sm" onClick={() => command("running")} disabled={!canStart}><Play />Iniciar</Button><Button size="sm" variant="secondary" onClick={() => command(session.monitoring === "paused" ? "running" : "paused")} disabled={!canPause}>{session.monitoring === "paused" ? <Play /> : <Pause />}{session.monitoring === "paused" ? "Continuar" : "Pausar"}</Button><AlertDialog><AlertDialogTrigger asChild><Button size="sm" variant="destructive" disabled={!canStop}><Square />Parar</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Parar a aquisição ativa?</AlertDialogTitle><AlertDialogDescription>O ciclo simulado atual será encerrado. Os dados já coletados continuarão visíveis.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => command("stopped")}>Parar aquisição</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>}>
        <div className="flex flex-wrap items-center justify-between gap-3"><p className={faulted ? "text-sm text-warn" : "text-sm text-muted-foreground"}>{session.operationalMessage}</p><StatusBadge tone={machineStateTone(session.machineState)} label={monitoringLabel(session.monitoring)} /></div>
      </Panel>

      <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Inércia de pressão" value={confirmed ? "18,4" : "--"} unit="UINT" tone="info" hint="Sinal de processo" />
        <MetricCard label="Duração do ciclo" value={session.monitoring === "running" ? "02:43" : "--:--"} unit="min" tone={session.monitoring === "running" ? "ok" : "idle"} hint={session.monitoring === "running" ? "Ciclo em acompanhamento" : "Aguardando ciclo"} />
        <MetricCard label="Temperatura programada" value={confirmed && session.temperaturesConfigured ? "45,0" : "--"} unit="°C" tone={session.temperaturesConfigured ? "info" : "idle"} hint={session.temperaturesConfigured ? "Faixa configurada" : "Não configurada"} />
        <MetricCard label="Temperatura lida 1" value={confirmed && session.temperaturesConfigured ? latest?.temperature.toFixed(1).replace(".", ",") ?? "--" : "--"} unit="°C" tone="ok" hint={session.temperaturesConfigured ? "Desvio +0,6 °C" : "Indisponível"} />
        <MetricCard label="Temperatura lida 2" value={confirmed && session.temperaturesConfigured ? latest?.temperature2?.toFixed(1).replace(".", ",") ?? "--" : "--"} unit="°C" tone="ok" hint={session.temperaturesConfigured ? "Desvio −0,4 °C" : "Indisponível"} />
        <MetricCard label="Amostras" value={confirmed ? data.length.toLocaleString("pt-BR") : "--"} tone="info" hint="Último resultado: cycle_02481" />
      </section>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Panel title="Temperatura × tempo" subtitle="Cursor sobre o gráfico exibe a leitura">
          <ScopeLegend mode="temperature" visible={visible} onToggle={(key) => setVisible((v) => ({ ...v, [key]: !v[key] }))} />
          {confirmed && session.temperaturesConfigured ? <Oscilloscope data={displayed} visible={visible} mode="temperature" height={300} /> : <EmptyChart text="Temperaturas não configuradas ou sem amostras." />}
        </Panel>
        <div className="space-y-3"><Panel title="Tempo sob pressão" subtitle="2 períodos"><Period label="Período 1" value="5,7 s" /><Period label="Período 2" value="3,7 s" /></Panel><Panel title="Alívio de pressão" subtitle="1 período"><Period label="Alívio 1" value="2,7 s" /></Panel></div>
      </div>
    </div>
  );
}

function EmptyChart({ text }: { text: string }) { return <div className="grid h-[360px] place-items-center border border-dashed border-border bg-background/25 text-sm text-muted-foreground">{text}</div>; }
function Period({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b border-border py-2 last:border-0"><span className="text-sm text-muted-foreground">{label}</span><strong className="readout text-sm text-foreground">{value}</strong></div>; }
