# 🎬 API Catálogo de Filmes: CI/CD com Docker, GitHub Actions e Render

API REST para gerenciamento de um catálogo de filmes, construída com **Node.js, Express, TypeScript e PostgreSQL**. O projeto conta com uma esteira de **Integração e Entrega Contínua**: a cada push na branch `main`, o GitHub Actions valida o código, constrói a imagem Docker e, somente se tudo passar, dispara o deploy no **Render** por meio de um Deploy Hook.

Trabalho prático da disciplina **Integração e Entrega Contínua (IEC)**, atividade **AT2**.

## 🔗 Links

| Item | Endereço |
|---|---|
| API em produção | https://at2-entrega-continua-com-docker-github.onrender.com |
| Health check | https://at2-entrega-continua-com-docker-github.onrender.com/api/health |
| Documentação (Swagger) | https://at2-entrega-continua-com-docker-github.onrender.com/api-docs |
| Listagem de filmes | https://at2-entrega-continua-com-docker-github.onrender.com/api/filmes |
| Vídeo de demonstração | _COLE_AQUI_O_LINK_DO_VIDEO_ |

> ⏳ A API está no plano gratuito do Render, que "dorme" após um período sem requisições. A primeira chamada pode levar cerca de 50 segundos para responder.

---

## 🧰 Tecnologias

- **Node.js 24** e **Express 5**
- **TypeScript** (compilado para `dist/`)
- **PostgreSQL** com **Sequelize**
- **Swagger UI** para documentação
- **pnpm** como gerenciador de pacotes
- **ESLint** e **Prettier** para padronização
- **Husky** para validações antes do commit
- **Docker** e **Docker Compose**
- **GitHub Actions** para CI/CD
- **Render** para hospedagem (Web Service com runtime Docker)

---

## 📁 Estrutura do Projeto

```text
.
├── .github/workflows/
│   ├── ci.yml              # Validação em Pull Requests
│   └── deploy.yml          # Esteira de CI/CD (push na main)
├── .husky/
│   └── pre-commit          # Lint, formatação e tipos antes do commit
├── backend/
│   ├── src/
│   │   ├── config/         # Conexão com o banco (suporte a DB_SSL)
│   │   ├── controllers/    # Regras das rotas
│   │   ├── docs/           # swagger.json
│   │   ├── migrations/     # Migrations do Sequelize
│   │   ├── models/         # Modelos
│   │   ├── routes/         # Rotas (filmes e health check)
│   │   └── server.ts       # Entrada da aplicação
│   ├── .dockerignore
│   ├── Dockerfile          # Imagem de produção (multi-stage)
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml      # Ambiente local (API + PostgreSQL)
└── README.md
```

---

## 🔌 Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Verifica a integridade da aplicação |
| GET | `/api/filmes` | Lista todos os filmes |
| GET | `/api/filmes/:id` | Busca um filme pelo ID |
| POST | `/api/filmes` | Cadastra um filme |
| PUT | `/api/filmes/:id` | Atualiza um filme |
| DELETE | `/api/filmes/:id` | Remove um filme |
| GET | `/api-docs` | Documentação Swagger |

### Health check

```json
{
  "status": "ok",
  "service": "catalogo-filmes-api",
  "uptime": 120,
  "timestamp": "2026-11-22T19:01:43.403Z"
}
```

### Exemplo de cadastro de filme

```json
{
  "titulo": "Interestelar",
  "genero": "Ficcao",
  "ano_lancamento": 2014,
  "nota": 9.2,
  "disponibilidade_plataforma": true
}
```

Regras de validação: `titulo` e `genero` são obrigatórios, `ano_lancamento` deve ser maior ou igual a 1888, `nota` deve estar entre 0 e 10 e o título deve ser único (retorna `409` se já existir).

---

## ⚡ Como Executar Localmente

### Pré-requisitos

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v22 ou superior, recomendado v24)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ativo e rodando

### 1. Clonar o repositório

```bash
git clone https://github.com/gabrieelapl/AT2-Entrega-Continua-com-Docker-GitHub-Actions-e-Deploy-no-Render_IEC.git
cd AT2-Entrega-Continua-com-Docker-GitHub-Actions-e-Deploy-no-Render_IEC
```

### 2. Instalar dependências e ativar o Husky

Na raiz do repositório:

```bash
pnpm install
```

### 3. Subir a API e o banco com Docker Compose

```bash
docker compose up -d --build
```

Serviços iniciados:

- **API:** `http://localhost:3000`
- **PostgreSQL:** porta `5432`

As tabelas são criadas automaticamente na inicialização da API.

### 4. Testar

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/filmes
```

> 💡 **No PowerShell (Windows)** use `curl.exe` no lugar de `curl`, e escape as aspas do JSON com `\"`.

### 5. Encerrar

```bash
docker compose down        # para os contêineres
docker compose down -v     # para e remove também os dados do banco
```

### Solução de problemas

- **`port is already allocated` (5432):** outro PostgreSQL está usando a porta. Pare-o (`docker stop <nome>`) ou altere a porta exposta do serviço `db` no `docker-compose.yml` (por exemplo, `"5433:5432"`).
- **`container name is already in use`:** remova o contêiner antigo com `docker rm -f <nome>`.

### Executando sem Docker Compose (opcional)

Com um PostgreSQL próprio rodando:

```bash
cd backend
cp .env.example .env      # ajuste as credenciais
pnpm install
pnpm run dev
```

---

## 🔐 Variáveis de Ambiente

Exemplo em [`backend/.env.example`](backend/.env.example).

| Variável | Descrição | Exemplo |
|---|---|---|
| `PORT` | Porta do servidor (no Render é definida automaticamente) | `3000` |
| `NODE_ENV` | Ambiente de execução | `production` |
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_NAME` | Nome do banco | `catalogo_filmes` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | _(secreta)_ |
| `DB_SSL` | Ativa conexão SSL (`true` no Render) | `false` |

O servidor escuta `process.env.PORT || 3000`.

---

## 🧪 Qualidade de Código

Dentro da pasta `backend`:

```bash
pnpm run lint            # ESLint
pnpm run format:check    # verifica o Prettier
pnpm run format:fix      # corrige a formatação
pnpm run type-check      # tsc --noEmit
pnpm run build           # compila para dist/
pnpm run check-all       # lint + format:check
```

### Husky (pre-commit)

Antes de cada `git commit`, o Husky executa ESLint, Prettier e a checagem de tipos. Se alguma falhar, o commit é bloqueado.

### Padrão de commits

O projeto segue o [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `refactor:` e `style:`.

---

## 🐳 Docker

O arquivo [`backend/Dockerfile`](backend/Dockerfile) usa **build multi-stage** com imagem `node:24-alpine`:

1. **build:** instala todas as dependências e compila o TypeScript para `dist/`.
2. **deps:** instala somente as dependências de produção.
3. **production:** imagem final enxuta, com `dist/` e as dependências de produção, executando como usuário não-root.

Comando de inicialização:

```dockerfile
CMD ["node", "dist/server.js"]
```

O [`.dockerignore`](backend/.dockerignore) exclui `node_modules`, `.git`, `.env` e arquivos de teste do contexto de build.

Build manual:

```bash
docker build -t api-service:test ./backend
```

---

## 🚀 Pipeline de CI/CD

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), disparado em **push na branch `main`**.

```text
push na main
     │
     ▼
┌──────────────┐     ┌────────────────────┐     ┌──────────────────────┐
│ 1. CI        │ ──▶ │ 2. Docker build    │ ──▶ │ 3. Deploy (webhook)  │
│ lint, tipos, │     │ valida a imagem de │     │ curl POST no Deploy  │
│ build        │     │ produção           │     │ Hook do Render       │
└──────────────┘     └────────────────────┘     └──────────────────────┘
```

| Job | O que faz |
|---|---|
| **ci** | Checkout, instalação do pnpm e das dependências, ESLint, Prettier, `tsc --noEmit` e build |
| **docker-build** | `docker build` para atestar que o contêiner constrói sem falhas (depende do `ci`) |
| **deploy** | `curl -X POST` no Deploy Hook, validando o status HTTP (200 ou 201). Falha o pipeline em qualquer outro status (depende de `ci` e `docker-build`) |

O workflow [`ci.yml`](.github/workflows/ci.yml) roda apenas em Pull Requests, validando o código sem publicar nada.

### Segredo do GitHub

A URL do Deploy Hook fica guardada como secret, nunca no código:

| Secret | Descrição |
|---|---|
| `RENDER_DEPLOY_HOOK_URL` | URL do Deploy Hook gerada nas configurações do serviço no Render |

Para criar: **Settings → Secrets and variables → Actions → New repository secret**.

---

## ☁️ Configuração no Render

Web Service criado a partir deste repositório, com as seguintes configurações:

| Configuração | Valor |
|---|---|
| Runtime | Docker |
| Dockerfile Path | `./backend/Dockerfile` |
| Docker Build Context Directory | `./backend` |
| **Auto-Deploy** | **No** |
| Health Check Path | `/api/health` |

O **Auto-Deploy desativado** garante que commits no GitHub não publiquem nada diretamente: o deploy só acontece depois que a esteira do GitHub Actions é aprovada e chama o Deploy Hook.

Variáveis de ambiente configuradas no painel do Render:

`NODE_ENV=production`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` e `DB_SSL=true`.

O banco é um **PostgreSQL gerenciado do Render**. As tabelas são criadas automaticamente na inicialização da API.

---

## 🔄 Fluxo de Entrega Contínua

1. O desenvolvedor faz commit (validado pelo Husky) e push na `main`.
2. O GitHub Actions executa CI, build do Docker e, se tudo passar, chama o webhook.
3. O Render recebe o webhook, constrói a imagem e publica a nova versão.
4. O Render consulta `/api/health` para confirmar que a aplicação está saudável.

