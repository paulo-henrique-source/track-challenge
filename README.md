# Desafio: Rastreamento de Veiculo (Life Web)

Projeto desenvolvido em pagina unica para consulta e visualizacao de trajetos de veiculos, com foco em UX e performance de renderizacao.

## Objetivo do desafio

Construir uma interface funcional para:

- autenticar via sessao silenciosa
- filtrar historico de veiculo
- visualizar rota no mapa
- exibir dados brutos em tabela ordenavel/performatica
- analisar percentual do campo `estado` (aberto/fechado)

## Stack

### Obrigatoria

- Core: Next.js (App Router)
- Estilizacao: Tailwind CSS
- Estado global/persistencia: Zustand
- Componentes: shadcn/ui + Base UI primitives

### Bibliotecas utilizadas

- React Query (server state)
- Zod (validacao de payload/response)
- OpenLayers (mapa, markers, popups e polylines)
- date-fns (datas)
- React Toastify (feedback de erro)
- Lucide React (icones)
- tw-animate-css (motion/transicoes)

## Requisitos funcionais (status)

### 1) Sessao silenciosa

Implementado.

Fluxo:

1. Cliente chama `POST /api/silent-session`.
2. A rota server-side chama `SILENT_SESSION_URL` com:
   - `usuario`
   - `senha`
3. Backend retorna token + veiculos + tipos de pacote.
4. Aplicacao normaliza resposta, extrai `exp` do JWT e persiste no Zustand.
5. No refresh, a store e reidratada e o login nao e disparado novamente quando o token ainda e valido.
6. Token expirado invalida sessao local e exige nova autenticacao silenciosa.

Arquivos principais:

- `src/app/api/silent-session/route.ts`
- `src/utils/silentSession.ts`
- `src/store/sessionStore.ts`
- `src/hooks/useSilentSessionInitializer.ts`

### 2) Dashboard - Filtros de busca

Implementado.

- Dropdown de veiculo (single select, obrigatorio)
- Dropdown de tipos de pacote (multi select)
- Datepicker inicio/fim
- Validacao de intervalo maximo de 48h
- Botao de busca para `POST /api/history`
- Quando nenhum tipo de pacote e selecionado, envia string vazia (`""`), conforme regra do desafio

Arquivos principais:

- `src/components/common/trackingDashboard/dashboardFilters.tsx`
- `src/hooks/useTrackingDashboard.ts`
- `src/app/api/history/route.ts`

### 3) Dashboard - Visualizacao do historico no mapa

Implementado.

- Mapa com OpenStreetMap renderizado com OpenLayers
- Desenho de rota com polylines
- Marker customizado de inicio (A) e fim (B)
- Popup nos markers com data/hora e condutor
- Animacao da rota

Arquivos principais:

- `src/components/common/trackingDashboard/historyMap.tsx`
- `src/hooks/historyMap/*`

### 4) Dashboard - Visualizacao de dados brutos

Implementado.

- Tabela com TanStack Table + componentes shadcn
- Ordenacao por colunas
- Busca textual
- Paginacao
- Seletor de colunas visiveis (Columns)
- Controle de linhas por pagina

Arquivo principal:

- `src/components/common/trackingDashboard/historyDataTable.tsx`

### 5) Analise de dados (`estado`)

Implementado.

- Grafico de distribuicao percentual (aberto, fechado, outros)
- Exibicao percentual e contagem absoluta

Arquivo principal:

- `src/components/common/trackingDashboard/historyStateAnalysis.tsx`

### Motion / Animacoes de UI

Implementado.

- Transicoes de entrada nas secoes principais do dashboard
- Feedback visual de hover com transicao de borda para `--brand`
- Animacoes utilitarias com classes Tailwind + `tw-animate-css`

### Endpoints internos

- `POST /api/silent-session`
- `POST /api/history`

As credenciais ficam no server (`.env.local`), nao no client.
As URLs possuem fallback automatico para os endpoints oficiais da Life Web.

## Variaveis de ambiente

Use `.env.example` como base e crie `.env.local`.

Obrigatorias:

```bash
SILENT_SESSION_USER=codetest
SILENT_SESSION_PASSWORD=codetest
```

Opcionais (override de endpoint):

```bash
# SILENT_SESSION_URL=https://lifegestaodefrota.com.br/lifeweb/api/login
# HISTORY_URL=https://lifegestaodefrota.com.br/lifeweb/api/historico
```

## Como executar

```bash
npm install
npm run dev
```

Aplicacao em desenvolvimento:

- `http://localhost:3000`

## Scripts

- `npm run dev` - ambiente local
- `npm run build` - build de producao
- `npm run start` - executa build
- `npm run lint` - lint
- `npm run typecheck` - checagem de tipos

## Estrutura de pastas

```txt
src/
  app/
  components/
    common/
    ui/
  consts/
  hooks/
    historyMap/
  schemas/
  services/
  store/
  styles/
  types/
  utils/
```

## O que sera avaliado (resumo)

- Organizacao e estrutura de codigo
- UX
- Performance
- Dominio das stacks utilizadas
- Tratamento de erros e dados

## Entrega

- Codigo-fonte (repositorio publico): [preencher-url]
- Live demo (Vercel ou similar): [preencher-url]

## Pergunta do desafio

Em quantas horas voce acredita que conseguiu realizar esse desafio?

- Resposta: [preencher-estimativa-em-horas]
