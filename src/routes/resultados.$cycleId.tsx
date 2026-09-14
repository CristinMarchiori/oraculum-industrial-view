import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, FileWarning } from "lucide-react";
import { Oscilloscope, ScopeLegend } from "@/components/oraculum/Oscilloscope";
import { Panel } from "@/components/oraculum/Panel";
import { StatusBadge } from "@/components/oraculum/StatusIndicator";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cycleStatusTone } from "@/lib/status";
import { machineService, resultsService } from "@/services/oraculum";

export const Route = createFileRoute("/resultados/$cycleId")({
  head: ({ params }) => ({ meta: [
    { title: `${params.cycleId} — Oraculum` }, { name: "description", content: "Detalhes simulados do ciclo industrial selecionado." },
    { property: "og:title", content: `${params.cycleId} — Oraculum` }, { property: "og:description", content: "Detalhes simulados do ciclo industrial selecionado." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CycleDetail,
});

function CycleDetail() {
  const { cycleId } = Route.useParams();
  const cycle = resultsService.get(cycleId);
  if (!cycle) return <div className="grid min-h-64 place-items-center"><div className="text-center"><h1 className="font-display text-2xl">Ciclo não encontrado</h1><Button asChild className="mt-4"><Link to="/resultados">Voltar aos resultados</Link></Button></div></div>;
  const machine = machineService.list().find((item) => item.id === cycle.machineId);
  const waveform = resultsService.waveform(cycle);
  const visible = { pressure: true, setpoint: true, pressureMin: true, pressureMax: true };
  return <div className="space-y-4">
    <header className="flex flex-wrap items-start justify-between gap-3"><div><p className="tech-label">Resultados / Detalhes do ciclo</p><div className="flex items-center gap-3"><h1 className="font-display text-2xl font-semibold uppercase">{cycle.id}</h1><StatusBadge tone={cycleStatusTone(cycle.status)} label={cycle.status} /></div><p className="text-sm text-muted-foreground">{new Date(cycle.startedAt).toLocaleString("pt-BR")} · {machine?.name}</p></div><Button asChild variant="outline"><Link to="/resultados"><ArrowLeft />Voltar</Link></Button></header>
    {(!cycle.csvSaved || !cycle.pngSaved) && <div className="flex gap-3 border border-warn/40 bg-warn/10 p-3 text-sm text-warn"><FileWarning className="h-5 w-5 shrink-0" /><div><strong>Resultado salvo parcialmente.</strong><p>{cycle.saveMessage}</p></div></div>}
    <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{[["Amostras", cycle.sampleCount.toLocaleString("pt-BR")],["Duração", `${cycle.durationS.toFixed(1).replace(".", ",")} s`],["Sob pressão", `${cycle.pressureTime.toFixed(1).replace(".", ",")} s`],["Alívio", `${cycle.reliefTime.toFixed(1).replace(".", ",")} s`]].map(([label,value]) => <div key={label} className="panel-surface p-3"><span className="tech-label">{label}</span><strong className="readout mt-2 block text-2xl">{value}</strong></div>)}</section>
    <Panel title="Gráfico do ciclo" subtitle={cycle.baseFile}><ScopeLegend mode="pressure" visible={visible} onToggle={() => undefined} /><Oscilloscope data={waveform} visible={visible} mode="pressure" height={350} /></Panel>
    <div className="grid gap-3 xl:grid-cols-2"><PeriodTable title="Períodos sob pressão" rows={cycle.pressurePeriods} pressure /><PeriodTable title="Alívios de pressão" rows={cycle.reliefPeriods} /></div>
    <Panel title="Resumo térmico" bodyClassName="grid gap-3 sm:grid-cols-3"><Reading label="Temperatura máxima" value={`${cycle.maxTemperature.toFixed(1).replace(".", ",")} °C`} /><Reading label="Programada final" value="45,0 °C" /><Reading label="Desvio máximo" value="+2,4 °C" /></Panel>
  </div>;
}

function Reading({ label, value }: { label: string; value: string }) { return <div><span className="tech-label">{label}</span><strong className="readout mt-1 block text-lg">{value}</strong></div>; }
function PeriodTable({ title, rows, pressure = false }: { title: string; rows: ReturnType<typeof resultsService.get> extends infer C ? NonNullable<C>["pressurePeriods"] : never; pressure?: boolean }) { return <Panel title={title} bodyClassName="p-0"><Table><TableHeader><TableRow><TableHead>Nº</TableHead><TableHead>Início</TableHead><TableHead>Fim</TableHead><TableHead>Duração</TableHead>{pressure && <TableHead>Limiar</TableHead>}</TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.number}><TableCell>{row.number}</TableCell><TableCell>{row.startS.toFixed(1)} s</TableCell><TableCell>{row.endS.toFixed(1)} s</TableCell><TableCell>{row.durationS.toFixed(1)} s</TableCell>{pressure && <TableCell>{row.threshold?.toFixed(1)} bar</TableCell>}</TableRow>)}</TableBody></Table></Panel>; }