# 🎬 API Catálogo de Filmes

API REST de catálogo de filmes (Node.js, Express, TypeScript e PostgreSQL) com CI/CD via GitHub Actions e deploy no Render.

**API em produção:** https://at2-entrega-continua-com-docker-github.onrender.com

- Health check: https://at2-entrega-continua-com-docker-github.onrender.com/api/health
- Documentação: https://at2-entrega-continua-com-docker-github.onrender.com/api-docs

> ⏳ No plano gratuito do Render a API "dorme" após inatividade. A primeira chamada pode levar cerca de 50 segundos.

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

> 💡 No PowerShell (Windows), use `curl.exe` no lugar de `curl`.

Outros endereços:

- Health check: `http://localhost:3000/api/health`
- Swagger: `http://localhost:3000/api-docs`
- Filmes: `http://localhost:3000/api/filmes`

### 5. Encerrar

```bash
docker compose down        # para os contêineres
docker compose down -v     # para e remove também os dados do banco
```

---

## 🛠️ Solução de Problemas

- **`port is already allocated` (5432):** outro PostgreSQL está usando a porta. Pare-o com `docker stop <nome>` ou altere a porta exposta do serviço `db` no `docker-compose.yml` (por exemplo, `"5433:5432"`).
- **`container name is already in use`:** remova o contêiner antigo com `docker rm -f <nome>`.

---

## 🧑‍💻 Executando sem Docker Compose (opcional)

Com um PostgreSQL próprio rodando:

```bash
cd backend
cp .env.example .env      # ajuste as credenciais
pnpm install
pnpm run dev
```

---

## 🧪 Validações de Código

Dentro da pasta `backend`:

```bash
pnpm run lint            # ESLint
pnpm run format:check    # verifica o Prettier
pnpm run format:fix      # corrige a formatação
pnpm run type-check      # checagem de tipos (tsc --noEmit)
pnpm run build           # compila para dist/
```

O **Husky** executa lint, formatação e checagem de tipos antes de cada commit.
