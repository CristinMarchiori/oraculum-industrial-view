export interface BackendMachine {
  id: string;
  nome: string;
  ip: string;
  protocolo: string;
  porta: number;
}

export interface BackendState {
  rodando: boolean;
  pausado: boolean;
  conectado: boolean;
  ciclo_ativo: boolean;
  trigger: number;
  monitor_status: number;

  pressao_lida: number;
  pressao_programada: number;
  inercia_pressao: number;

  form_quantidade: number;
  amostras: number;

  tempos_sob_pressao: unknown[];
  tempos_ventilacao: unknown[];

  limite_minimo: number | null;
  limite_maximo: number | null;

  serie_tempo: number[];
  serie_pressao_lida: number[];
  serie_pressao_programada: number[];

  mensagem: string;
  ultimo_arquivo: string;
  resultados: unknown[];

  temperaturas_configuradas: boolean;
  temperatura_programada: number | null;
  temperatura_lida_1: number | null;
  temperatura_lida_2: number | null;

  serie_temperatura_programada: number[];
  serie_temperatura_lida_1: number[];
  serie_temperatura_lida_2: number[];

  maquinas_disponiveis: BackendMachine[];
  maquina_ativa: BackendMachine | null;
  maquina_selecionada: boolean;
  troca_maquina_bloqueada: boolean;

  estado_comunicacao:
    | "monitorando"
    | "falha"
    | "conectada"
    | "desconectada"
    | "nao_selecionada";
}

interface OraculumPythonApi {
  obter_estado(): Promise<BackendState>;
}

declare global {
  interface Window {
    pywebview?: {
      api?: OraculumPythonApi;
    };
  }
}

export function backendDisponivel(): boolean {
  return typeof window !== "undefined"
    && typeof window.pywebview?.api?.obter_estado === "function";
}

export async function obterEstadoBackend(): Promise<BackendState | null> {
  if (!backendDisponivel()) {
    return null;
  }

  return window.pywebview!.api!.obter_estado();
}
