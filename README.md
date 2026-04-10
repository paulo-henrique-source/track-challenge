# Track Challenge

Base inicial do desafio de rastreamento de veiculo (Life Web), pronta para evolucao em proximos prompts.

## Stack

- Next.js 16.1 (App Router)
- TypeScript
- Tailwind CSS (v4)
- shadcn/ui
- Zustand
- React Query
- Zod

## Sessao Silenciosa

A aplicacao executa login automatico com:

```json
{
  "usuario": "codetest",
  "senha": "codetest"
}
```

Comportamento implementado:

- Cliente chama endpoint interno `/api/silent-session` (server-side).
- O servidor chama o backend real e protege credenciais fora do bundle do navegador.
- Persiste `jwtToken`, `vehicles` e `packageTypes` no Zustand (`persist`).
- No refresh, reaproveita estado persistido sem novo login quando o token ainda esta valido.
- Valida expiracao via claim `exp` do JWT.

Configure as variaveis em `.env.local`:

```bash
SILENT_SESSION_URL=https://seu-backend.com/login
SILENT_SESSION_USER=codetest
SILENT_SESSION_PASSWORD=codetest
```

## Scripts

- `npm run dev`: ambiente de desenvolvimento
- `npm run build`: build de producao
- `npm run start`: sobe o build
- `npm run lint`: lint do projeto
- `npm run typecheck`: checagem de tipos

## Estrutura Inicial

```txt
src/
  app/
  components/
    common/
    ui/
  constants/
  features/
  hooks/
  services/
  store/
  styles/
  types/
  utils/
```
