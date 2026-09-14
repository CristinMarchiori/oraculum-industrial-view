# Oraculum Industrial View

ORACULUM — FRONTEND V2

Contexto

Estamos desenvolvendo a versão 2 do frontend do Oraculum, uma aplicação industrial de monitoramento e aquisição de dados de máquinas/CLPs.

O projeto atual possui backend em Python e comunicação real com CLPs Schneider M340 via Modbus TCP. O objetivo deste projeto no Lovable é criar uma nova interface frontend profissional, moderna e industrial, que posteriormente será integrada ao backend existente.

Esta primeira etapa deve ser focada na experiência visual, arquitetura de telas e componentes frontend.

Não tente recriar o backend Python ou implementar comunicação real com PLC nesta etapa.

Objetivo

Criar o Oraculum Frontend V2, uma aplicação web desktop-first com aparência de software industrial profissional.

A interface deve transmitir:

confiabilidade;

precisão;

tecnologia;

ambiente industrial;

monitoramento em tempo real;

análise de dados;

facilidade de operação.

Evitar aparência de dashboard genérico de SaaS.

O sistema deve parecer um software industrial/SCADA moderno, mas com uma experiência visual mais sofisticada.

Identidade visual

Nome da aplicação:

ORACULUM

Subtítulo:

Industrial Monitoring & Analysis

Utilizar uma identidade visual baseada em:

fundo escuro;

azul profundo;

azul tecnológico;

tons neutros;

branco/cinza para textos;

cores de status utilizadas somente quando necessário.

A interface deve ter alto contraste e excelente legibilidade.

Evitar excesso de cores.

Estados importantes podem utilizar:

verde → operação normal;

amarelo → atenção;

vermelho → falha/alarme;

azul → informação/atividade.

Layout principal

Criar uma aplicação com layout permanente contendo:

Sidebar lateral

Menu principal:

Monitoração

Resultados

Configuração

Diagnóstico

A sidebar deve possuir:

logo/nome Oraculum;

ícones;

nome das funcionalidades;

indicação visual da página ativa;

possibilidade de recolher a sidebar.

Na parte inferior:

status da conexão;

usuário/sistema;

versão do software.

Header

Criar um header superior contendo:

nome da máquina atualmente selecionada;

protocolo de comunicação;

endereço IP;

indicador de conexão;

horário/data;

indicador geral de estado da máquina.

Exemplo:

Machine 01
SCHNEIDER M340
172.25.217.210
● Connected

Os dados acima devem ser tratados como dados mockados, apenas para demonstração visual.

Tela 1 — MONITORAÇÃO

Esta será a principal tela da aplicação.

Criar uma interface de monitoramento em tempo real.

Área superior — indicadores

Criar cards para:

Pressão atual

Exemplo:

182 bar

Mostrar também:

unidade;

indicador de tendência;

status.

Pressão programada

Exemplo:

200 bar

Tempo de pressão

Exemplo:

12.4 s

Tempo de alívio

Exemplo:

3.2 s

Temperaturas

Criar três indicadores:

Temperatura 1

Temperatura 2

Temperatura 3

Exemplo:

T1 → 42.5 °C
T2 → 44.1 °C
T3 → 43.7 °C

Osciloscópio

Esta é uma das partes mais importantes do Oraculum.

Criar um gráfico grande, profissional e semelhante à experiência de um osciloscópio industrial.

O gráfico deve permitir visualizar séries temporais.

Inicialmente utilizar dados simulados.

Exibir pelo menos:

Pressão;

Pressão programada;

Temperatura.

O gráfico deve possuir:

eixo X = tempo;

eixo Y = valor;

grid;

legenda;

cursor;

zoom;

pan;

controle RUN/PAUSE;

seleção de sinais;

indicação visual do estado da aquisição.

Criar controles:

RUN

PAUSE

ZOOM +

ZOOM -

RESET VIEW

O gráfico deve ser visualmente limpo e profissional.

Não utilizar gráficos excessivamente arredondados ou com aparência de aplicativo financeiro.

Trigger

Criar uma área de controle de trigger.

Exibir:

Trigger status;

Trigger source;

Trigger level;

Trigger time.

Exemplo:

Trigger: Armed
Source: Pressure
Level: 180 bar

Esses dados serão mockados nesta etapa.

Status da máquina

Criar uma área de status operacional.

Estados possíveis:

READY

RUNNING

PAUSED

WARNING

FAULT

DISCONNECTED

Utilizar um indicador visual extremamente claro.

Tela 2 — RESULTADOS

Criar uma página dedicada à análise dos ciclos registrados.

Criar uma tabela contendo:

ID do ciclo;

data/hora;

pressão máxima;

pressão programada;

tempo de pressão;

tempo de alívio;

temperatura máxima;

status.

Adicionar filtros:

período;

máquina;

status;

ID do ciclo.

Adicionar pesquisa.

Ao selecionar um ciclo, abrir uma visualização detalhada.

Detalhamento do ciclo

Criar uma tela/painel mostrando:

Informações do ciclo

ID;

início;

fim;

duração;

máquina;

operador.

Gráficos

Mostrar:

pressão × tempo;

pressão programada × tempo;

temperatura × tempo.

Indicadores

Mostrar:

pressão máxima;

pressão média;

tempo de pressão;

tempo de alívio;

temperatura máxima.

Criar também um status final:

CYCLE OK

ou

CYCLE WITH WARNING

Tela 3 — CONFIGURAÇÃO

Criar uma área de configuração organizada por categorias.

Comunicação

Campos:

IP do CLP;

protocolo;

porta;

timeout;

unidade Modbus.

Exemplo:

IP: 172.25.217.210
Protocol: Schneider M340
Port: 502

Aquisição

Configurações:

intervalo de aquisição;

quantidade de amostras;

modo de aquisição;

armazenamento de histórico.

Sinais

Criar uma tabela configurável:

SinalEndereçoTipoUnidadePressãoMW413UINTbarPressão ProgramadaMW3002UINTbarTemperatura 1MW409UINT°CTemperatura 2MW410UINT°CTemperatura 3MW411UINT°C

Esses valores são apenas exemplos visuais e não devem ser usados para comunicação real nesta etapa.

Tela 4 — DIAGNÓSTICO

Criar uma tela para diagnóstico do sistema.

Mostrar:

Comunicação

conexão com CLP;

latência;

última leitura;

quantidade de erros;

estado da conexão.

Aquisição

estado da thread de aquisição;

taxa de aquisição;

amostras recebidas;

amostras perdidas.

Sistema

versão;

backend;

frontend;

horário da última atualização.

Criar um painel de eventos/logs contendo:

timestamp;

tipo;

mensagem.

Exemplos:

INFO — PLC connected
INFO — Acquisition started
WARNING — Communication delay
ERROR — Read timeout

Arquitetura frontend

Utilizar:

React;

TypeScript;

componentes reutilizáveis;

arquitetura organizada;

Tailwind CSS ou solução equivalente;

biblioteca de componentes consistente;

gráficos apropriados para séries temporais.

Criar componentes reutilizáveis para:

cards;

status indicators;

tables;

charts;

buttons;

dialogs;

filters;

badges;

navigation;

machine selector.

Evitar código monolítico.

Dados mockados

Nesta primeira versão, utilizar dados simulados.

Criar uma camada separada para os dados mockados, para que posteriormente possamos substituir facilmente por uma API/backend real.

Não espalhar dados fictícios diretamente pelos componentes.

Preparar a arquitetura para futuramente receber:

Frontend React
       ↓
API / Backend Python
       ↓
Modbus TCP
       ↓
Schneider M340


Responsividade

O foco principal é utilização em:

computadores industriais;

notebooks;

monitores desktop.

Priorizar desktop.

Ainda assim, a interface deve funcionar adequadamente em resoluções menores.

Experiência do usuário

A interface deve ser extremamente clara para um operador industrial.

Priorizar:

informação importante;

estado da máquina;

alarmes;

valores atuais;

gráfico;

histórico;

diagnóstico.

Não criar elementos decorativos desnecessários.

A interface deve parecer uma ferramenta profissional de engenharia.

Importante

NÃO implementar nesta primeira etapa:

comunicação real com CLP;

Modbus TCP;

backend Python;

banco de dados;

autenticação real;

comandos reais para máquina;

escrita em registradores;

controle de equipamentos.

Tudo deve funcionar com dados mockados.

O objetivo desta primeira etapa é construir uma UI/UX completa e profissional do Oraculum Frontend V2, preparada para futura integração com o backend existente.

Antes de finalizar, garantir que:

todas as páginas estejam navegáveis;

todos os botões principais tenham comportamento visual;

gráficos funcionem com dados mockados;

filtros funcionem visualmente;

estados de conexão possam ser simulados;

a interface tenha consistência visual entre todas as telas;

não existam páginas vazias;

não existam componentes genéricos sem identidade visual.

O resultado deve parecer uma versão comercial/profissional de um software industrial de monitoramento, e não um template de dashboard.

Comece pela estrutura geral da aplicação e pela tela de Monitoração, que é a tela principal.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b1aa8197-157c-4528-9363-9550ba38b44f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
