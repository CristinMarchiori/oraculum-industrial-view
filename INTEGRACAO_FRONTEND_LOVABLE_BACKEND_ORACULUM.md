# Integração do Frontend Lovable com o Backend Oraculum

## 1. Objetivo

Integrar o frontend React criado no Lovable ao backend Python existente do Oraculum, mantendo o Python como responsável pela comunicação com CLPs Schneider e Rockwell.

## 2. Arquitetura

```text
Frontend React/Lovable
→ PyWebView
→ OraculumHtmlApi em app.py
→ drivers Schneider ou Rockwell
→ CLP
```

O frontend não deve comunicar diretamente com os CLPs.

## 3. Estado atual

- Frontend validado localmente com `npm run dev`.
- Branch de integração: `feature/integracao-backend-oraculum`.
- Backend preservado na branch: `migration/projeto-oraculum-local`.
- Integração será feita sem merge completo entre as branches.

## 4. Funções existentes no backend

A classe `OraculumHtmlApi` já expõe:

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

1. abrir o frontend compilado pelo `app.py`;
2. consultar `window.pywebview.api.obter_estado()`;
3. converter o retorno Python em objetos TypeScript;
4. substituir os valores simulados da tela de monitoração por valores reais;
5. manter os comandos Iniciar, Pausar, Parar e Salvar bloqueados;
6. mostrar claramente quando o backend ainda não estiver conectado.

## 6. Campos reais de obter_estado

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

## 7. Conversão de dados

Manter os nomes do backend em `snake_case` e converter na camada de serviço para os nomes TypeScript em `camelCase`.

Exemplos:

```text
pressao_lida → pressure
pressao_programada → setpoint
inercia_pressao → inertia
ciclo_ativo → cycleActive
temperatura_programada → programmedTemperature
temperatura_lida_1 → temperature1
temperatura_lida_2 → temperature2
ultimo_arquivo → lastFile
```

## 8. Arquivos do frontend impactados

- `src/services/oraculum.ts`
- `src/mock/types.ts`
- `src/components/oraculum/session.tsx`
- `src/routes/index.tsx`
- `src/components/oraculum/Oscilloscope.tsx`

Pode ser criado um adaptador específico para PyWebView, caso isso mantenha `src/services/oraculum.ts` simples.

## 9. Arquivos do backend candidatos

- `app.py`
- `drivers/schneider.py`
- `drivers/rockwell.py`
- `ab_simple.py`
- `clp_comm.py`
- `modbus_simple.py`

Arquivos adicionais somente serão trazidos se os imports reais de `app.py` exigirem.

Não trazer:

- `.venv-ab`
- `build`
- `__pycache__`
- `resultados_oraculum`
- `teste_interface.py`
- arquivos temporários ou compilados

## 10. Testes locais

1. executar `npm run build`;
2. executar o `app.py` sem iniciar aquisição;
3. confirmar abertura do frontend React no PyWebView;
4. confirmar disponibilidade de `window.pywebview.api`;
5. confirmar leitura de `obter_estado()`;
6. validar estado sem máquina, conectado e desconectado;
7. revisar console do frontend e terminal Python;
8. executar `git diff --check` e `git diff`.

## 11. Teste real no CLP

O primeiro teste real será somente leitura:

- máquina parada ou em condição segura;
- selecionar uma máquina já cadastrada;
- testar comunicação;
- conferir pressão, temperaturas e estado;
- não executar escrita ou comando de processo.

## 12. Critérios de aceite

- frontend React abre pelo `app.py`;
- dados exibidos vêm de `obter_estado()`;
- modo demonstração fica desativado no modo real;
- ausência do backend não produz dados falsos;
- falha de comunicação mantém os últimos dados e sinaliza desatualização;
- nenhuma escrita no CLP é realizada nesta etapa;
- backend antigo permanece recuperável pela branch de migração.

## 13. Rollback

Se a integração falhar:

```powershell
git restore .
git clean -fd
```

Antes de usar `git clean -fd`, revisar com:

```powershell
git clean -nd
```

A branch `migration/projeto-oraculum-local` e a `main` não devem ser alteradas durante esta implementação.
