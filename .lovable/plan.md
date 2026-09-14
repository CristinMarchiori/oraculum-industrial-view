# Refinamento operacional e padronização do Oraculum

Refinar somente o frontend e os dados simulados. O backend Python, a comunicação com CLPs e integrações reais permanecerão inalterados.

## Idioma da interface

- Traduzir todos os textos visíveis para português do Brasil: navegação, subtítulos, estados, mensagens, filtros, eventos, páginas de erro e identificação do operador.
- Manter identificadores técnicos internos em inglês quando necessário para preservar contratos e lógica, mas nunca exibi-los diretamente.
- Centralizar rótulos de estado para apresentar, entre outros: `MONITORANDO`, `PRONTA`, `PAUSADA`, `ATENÇÃO`, `FALHA` e `DESCONECTADA`.
- Substituir textos como “Live”, “Cycles”, “Setup”, “Health”, nomes de máquinas/linhas e mensagens simuladas em inglês.

## Estados de máquina e comandos

- Derivar um único conjunto de permissões visuais a partir de máquina confirmada, seleção pendente, monitoração, conexão e operação em andamento.
- Sem máquina confirmada: bloquear iniciar, pausar, parar e toda a configuração operacional.
- Com máquina confirmada e aquisição parada: liberar seleção; liberar confirmação apenas quando a seleção pendente for diferente da máquina confirmada; liberar somente iniciar.
- Durante aquisição: bloquear seleção, confirmação e configuração; liberar pausar e parar; bloquear iniciar.
- Durante pausa: trocar “Pausar” por “Continuar”; manter parar liberado e troca de máquina/configuração bloqueadas.
- Em falha: conservar o último conjunto de amostras, marcar dados como desatualizados, bloquear comandos incompatíveis e só apresentar êxito após retorno positivo do serviço simulado.
- Remover combinações contraditórias entre estado da máquina, conexão, texto operacional e botões.

## Unidade de pressão por máquina

- Adicionar `PressureUnit = "bar" | "kgf/cm²"` e `pressureUnit` ao contrato tipado de máquina.
- Definir a unidade em cada máquina simulada e propagá-la para monitoração, gráficos, histórico e detalhe do ciclo.
- Remover unidades `bar` fixas dos componentes e permitir que o osciloscópio receba a unidade da máquina selecionada.
- Manter valores simulados atuais, alterando somente sua unidade contextual nesta etapa.

## Validação

- Verificar os cenários sem máquina, parada, monitoração ativa, pausada e falha.
- Conferir que todos os controles habilitados/desabilitados correspondem ao estado apresentado.
- Auditar textos visíveis e ocorrências de unidade fixa.
- Validar tipos, navegação e apresentação no navegador sem erros.
