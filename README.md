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

- `src/components/common/trackingDashboard/dashboardFilters/dashboardFilters.tsx`
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

- `src/components/common/trackingDashboard/historyMap/historyMap.tsx`
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

- `src/components/common/trackingDashboard/historyDataTable/historyDataTable.tsx`

### 5) Analise de dados (`estado`)

Implementado.

- Grafico de distribuicao percentual (aberto, fechado, outros)
- Exibicao percentual e contagem absoluta

Arquivo principal:

- `src/components/common/trackingDashboard/historyStateAnalysis/historyStateAnalysis.tsx`

### Motion / Animacoes de UI

Implementado.

- Transicoes de entrada nas secoes principais do dashboard
- Feedback visual de hover com transicao de borda para `--brand`
- Animacoes utilitarias com classes Tailwind + `tw-animate-css`

## Performance (Lighthouse)

Para medir corretamente, execute em **producao**:

```bash
yarn build
yarn start
```

Depois rode o Lighthouse em `http://localhost:3000` (mobile e desktop).

Motivo: `yarn dev` inclui overhead de desenvolvimento (HMR, sourcemaps, instrumentacao) e tende a distorcer score, principalmente em Performance.

### Otimizacoes aplicadas

- Mapa carregado com `dynamic import` (`ssr: false`) para reduzir custo no bundle inicial
- Tabela com paginacao e renderizacao controlada para evitar custo excessivo no main thread
- Separacao de estado de servidor com React Query para evitar requisicoes desnecessarias
- Regras de validacao no client antes de chamar API (evita round-trip de erro)
- Persistencia de sessao com Zustand (`persist`) para evitar login silencioso repetido em refresh quando token segue valido

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
yarn install
yarn dev
```

Aplicacao em desenvolvimento:

- `http://localhost:3000`

## Scripts

- `yarn dev` - ambiente local
- `yarn build` - build de producao
- `yarn start` - executa build
- `yarn lint` - lint
- `yarn typecheck` - checagem de tipos

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

## Entrega

- Codigo-fonte: https://github.com/paulo-henrique-source/track-challenge
- Live demo: https://track-challenge.vercel.app

## Pergunta do desafio

Em quantas horas voce acredita que conseguiu realizar esse desafio?

- Resposta: Aproximadamente 8 horas de implementação efetiva de código.

### Perguntas sobre uso de IA

1. Em quais partes do codigo a IA foi fundamental para acelerar o desenvolvimento?

- Resposta: A IA foi mais útil para acelerar tarefas operacionais e repetitivas: refactors de organização (estrutura de pastas e imports), criação de testes base para componentes/hooks, padronização de i18n e revisão rápida de consistência entre telas. Também ajudou a transformar ideias em implementação mais rápido, especialmente em partes de UI e cobertura de testes. As decisões de arquitetura (fluxo de sessão silenciosa com persistência, separação client/server via rotas internas, estratégia de performance no carregamento do dashboard) eu conduzi manualmente.

2. Houve algum momento em que a IA sugeriu uma abordagem que voce considerou errada ou subotima? Como resolveu?

- Resposta: Sim. Um exemplo claro foi quando esbarrei em problema de hydration: a sugestão inicial da IA foi colocar praticamente toda a page em client-side para eliminar o mismatch. Eu considerei essa abordagem subótima, porque sacrifica SSR e pode piorar performance/arquitetura. Em vez disso, corrigi de forma pontual: estabilizei IDs/estado entre server e client, mantive SSR onde fazia sentido e usei `dynamic import` apenas para partes realmente pesadas e naturalmente client-side (como o mapa). Assim resolvi o problema sem transformar toda a página em client component.

3. Como voce estruturou o prompt para garantir que a IA respeitasse as regras de estilização do Tailwind?

- Resposta: Estruturei os prompts com contexto + restrições explícitas + critério de aceite. Formato: contexto do arquivo/componente e objetivo exato; regras visuais (usar classes Tailwind existentes, manter tokens/variáveis, sem inventar design fora do padrão atual); limites técnicos (não alterar API pública, evitar regressão, manter acessibilidade); checklist final (rodar typecheck/testes e garantir comportamento igual). Esse padrão reduz saída genérica e força a IA a seguir o design system e a implementação já existente.
