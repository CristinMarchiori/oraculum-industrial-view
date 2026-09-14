# Oraculum Frontend V2 — conclusão da interface industrial

Construir a primeira versão navegável do Oraculum usando o HTML enviado como inventário funcional, sem copiar sua estrutura literalmente e sem integrar o backend Python nesta etapa.

## Direção visual

- Preservar a identidade industrial já iniciada: azul-petróleo, azul industrial, tipografia técnica, números monoespaçados, alta legibilidade e estados com significado operacional.
- Usar superfícies escuras na monitoração e nos gráficos; usar áreas mais claras e neutras em resultados, configuração e diagnóstico quando isso melhorar leitura e edição.
- Evitar aparência de painel genérico, excesso de cartões, gradientes decorativos e dados simulados apresentados como reais.
- Exibir permanentemente “MODO DE DEMONSTRAÇÃO — Dados simulados, sem conexão com o CLP”.
- Adaptar navegação, indicadores, comandos, gráficos e tabelas para desktop, notebook e tablets, sem largura mínima fixa.

## Estrutura e navegação

- Transformar a estrutura já iniciada em um layout comum com barra lateral recolhível, cabeçalho técnico, relógio, máquina confirmada e estados de comunicação/aquisição.
- Criar rotas reais para `/`, `/resultados`, `/resultados/$cycleId`, `/configuracao` e `/diagnostico`, todas com conteúdo completo e metadados próprios em português.
- Corrigir os textos provisórios em inglês e substituir a página inicial padrão pela monitoração.
- Em telas menores, converter o menu lateral em navegação compacta sem esconder comandos ou alertas críticos.

## Fluxo operacional e simulações

- Separar máquina escolhida de máquina confirmada: escolher mostra os dados básicos; confirmar executa uma operação simulada antes de liberar o início.
- Impedir início sem máquina confirmada, troca de máquina durante aquisição e edição de configuração enquanto a monitoração estiver ativa.
- Implementar iniciar, pausar/continuar e parar, com estados desabilitado, processando, concluído e falhou; parar uma aquisição ativa exige confirmação.
- Criar um seletor de cenários dentro de uma área explicitamente marcada como demonstração: sem máquina, Schneider, Rockwell, aguardando trigger, ciclo ativo, pausado, falha, concluído, salvamento parcial e temperatura não configurada.
- Manter últimos dados válidos quando uma falha simulada ocorrer e diferenciar backend indisponível de CLP desconectado.

## Tela de Monitoração

- Montar uma faixa operacional com pressão atual/programada, inércia, duração do ciclo, temperaturas programada/lidas, desvios, amostras e último resultado.
- Exibir estado da comunicação, monitoração, ciclo e trigger com texto e cor; usar `--` e estados vazios quando não houver valor.
- Criar abas Pressão e Temperatura no gráfico, com séries, limites, unidades, legenda alternável, cursor de leitura e estados sem dados.
- Preservar interação de instrumento: execução contínua simulada, pausa, reinício da visualização, zoom e deslocamento controlados.
- Mostrar listas dos períodos sob pressão e de alívio, além de mensagens operacionais e retorno de cada comando.

## Resultados e detalhes

- Criar histórico filtrável por máquina, data, situação e número do ciclo, com ordenação e estado vazio/erro/carregamento.
- Apresentar amostras, tempos e quantidades de períodos/alívios, resumo térmico, estado geral, CSV, PNG, arquivo-base e mensagem de salvamento.
- Abrir cada ciclo em rota própria com resumo, gráfico, tabelas de períodos e alívios, resumo térmico, arquivos ausentes e falha de carregamento.
- Usar somente dados simulados tipados, incluindo casos OK, alerta, falha e salvamento parcial.

## Configuração

- Organizar Comunicação, Controle do ciclo, Sinais de pressão e Sinais de temperatura em seções claras.
- Manter IP, protocolo e porta derivados da máquina bloqueados para edição direta; tratar Schneider e Rockwell sem presumir endereços iguais.
- Implementar alteração pendente, validação de configuração térmica parcial, descartar, salvar, testar comunicação e testar vetor, com retornos simulados.
- Bloquear toda edição quando a aquisição estiver ativa.

## Diagnóstico

- Exibir conexão, protocolo, máquina, registros esperados/recebidos, amostras, aquisição, geração de resultados, última atualização e último erro.
- Adicionar eventos com horário, origem, nível e mensagem, filtro por tipo e rolagem controlada.
- Representar conectado, desconectado, conectando, monitorando, parado, pausado, falha, indisponível e aguardando backend de forma consistente.

## Camada de dados e componentes

- Ajustar os tipos existentes aos contratos evidenciados no HTML: máquinas, monitoração, séries de pressão/temperatura, períodos, resultados, detalhes, configuração e diagnóstico.
- Evoluir a camada de dados iniciada para serviços separados de máquina, monitoração, resultados, configuração e diagnóstico; as telas não acessarão mocks diretamente.
- Mapear conceitualmente os métodos atuais (`obter_estado`, `listar_maquinas`, `selecionar_maquina`, `iniciar`, `pausar`, `parar`, testes, configuração e detalhes) para essa camada substituível.
- Centralizar a atualização simulada, impedir consultas concorrentes e limpar temporizadores ao sair da tela, deixando a troca futura por API/WebSocket isolada.
- Reaproveitar e completar os componentes existentes de painel, indicadores, estados e osciloscópio; adicionar seletor de máquina, barra de comandos, estados vazios, tabelas, filtros, períodos e feedback de ação.
- Remover dos mocks IPs/endereço industriais reais presentes na referência e usar valores de demonstração claramente fictícios.

## Validação

- Verificar navegação e todos os comandos/estados simulados no navegador.
- Conferir visualmente desktop e tablet em orientações horizontal e vertical, incluindo gráficos, tabelas, menus e textos longos.
- Validar foco por teclado, contraste, rótulos, unidades, formatação brasileira e mensagens que não dependam somente de cor.
- Confirmar que não há página vazia, rolagem horizontal indevida, sobreposição, erro no navegador ou link sem destino.

## Fora desta etapa

- Comunicação real com CLP, `window.pywebview`, API HTTP, WebSocket, backend Python, autenticação, banco de dados e escrita em equipamento.
