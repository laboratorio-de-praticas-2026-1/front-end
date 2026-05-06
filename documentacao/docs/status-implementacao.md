# Status de Implementação

Panorama do estado atual de cada módulo, página e funcionalidade do front-end da aplicação Despachante Bortone.

> **Legenda:** ✅ Implementado | 🚧 Em desenvolvimento / parcial | ❌ Não iniciado

---

## Site Público

| Módulo / Página | Status | Observação |
|---|---|---|
| Landing Page (`/`) | ✅ Implementado | Carrossel de banners, seções institucionais |
| Página de Serviços (`/servicos`) | ✅ Implementado | Lista serviços disponíveis |
| Blog — Listagem (`/blog`) | ✅ Implementado | Consome `/blog` da API |
| Blog — Artigo (`/blog/:id`) | ✅ Implementado | Leitura de post individual |
| Contato (`/contato`) | 🚧 Em desenvolvimento | Estrutura básica presente |
| FAQ / Dúvidas (`/duvidas`) | 🚧 Em desenvolvimento | Interface pronta; backend pendente |
| Sobre Nós (`/SobreNos`) | 🚧 Em desenvolvimento | Estrutura básica presente |
| Mapa (`/mapa`) | ✅ Implementado | Mapa Leaflet interativo |
| Login (`/login`) | ✅ Implementado | Autenticação com JWT |
| Cadastro (`/cadastro`) | ✅ Implementado | Formulário com validação Zod |

---

## Portal do Cliente

| Módulo / Página | Status | Observação |
|---|---|---|
| Layout + Sidebar do cliente | ✅ Implementado | Proteção de rota + navegação |
| Dashboard inicial (`/cliente/inicio`) | ✅ Implementado | Resumo do cliente logado |
| Solicitações — Lista (`/cliente/solicitacoes`) | ✅ Implementado | Lista com filtros |
| Solicitações — Criar nova | ✅ Implementado | Formulário + seleção de serviço/veículo |
| Solicitações — Sucesso (`/solicitacoes/sucesso`) | ✅ Implementado | Confirmação pós-criação |
| Solicitações — Histórico | ✅ Implementado | Histórico com paginação |
| Solicitações — Detalhes (`/solicitacoes/:id`) | ✅ Implementado | Upload de documentos |
| Meus Veículos — Lista | ✅ Implementado | Lista veículos do cliente |
| Meus Veículos — Detalhes (`/:id`) | ✅ Implementado | Detalhes do veículo |
| Débitos (`/cliente/debitos`) | 🚧 Em desenvolvimento | Estrutura presente; integração com API pendente |
| Chat em tempo real | 🚧 Em desenvolvimento | Socket.IO conectado; UI em construção |

---

## Painel Administrativo

### Gestão de Solicitações

| Módulo / Página | Status | Observação |
|---|---|---|
| Listagem de solicitações | ✅ Implementado | Filtros por status, data, busca |
| Editar solicitação | ✅ Implementado | Status, observações, upload de documentos |

### Dashboard Analytics

| Módulo / Página | Status | Observação |
|---|---|---|
| Dashboard — Geral | ✅ Implementado | KPIs principais |
| Dashboard — Solicitações | ✅ Implementado | Gráficos Recharts |
| Dashboard — Veículos | ✅ Implementado | Gráficos Recharts |
| Dashboard — Serviços | ✅ Implementado | Gráficos Recharts |
| Dashboard — Documentos | ✅ Implementado | Gráficos Recharts |
| Dashboard — Financeiro | ✅ Implementado | Gráficos Recharts |
| Dashboard — Clientes | ✅ Implementado | Gráficos Recharts |

### CMS de Conteúdo

| Módulo / Página | Status | Observação |
|---|---|---|
| Blog — Listagem (admin) | ✅ Implementado | Tabela com ações CRUD |
| Blog — Criar post | ✅ Implementado | Editor com upload de imagem |
| Blog — Editar post | ✅ Implementado | — |
| Blog — Excluir post | ✅ Implementado | — |
| Carrossel — Listagem | ✅ Implementado | — |
| Carrossel — Criar banner | ✅ Implementado | Upload de imagem |
| Carrossel — Editar banner | ✅ Implementado | — |
| Publicidade — Listagem | ✅ Implementado | — |
| Publicidade — Criar | ✅ Implementado | — |
| Publicidade — Editar | ✅ Implementado | — |

### FAQ Admin

| Módulo / Página | Status | Observação |
|---|---|---|
| FAQ — Listagem | 🚧 Em desenvolvimento | Interface pronta; usando dados mock |
| FAQ — Criar | 🚧 Em desenvolvimento | Interface pronta; integração API pendente |
| FAQ — Editar | 🚧 Em desenvolvimento | Interface pronta; integração API pendente |
| FAQ — Excluir | 🚧 Em desenvolvimento | Funciona via mock; API pendente |

### Empresas

| Módulo / Página | Status | Observação |
|---|---|---|
| Empresas — Listagem | ✅ Implementado | — |
| Empresas — Criar | ✅ Implementado | — |
| Empresas — Editar | ✅ Implementado | — |

### Relatórios

| Módulo / Página | Status | Observação |
|---|---|---|
| Relatórios — Listagem | 🚧 Em desenvolvimento | Estrutura presente |
| Relatórios — Criar | 🚧 Em desenvolvimento | Formulário básico |

### Usuários

| Módulo / Página | Status | Observação |
|---|---|---|
| Usuários — Listagem | ✅ Implementado | — |
| Usuários — Criar | ✅ Implementado | — |
| Usuários — Editar | ✅ Implementado | — |
| Usuários — Excluir | ✅ Implementado | — |

---

## Integrações e infraestrutura

| Item | Status | Observação |
|---|---|---|
| Integração API REST (fetch) | ✅ Implementado | Maioria dos endpoints cobertos |
| Autenticação JWT | ✅ Implementado | Token em `localStorage` |
| Proteção de rotas | ✅ Implementado | `ClienteLayout` e `AdminLayout` |
| Socket.IO — Chat | 🚧 Em desenvolvimento | Conexão OK; UI incompleta |
| FAQ — integração back-end | ❌ Não iniciado | Usando mock; endpoint aguardando back-end |
| Débitos — integração back-end | 🚧 Em desenvolvimento | Estrutura criada; API pendente |
| Docker / Nginx | ✅ Implementado | Dockerfile multi-stage pronto |
| CI/CD Google Cloud Build | ✅ Implementado | `cloudbuild.yaml` configurado |
| Deploy GitHub Pages (docs) | ❌ Não iniciado | Pendente execução do `mkdocs gh-deploy` |
