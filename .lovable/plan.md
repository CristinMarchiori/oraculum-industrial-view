# Refinamento visual do modo de demonstração

## Objetivo
Melhorar a primeira impressão e a leitura operacional do Oraculum V2, mantendo a arquitetura atual de dados simulados e sem comunicação real com CLP.

## Alterações
- Iniciar a aplicação com a Máquina 01 confirmada e um “Ciclo normal” em execução, com leituras realistas e gráfico ativo.
- Reorganizar a tela de Monitoração para manter o osciloscópio de pressão, seus controles e o estado principal na primeira dobra; preservar seleção, comandos e demais medições logo abaixo.
- Simplificar o seletor de cenários para incluir claramente Ciclo normal, Ciclo com atenção e Falha/máquina desconectada, além dos cenários operacionais úteis já existentes.
- Mapear cada cenário para um único estado geral coerente: PRONTA, MONITORANDO, PAUSADA, ATENÇÃO, FALHA ou DESCONECTADA.
- Exibir apenas esse estado geral no cabeçalho e mover conexão, aquisição e informações auxiliares para Diagnóstico.
- Padronizar a coluna de pressão dos Resultados em bar, convertendo valores originados em kgf/cm² antes da exibição.
- Trocar “REGISTROS FORM[0]” por um rótulo claro para operadores.

## Validação
- Conferir visualmente a Monitoração em 1203×674 e em desktop amplo, garantindo o gráfico na primeira dobra.
- Verificar os três cenários e suas cores verde, amarela e vermelha.
- Conferir a tabela de Resultados e o painel de Diagnóstico.
- Validar tipos e atualizar a lista de tarefas do projeto.

## Limites
- Nenhuma mudança na integração futura, no backend Python ou em comunicação Modbus/CLP.
- Os dados continuam locais, determinísticos e explicitamente identificados como demonstração.
