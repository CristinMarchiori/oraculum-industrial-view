import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Panel } from "@/components/oraculum/Panel";
import { StatusBadge } from "@/components/oraculum/StatusIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cycleStatusTone } from "@/lib/status";
import { resultsService, machineService } from "@/services/oraculum";
import type { CycleStatus } from "@/mock/types";

export const Route = createFileRoute("/resultados/")({
  head: () => ({ meta: [
    { title: "Resultados — Oraculum" },
    { name: "description", content: "Histórico simulado de ciclos monitorados pelo Oraculum." },
    { property: "og:title", content: "Resultados — Oraculum" },
    { property: "og:description", content: "Histórico simulado de ciclos monitorados pelo Oraculum." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ResultsPage,
});

function ResultsPage() {
  const [query, setQuery] = useState("");
  const [machine, setMachine] = useState("all");
  const [status, setStatus] = useState("all");
  const [descending, setDescending] = useState(true);
  const cycles = resultsService.list();
  const machines = machineService.list();
  const filtered = useMemo(() => cycles.filter((cycle) =>
    (machine === "all" || cycle.machineId === machine) &&
    (status === "all" || cycle.status === status) &&
    cycle.id.toLowerCase().includes(query.toLowerCase()),
  ).sort((a, b) => descending ? b.startedAt.localeCompare(a.startedAt) : a.startedAt.localeCompare(b.startedAt)), [cycles, machine, status, query, descending]);

  return <div className="space-y-4">
    <PageHeading title="Resultados dos ciclos" subtitle="Histórico de demonstração · arquivos e medições simulados" />
    <Panel title="Filtros" subtitle={`${filtered.length} ciclos localizados`} bodyClassName="grid gap-2 sm:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_auto]">
      <label className="relative"><span className="sr-only">Buscar ciclo</span><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder="Buscar número do ciclo" /></label>
      <Select value={machine} onValueChange={setMachine}><SelectTrigger><SelectValue placeholder="Todas as máquinas" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as máquinas</SelectItem>{machines.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select>
      <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue placeholder="Todas as situações" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as situações</SelectItem>{(["OK", "WARNING", "FAULT"] as CycleStatus[]).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
      <Button variant="outline" onClick={() => setDescending((value) => !value)}><ArrowUpDown />{descending ? "Mais recentes" : "Mais antigos"}</Button>
    </Panel>
    <Panel title="Histórico" subtitle="Selecione um ciclo para análise" bodyClassName="p-0">
      {filtered.length ? <Table><TableHeader><TableRow><TableHead>Ciclo</TableHead><TableHead>Data e hora</TableHead><TableHead>Máquina</TableHead><TableHead>Amostras</TableHead><TableHead>Pressão</TableHead><TableHead>Períodos / alívios</TableHead><TableHead>Arquivos</TableHead><TableHead>Situação</TableHead><TableHead className="text-right">Ação</TableHead></TableRow></TableHeader><TableBody>{filtered.slice(0, 30).map((cycle) => <TableRow key={cycle.id}><TableCell className="readout font-semibold">{cycle.id}</TableCell><TableCell className="readout whitespace-nowrap">{new Date(cycle.startedAt).toLocaleString("pt-BR")}</TableCell><TableCell>{machines.find((item) => item.id === cycle.machineId)?.name ?? cycle.machineId}</TableCell><TableCell className="readout">{cycle.sampleCount.toLocaleString("pt-BR")}</TableCell><TableCell className="readout whitespace-nowrap">{cycle.maxPressure.toFixed(1).replace(".", ",")} bar</TableCell><TableCell className="readout">{cycle.pressurePeriods.length} / {cycle.reliefPeriods.length}</TableCell><TableCell className="text-xs"><span className={cycle.csvSaved ? "text-ok" : "text-warn"}>CSV {cycle.csvSaved ? "OK" : "pendente"}</span><br/><span className={cycle.pngSaved ? "text-ok" : "text-warn"}>PNG {cycle.pngSaved ? "OK" : "pendente"}</span></TableCell><TableCell><StatusBadge tone={cycleStatusTone(cycle.status)} label={cycle.status} /></TableCell><TableCell className="text-right"><Button asChild size="sm" variant="outline"><Link to="/resultados/$cycleId" params={{ cycleId: cycle.id }}>Detalhes</Link></Button></TableCell></TableRow>)}</TableBody></Table> : <div className="grid min-h-48 place-items-center text-sm text-muted-foreground">Nenhum resultado corresponde aos filtros.</div>}
    </Panel>
  </div>;
}

function PageHeading({ title, subtitle }: { title: string; subtitle: string }) { return <header><p className="tech-label">Análise / Histórico</p><h1 className="font-display text-2xl font-semibold uppercase">{title}</h1><p className="text-sm text-muted-foreground">{subtitle}</p></header>; }