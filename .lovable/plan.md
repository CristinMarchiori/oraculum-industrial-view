# Oraculum Frontend V2 — Interface industrial de monitoramento

Aplicação web desktop-first com aparência de software industrial/SCADA profissional, totalmente com dados simulados, pronta para receber o backend Python depois.

## Identidade visual

- Fundo escuro (azul-petróleo profundo), azul tecnológico como cor de ação, cinzas neutros e texto branco de alto contraste.
- Cores de status usadas com parcimônia: verde (normal), amarelo (atenção), vermelho (falha), azul (informação).
- Tipografia técnica: títulos condensados, números em fonte monoespaçada (leitura de instrumento).
- Cantos retos/levemente arredondados, linhas finas de separação, densidade alta de informação — nada de visual "SaaS genérico".

## Estrutura permanente

- **Barra lateral**: logo ORACULUM + subtítulo, itens Monitoração, Resultados, Configuração e Diagnóstico com ícone, destaque da página ativa e botão para recolher. No rodapé: estado da conexão, usuário/sistema e versão.
- **Cabeçalho**: seletor de máquina, protocolo, endereço IP, indicador de conexão, relógio ao vivo e estado geral da máquina.
- Um interruptor permite simular os estados de conexão (conectado, instável, desconectado) para demonstração.

## Tela 1 — Monitoração (principal)

- Faixa de indicadores: pressão atual, pressão programada, tempo de pressão, tempo de alívio — cada um com unidade, tendência e status.
- Três indicadores de temperatura (T1, T2, T3) com faixa de alerta visual.
- **Osciloscópio**: gráfico grande de séries temporais com grade, eixos rotulados, legenda, cursor com leitura de valores, zoom e deslocamento, linhas retas (sem suavização). Controles RUN, PAUSE, ZOOM +, ZOOM −, RESET VIEW e seleção de sinais visíveis (pressão, pressão programada, temperatura). Dados gerados continuamente enquanto em RUN.
- **Trigger**: estado, fonte, nível e horário do disparo.
- **Estado da máquina**: painel com indicador muito claro entre READY, RUNNING, PAUSED, WARNING, FAULT, DISCONNECTED.

## Tela 2 — Resultados

- Tabela de ciclos: ID, data/hora, pressão máxima, pressão programada, tempo de pressão, tempo de alívio, temperatura máxima e status.
- Filtros por período, máquina e status, além de busca por ID; ordenação por coluna.
- Ao clicar num ciclo, painel de detalhe com informações do ciclo (ID, início, fim, duração, máquina, operador), gráficos de pressão, pressão programada e temperatura ao longo do tempo, indicadores calculados (máxima, média, tempos, temperatura máxima) e veredito final CYCLE OK / CYCLE WITH WARNING.

## Tela 3 — Configuração

- Seções: Comunicação (IP, protocolo, porta, timeout, unidade Modbus), Aquisição (intervalo, número de amostras, modo, histórico) e Sinais (tabela editável com sinal, endereço, tipo e unidade).
- Botões de salvar/descartar com confirmação visual — nada é enviado a equipamento real.

## Tela 4 — Diagnóstico

- Blocos de Comunicação (conexão, latência, última leitura, erros), Aquisição (estado, taxa, amostras recebidas/perdidas) e Sistema (versão, backend, frontend, última atualização).
- Painel de eventos com timestamp, tipo (INFO/WARNING/ERROR) e mensagem, com filtro por tipo e rolagem automática.

## Detalhes técnicos

- React + TypeScript + Tailwind, rotas TanStack: `/` (monitoração), `/resultados`, `/configuracao`, `/diagnostico`; layout comum com barra lateral e cabeçalho.
- Componentes reutilizáveis em `src/components/oraculum/`: MetricCard, StatusIndicator, StatusBadge, DataTable, Oscilloscope, ChartLegend, Toolbar, FilterBar, MachineSelector, Panel.
- Todos os dados simulados isolados em `src/mock/` (máquinas, sinais, ciclos, eventos, gerador de séries temporais) atrás de funções tipadas em `src/data/` que depois trocam para chamadas de API sem tocar nas telas.
- Gráficos com Recharts, configurado para linhas retas, grade técnica e eixos numéricos; zoom/pan por estado de domínio controlado.
- Tokens de cor e tipografia definidos em `src/styles.css`; nenhum valor de cor fixo nos componentes.
- Metadados de página (título/descrição) próprios em cada rota.

## Fora do escopo desta etapa

Comunicação Modbus/CLP, backend Python, banco de dados, autenticação e qualquer escrita em equipamento.
