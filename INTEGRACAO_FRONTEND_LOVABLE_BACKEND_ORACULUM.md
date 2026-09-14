# IntegraÃ§Ã£o do Frontend Lovable com o Backend Oraculum

## 1. Objetivo

Integrar o frontend React criado no Lovable ao backend Python existente do Oraculum, mantendo o Python como responsÃ¡vel pela comunicaÃ§Ã£o com CLPs Schneider e Rockwell.

## 2. Arquitetura

```text
Frontend React/Lovable
â†’ PyWebView
â†’ OraculumHtmlApi em app.py
â†’ drivers Schneider ou Rockwell
â†’ CLP
```

O frontend nÃ£o deve comunicar diretamente com os CLPs.

## 3. Estado atual

- Frontend validado localmente com `npm run dev`.
- Branch de trabalho atual: `cristinmarchiori-ideal-disco`.
- Branch que contÃ©m o backend: `feature/integracao-backend-oraculum`.
- Backend preservado na branch: `migration/projeto-oraculum-local`.
- Arquivos do backend copiados para a branch atual, ainda sem integraÃ§Ã£o concluÃ­da.
- `python -c "import app; print('BACKEND CARREGADO COM SUCESSO')"` executado com sucesso.
- IntegraÃ§Ã£o serÃ¡ feita sem merge completo entre as branches.

## 4. FunÃ§Ãµes existentes no backend

A classe `OraculumHtmlApi` jÃ¡ expÃµe:

- `obter_estado()`
- `obter_configuracao()`
- `salvar_configuracao()`
- `iniciar()`
- `pausar()`
- `parar()`
- `obter_diagnostico()`
- `testar_comunicacao()`
- `testar_form()`
- `obter_detalhes_ciclo()`

O backend abre a interface com `webview.create_window(..., js_api=OraculumHtmlApi())`.

## 5. Primeira entrega

A primeira entrega deve ser somente leitura:

1. abrir o frontend atual por meio do `app.py` e do PyWebView;
2. consultar `window.pywebview.api.obter_estado()`;
3. converter o retorno Python em objetos TypeScript;
4. substituir os valores simulados da tela de monitoraÃ§Ã£o por valores reais;
5. manter os comandos Iniciar, Pausar, Parar e Salvar bloqueados;
6. mostrar claramente quando o backend ainda nÃ£o estiver conectado;
7. nÃ£o realizar escrita no CLP nesta etapa.

## 6. Campos reais de `obter_estado()`

O backend retorna os campos:

- `rodando`
- `pausado`
- `conectado`
- `ciclo_ativo`
- `trigger`
- `monitor_status`
- `pressao_lida`
- `pressao_programada`
- `inercia_pressao`
- `form_quantidade`
- `amostras`
- `tempos_sob_pressao`
- `tempos_ventilacao`
- `limite_minimo`
- `limite_maximo`
- `serie_tempo`
- `serie_pressao_lida`
- `serie_pressao_programada`
- `mensagem`
- `ultimo_arquivo`
- `resultados`
- `temperaturas_configuradas`
- `temperatura_programada`
- `temperatura_lida_1`
- `temperatura_lida_2`
- `serie_temperatura_programada`
- `serie_temperatura_lida_1`
- `serie_temperatura_lida_2`

## 7. ConversÃ£o de dados

Manter os nomes do backend em `snake_case` e converter na camada de serviÃ§o para os nomes TypeScript em `camelCase`.

Exemplos:

```text
pressao_lida â†’ pressure
pressao_programada â†’ setpoint
inercia_pressao â†’ inertia
ciclo_ativo â†’ cycleActive
temperatura_programada â†’ programmedTemperature
temperatura_lida_1 â†’ temperature1
temperatura_lida_2 â†’ temperature2
ultimo_arquivo â†’ lastFile
```

## 8. Arquivos do frontend impactados

- `src/services/oraculum.ts`
- `src/data/oraculum.ts`
- `src/mock/types.ts`
- `src/components/oraculum/session.tsx`
- `src/routes/index.tsx`
- `src/components/oraculum/Oscilloscope.tsx`
- `src/components/oraculum/AppShell.tsx`

Pode ser criado um Ãºnico adaptador especÃ­fico para PyWebView, caso isso mantenha `src/services/oraculum.ts` simples. NÃ£o criar vÃ¡rios scripts auxiliares para pequenas alteraÃ§Ãµes.

## 9. Arquivos do backend candidatos

- `app.py`
- `drivers/schneider.py`
- `drivers/rockwell.py`
- `ab_simple.py`
- `clp_comm.py`
- `modbus_simple.py`

Arquivos adicionais somente serÃ£o trazidos se os imports reais de `app.py` exigirem.

NÃ£o trazer:

- `.venv-ab`
- `build`
- `__pycache__`
- `resultados_oraculum`
- `teste_interface.py`
- arquivos temporÃ¡rios ou compilados

## 10. Testes locais

1. executar `npm run build`;
2. validar como o frontend compilado Ã© servido;
3. executar o `app.py` sem iniciar aquisiÃ§Ã£o;
4. confirmar abertura do frontend React no PyWebView;
5. confirmar disponibilidade de `window.pywebview.api`;
6. confirmar leitura de `obter_estado()`;
7. validar estado sem mÃ¡quina, conectado e desconectado;
8. confirmar que a ausÃªncia do backend nÃ£o apresenta dados falsos;
9. revisar console do frontend e terminal Python;
10. executar `git diff --check` e `git diff`.

## 11. Teste real no CLP

O primeiro teste real serÃ¡ somente leitura:

- mÃ¡quina parada ou em condiÃ§Ã£o segura;
- selecionar uma mÃ¡quina jÃ¡ cadastrada;
- testar comunicaÃ§Ã£o;
- conferir pressÃ£o, temperaturas e estado;
- nÃ£o executar escrita ou comando de processo.

## 12. CritÃ©rios de aceite

- frontend React abre pelo `app.py`;
- dados exibidos vÃªm de `obter_estado()`;
- modo demonstraÃ§Ã£o fica desativado no modo real;
- ausÃªncia do backend nÃ£o produz dados falsos;
- sem PyWebView, a interface nÃ£o exibe falsamente â€œConectadoâ€ ou â€œMonitorandoâ€;
- falha de comunicaÃ§Ã£o mantÃ©m os Ãºltimos dados vÃ¡lidos e sinaliza desatualizaÃ§Ã£o;
- nenhuma escrita no CLP Ã© realizada nesta etapa;
- backend antigo permanece recuperÃ¡vel pela branch de migraÃ§Ã£o;
- `main` e `migration/projeto-oraculum-local` nÃ£o sÃ£o alteradas.

## 13. Rollback

Se a integraÃ§Ã£o falhar, revisar primeiro as alteraÃ§Ãµes:

```powershell
git status
git diff
git diff --cached
```

Para descartar alteraÃ§Ãµes rastreadas ainda nÃ£o confirmadas:

```powershell
git restore .
git restore --staged .
```

Antes de remover arquivos nÃ£o rastreados, revisar com:

```powershell
git clean -nd
```

Somente apÃ³s conferir a prÃ©via:

```powershell
git clean -fd
```

A branch `migration/projeto-oraculum-local` e a `main` nÃ£o devem ser alteradas durante esta implementaÃ§Ã£o.

## 14. EvidÃªncia adicional do frontend atual

- O frontend utiliza TanStack Start com Nitro.
- `npm run build` conclui com sucesso.
- O build gera `.output/public` e `.output/server`.
- NÃ£o Ã© gerado `dist/index.html`.
- `npm run preview` falha procurando `dist/server/server.js`.
- `.output/server/index.mjs` foi gerado com preset `cloudflare-module` e encerra quando executado diretamente no Windows.
- `npm run dev` funciona em `http://localhost:8080`.
- Nesse modo, a interface ainda apresenta dados simulados.
- O `app.py` atual procura somente `index.html` ou `interface/index.html`.
- A integraÃ§Ã£o nÃ£o pode depender de abrir diretamente um arquivo HTML inexistente.
- O modo real deve obter estados exclusivamente de `window.pywebview.api.obter_estado()`.
- Sem PyWebView disponÃ­vel, a interface deve indicar backend desconectado.
- Sem backend real, a interface nÃ£o pode apresentar â€œConectadoâ€ ou â€œMonitorandoâ€ com dados fictÃ­cios.

## 15. PrÃ³xima implementaÃ§Ã£o isolada

A prÃ³xima alteraÃ§Ã£o deverÃ¡ definir uma forma compatÃ­vel de servir o frontend TanStack Start localmente e abri-lo no PyWebView, preservando `js_api=OraculumHtmlApi()`.

Somente depois dessa comunicaÃ§Ã£o bÃ¡sica funcionar deverÃ¡ ser implementada a troca dos dados simulados por `obter_estado()`.

A sequÃªncia serÃ¡:

```text
servidor local do frontend validado
â†’ abertura pelo PyWebView
â†’ window.pywebview.api disponÃ­vel
â†’ chamada isolada de obter_estado()
â†’ conversÃ£o snake_case para camelCase
â†’ leitura real na tela
â†’ remoÃ§Ã£o dos estados fictÃ­cios no modo real
```
