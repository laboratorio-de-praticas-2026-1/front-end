# Configuração do Ambiente

Esta página descreve como configurar o ambiente de desenvolvimento local para o front-end da aplicação Despachante Bortone.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

| Ferramenta | Versão mínima | Download |
|---|---|---|
| Node.js | 18.x (LTS) | [nodejs.org](https://nodejs.org) |
| npm | 9.x (incluído com Node.js) | — |
| Git | qualquer recente | [git-scm.com](https://git-scm.com) |

> **Dica:** Utilize o [nvm](https://github.com/nvm-sh/nvm) (Linux/Mac) ou [nvm-windows](https://github.com/coreybutler/nvm-windows) para gerenciar versões do Node.js com facilidade.

---

## Clonando o repositório

```bash
git clone https://github.com/laboratorio-de-praticas-2026-1/front-end.git
cd front-end
```

---

## Instalando as dependências

```bash
npm install
```

Isso instalará todas as dependências listadas em `package.json`, incluindo React, Vite, Tailwind CSS, shadcn/ui, Radix UI, Socket.IO Client, entre outras.

---

## Variáveis de ambiente

O projeto usa variáveis de ambiente com o prefixo `VITE_` (expostas pelo Vite em tempo de build).

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Edite o `.env` conforme o ambiente desejado:

```dotenv
# --- Ambiente LOCAL ---
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000

# --- Ambiente de PRODUÇÃO (main) ---
# VITE_API_URL=https://backend-main-412027788376.southamerica-east1.run.app
# VITE_SOCKET_URL=https://backend-main-412027788376.southamerica-east1.run.app

# --- Release atual ---
# VITE_API_URL=https://backend-release-entrega-23-04-412027788376.southamerica-east1.run.app
# VITE_SOCKET_URL=https://backend-release-entrega-23-04-412027788376.southamerica-east1.run.app
```

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API REST do back-end |
| `VITE_SOCKET_URL` | URL do servidor Socket.IO para o chat em tempo real |

> **Atenção:** Variáveis sem o prefixo `VITE_` **não** ficam disponíveis no browser. Nunca exponha segredos sensíveis em variáveis `VITE_`.

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite com HMR |
| `npm run build` | Compila TypeScript e gera o bundle de produção em `dist/` |
| `npm run preview` | Serve o bundle de produção localmente para validação |
| `npm run lint` | Executa o ESLint em todos os arquivos do projeto |

### Desenvolvimento

```bash
npm run dev
# Acesse http://localhost:5173
```

### Build de produção

```bash
npm run build
# Arquivos gerados em dist/
```

### Preview do build

```bash
npm run build
npm run preview
# Serve o dist/ em http://localhost:4173
```

---

## Alias de importação

O projeto usa o alias `@` mapeado para `./src/`, configurado em `vite.config.ts` e `tsconfig.app.json`. Isso permite importações como:

```typescript
import { ClienteLayout } from "@/components/layout/ClienteLayout";
import { blogService } from "@/services/blogService";
```

---

## Executando com Docker

O repositório contém um `Dockerfile` e um `nginx.conf` para execução em container. Para rodar localmente via Docker:

```bash
docker build -t bortone-frontend .
docker run -p 80:80 bortone-frontend
# Acesse http://localhost
```

> O Dockerfile realiza um build multi-stage: compila o projeto e serve os estáticos com Nginx.
