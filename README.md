# Desafio Frontend Happmobi — Aplicação de Reserva de Veículos

## Resumo

Este projeto é a entrega do desafio técnico para a vaga de Desenvolvedor Front End. A aplicação permite cadastro/login de usuários, listagem e CRUD de veículos (pelo painel Central), busca e filtragem, reservas de veículos e gerenciamento de agendamentos (cancelar/finalizar). O backend é um mock (json-server) usado apenas para demonstrar o fluxo.

## Status (escopo Frontend)

- Autenticação: tela de login (token simulado e salvo em localStorage).
- Usuários: cadastro (`/criar-conta`), edição e remoção (`/perfil`).
- Veículos: CRUD pelo painel `Central` (criar, editar, deletar, listar).
- Reservas: reservar veículo (Início e Filtro), listar agendamentos do usuário, cancelar/finalizar reserva.
- Regras de negócio implementadas no frontend:
  - Um veículo não pode ser reservado se já estiver reservado (checagem via `GET /reservas`).
  - Um usuário não pode ter mais de uma reserva ativa simultaneamente (checagem via `GET /reservas?usuarioId=...`).

## Tecnologias utilizadas

- Framework: Angular 18 (standalone components, RxJS)
- Estilização: Tailwind CSS
- Bundler / CLI: Angular CLI
- Mock backend: json-server (db.json)
- Ferramentas de desenvolvimento: Node.js, npm
- Testes E2E: Cypress

## Como rodar localmente

Pré-requisitos: Node.js e npm.

1. Instalar dependências:

```bash
npm install --legacy-peer-deps
```

2. Iniciar frontend (Angular dev server):

```bash
npm run start
```

3. Iniciar mock backend (json-server) — em outra aba/terminal:

```bash
# instalar json-server (se necessário)
npm install --save-dev json-server

# rodar json-server (usa db.json na raiz do projeto)
npx json-server --watch db.json --port 3000
```

### Executar testes E2E (Cypress)

Certifique-se que o frontend e o mock backend estejam em execução (conforme passos acima). Em seguida, abra o Cypress em modo interativo para depuração ou rode em modo headless para CI.

Modo interativo (UI):

```bash
npm run cypress:open
```

Modo headless (execução automática):

```bash
npm run cypress:run --spec "cypress/e2e/fluxos-usuario.spec.ts"
```

Observações:

- Os testes usam `cypress/e2e/fluxos-usuario.spec.ts` e stubs para endpoints `GET /carros`, `GET /usuarios` e `/reservas`.
- Se o seu backend mock estiver em outra porta, passe `--config baseUrl=http://localhost:PORT` ao abrir/rodar o Cypress.

## Endpoints consumidos (mock)

Base: `http://localhost:3000`

- Veículos
  - `GET /carros` — lista todos os veículos
  - `GET /carros/:id` — obter um veículo
  - `POST /carros` — criar veículo (payload: `{ name, year, type, engine, size, imageUrl? }`)
  - `PUT /carros/:id` — atualizar veículo
  - `DELETE /carros/:id` — deletar veículo

- Usuários
  - `GET /usuarios?email=<>&senha=<>` — buscar usuário por email+senha (login)
  - `POST /usuarios` — criar usuário (payload: `{ nome, dataNascimento?, email, senha, imagemUrl? }`)
  - `PUT /usuarios/:id` — atualizar usuário
  - `DELETE /usuarios/:id` — deletar usuário

- Reservas
  - `GET /reservas` — listar todas as reservas
  - `GET /reservas?usuarioId=<id>` — listar reservas por usuário
  - `POST /reservas` — criar reserva (payload: `{ usuarioId, carroId }`)
  - `DELETE /reservas/:id` — cancelar/finalizar reserva

## Observações sobre autenticação

- A autenticação é simulada: ao efetuar login a aplicação gera um token _fake_ e o salva em `localStorage` (chaves: `app_token`, `app_user`). O `AuthGuard` usa a presença desse token para proteger rotas no cliente.
- Nota: o json-server não valida tokens. Em um ambiente real o backend deveria validar o JWT em cada requisição.

## Principais arquivos/locais importantes

- Rotas e guardas: `src/app/app.routes.ts`, `src/app/guards/auth.guard.ts`
- Serviços:
  - `src/app/services/carro.service.ts` — API de veículos
  - `src/app/services/usuario.service.ts` — API de usuários
  - `src/app/services/reserva.service.ts` — API de reservas
  - `src/app/services/autenticacao.service.ts` — simula sessão (token em localStorage)
- Páginas principais:
  - `src/app/pages/login` — login
  - `src/app/pages/criar-conta` — cadastro
  - `src/app/pages/inicio` — busca e últimas reservas
  - `src/app/pages/filtro` — filtros e reserva por resultados
  - `src/app/pages/central` — CRUD veículos
  - `src/app/pages/agendamentos` — listar e gerenciar reservas do usuário

## Limitações conhecidas

- O mock backend (`json-server`) não implementa validação de token nem regras transacionais: portanto a proteção e regras são aplicadas no frontend para demonstração, mas idealmente devem existir verificações e bloqueios no backend.
- Armazenamento do token no `localStorage` é apenas para demonstração; em produção recomenda-se uso de cookie HttpOnly ou políticas de segurança adicionais.

## Fluxo rápido para testar manualmente

1. `npm run start` (frontend) e `npx json-server --watch db.json --port 3000` (backend mock).
2. Acesse `http://localhost:4200`.
3. Crie uma conta em `Criar Conta`, faça login.
4. Em `Central` (rota protegida) adicione/edite/exclua veículos.
5. Em `Início` ou `Filtro`, pesquise/reserve um veículo. Confirme na tela de Agendamentos.
6. Finalize/cancele uma reserva e observe que o histórico de "Últimas reservas" é mantido (implementação no frontend).



