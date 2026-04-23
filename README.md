# Front-end

Este repositório corresponde ao front-end do projeto Laboratório de Práticas 2026-1.

Ele é responsável pela interface do usuário, incluindo a Landing Page pública, o Portal do Cliente e o Painel Administrativo (CMS), consumindo a API fornecida pelo back-end.

---

## Links

### Aplicação (deploy)

| Branch    | URL       |
| --------- | --------- |
| `main`    | (definir) |
| `develop` | (definir) |

### API (Back-end)

| Ambiente  | URL                                                                     |
| --------- | ----------------------------------------------------------------------- |
| `main`    | https://backend-main-412027788376.southamerica-east1.run.app/swagger    |
| `develop` | https://backend-develop-412027788376.southamerica-east1.run.app/swagger |

---

# Guia de Contribuição

Este documento descreve o fluxo de trabalho adotado neste repositório. Siga as etapas abaixo para contribuir de forma organizada.

---

## Estrutura de Branches

```
main
└── develop
      ├── chore/
      └── release/entrega-DD-MM
              └── {issue}-{descricao}
```

---

## Passo a Passo

### 1. Encontre sua Issue

Acesse a aba **Issues** do repositório e filtre por `assignee:@me`.

---

### 2. Leia e analise a tarefa

Entenda completamente o escopo antes de iniciar o desenvolvimento.

---

### 3. Crie a branch pela própria Issue

No painel lateral da issue, clique em **"Create a branch"**.

---

### 4. Faça checkout da branch

```bash
git fetch origin
git checkout nome-da-branch
```

---

### 5. Desenvolva e commite

```bash
git add .
git commit -m "feat: descrição do que foi feito"
git push origin nome-da-branch
```

#### Padrão de commits

| Prefixo     | Uso                 |
| ----------- | ------------------- |
| `feat:`     | Nova funcionalidade |
| `fix:`      | Correção de bug     |
| `chore:`    | Tarefa técnica      |
| `docs:`     | Documentação        |
| `refactor:` | Refatoração         |
| `test:`     | Testes              |
| `ui:`       | Ajustes visuais     |

---

### 6. Abra o Pull Request

Configure:

| Campo       | Valor                       |
| ----------- | --------------------------- |
| **base**    | `release/entrega-DD-MM` |
| **compare** | sua branch                  |

**No PR:**

* Descreva o que foi feito
* Use `closes #numero`

**Review:**

* Solicite ao PO/PM

---

## Fluxo de Merges

```
sua branch → release → develop → main
```

> O merge entre níveis é responsabilidade do PO/PM.

---

## Regras Gerais

* Não fazer push direto em `main`, `develop`
* Todo merge via Pull Request
* Sempre trabalhar com issue vinculada
* Atualizar a branch antes de abrir PR

---

# Setup Local

## 1. Instale as dependências

```bash
npm install
```

---

## 2. Configure as variáveis de ambiente

Crie o arquivo .env a partir do .env.example.

Linux/macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure no .env:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

---

## 3. Execute o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

http://localhost:5173

---

## 4. Build e Preview

Build de produção:

```bash
npm run build
```

Preview local da build:

```bash
npm run preview
```

Observação: o preview depende da pasta dist gerada no build.

---

# Scripts

* npm run dev: servidor de desenvolvimento
* npm run build: TypeScript build + Vite build
* npm run preview: servidor local da pasta dist
* npm run lint: verificação de lint

---

# Tecnologias

* React 19
* TypeScript 5
* Vite 7
* React Router DOM 7
* Tailwind CSS 4
* Radix UI
* React Hook Form + Zod
* Leaflet + React Leaflet
* Socket.IO Client

---

# Estrutura de Pastas

```
src/
├── assets/         # Arquivos estáticos (imagens, ícones)
├── components/     # Componentes reutilizáveis
│   ├── admin/      # Componentes do CMS/admin
│   ├── chat/       # Componentes de chat
│   ├── layout/     # Layouts (Navbar, Sidebar, etc)
│   ├── sections/   # Seções das páginas
│   ├── tables/     # Tabelas de dados
│   └── ui/         # Componentes base
├── pages/          # Páginas (rotas)
│   ├── admin/
│   └── cliente/
├── services/       # Integração com API e socket
├── mocks/          # Dados de mock
├── lib/            # Utilitários
└── App.tsx         # Configuração de rotas
```

---

# Rotas

## Rotas Públicas

| Rota       | Descrição                |
| ---------- | ------------------------ |
| `/`        | Página inicial           |
| `/servicos`| Página de serviços       |
| `/blog`    | Listagem de artigos      |
| `/blog/:id`| Detalhe de artigo        |
| `/contato` | Página de contato        |

---

## Rotas do Cliente

| Rota                              | Descrição                          |
| --------------------------------- | ---------------------------------- |
| `/cliente`                        | Redireciona para solicitações      |
| `/cliente/solicitacoes`           | Solicitações do cliente            |
| `/cliente/solicitacoes/sucesso`   | Confirmação de solicitação         |
| `/cliente/solicitacoes/historico` | Histórico de solicitações          |
| `/cliente/solicitacoes/:id`       | Detalhes de uma solicitação        |

---

## Rotas Administrativas

| Rota                           | Descrição                       |
| ------------------------------ | ------------------------------- |
| `/admin`                       | Redireciona para posts          |
| `/admin/solicitacoes`          | Gestão de solicitações          |
| `/admin/solicitacoes/:id/editar` | Edição de solicitação        |
| `/admin/posts`                 | Listagem de posts               |
| `/admin/posts/novo`            | Criação de post                 |
| `/admin/posts/editar/:id`      | Edição de post                  |
| `/admin/carrossel`             | Listagem de banners             |
| `/admin/carrossel/novo`        | Criação de banner               |
| `/admin/carrossel/:id/editar`  | Edição de banner                |
| `/admin/publicidade`           | Listagem de publicidade         |
| `/admin/publicidade/novo`      | Criação de publicidade          |
| `/admin/publicidade/editar/:id`| Edição de publicidade           |

---

# Integração com Back-end

* Toda comunicação principal é feita via REST API
* As requisições estão centralizadas em src/services
* Upload de arquivos é feito com FormData
* Chat em tempo real usa Socket.IO

---

# Observações Gerais

* Defina VITE_API_URL e VITE_SOCKET_URL para evitar comportamento de fallback entre ambientes
* Algumas rotas ainda não possuem proteção de autenticação no front-end
* O front-end depende diretamente do back-end para os fluxos completos