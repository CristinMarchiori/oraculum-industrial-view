# Redesign profissional do Oraculum HTML

## Objetivo
Transformar o HTML funcional existente em uma interface industrial coesa, densa e legível, mantendo integralmente o backend Python e os contratos `window.pywebview.api`.

## Implementação
1. **Consolidar a base do HTML**
   - Reorganizar HTML, CSS e JavaScript sem as camadas incrementais `ALT31`, `ALT32` etc.
   - Preservar IDs, comandos, polling de 250 ms, bloqueios e formatos esperados pelo Python.
   - Manter as quatro áreas: Monitoração, Resultados, Configuração e Diagnóstico.

2. **Redesenhar o shell industrial**
   - Sidebar compacta permanente e cabeçalho técnico com conexão, máquina, protocolo e horário.
   - Paleta azul-petróleo/grafite com cores semânticas para normal, atenção e falha.
   - Tipografia técnica, números monoespaçados, bordas discretas e poucos arredondamentos.

3. **Priorizar a Monitoração**
   - Organizar seleção da máquina, controle da aquisição e estado operacional sem contradições.
   - Exibir todos os sinais importantes em indicadores compactos.
   - Tornar o osciloscópio dominante, com abas Pressão/Temperatura, grid, legenda, cursor e reset.
   - Preservar períodos, alívios e estado técnico da máquina em segundo nível visual.

4. **Refinar análise e manutenção**
   - Resultados em tabela profissional com filtros e ação de detalhes.
   - Detalhes do ciclo com resumo, gráfico salvo, períodos, alívios e resumo térmico.
   - Configuração separada por comunicação, ciclo, pressão e temperatura, com bloqueio explícito.
   - Diagnóstico concentrando comunicação, backend, amostras, frequência, erros e eventos disponíveis.

5. **Validar funcionamento real**
   - Verificar chamadas para `obter_estado`, `iniciar`, `pausar`, `parar`, `testar_comunicacao`, `testar_form`, `obter_configuracao`, `salvar_configuracao`, `listar_maquinas`, `selecionar_maquina` e `obter_detalhes_ciclo`.
   - Testar navegação, estados dos comandos e layouts em 1920×1080, 1600×900 e 1366×768.
   - Usar demonstração apenas como fallback visual fora do pywebview, sem substituir dados reais quando o backend estiver presente.

## Limites
- Nenhuma alteração no backend Python, Modbus, banco, autenticação ou serviços externos.
- Nenhum mock estático substitui funcionalidades ou respostas reais.
- O HTML continuará utilizável dentro do pywebview atual.
