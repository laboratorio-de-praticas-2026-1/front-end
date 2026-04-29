# Páginas e Rotas

Mapeamento completo de todas as rotas da aplicação Despachante Bortone, organizado por área de acesso.

---

## Sistema de roteamento

O roteamento é feito com **React Router DOM v7** usando `BrowserRouter`. As rotas são definidas centralmente em `src/App.tsx`.

Existem três grupos de rotas:
- **Rotas públicas** — sem autenticação
- **Rotas do Portal do Cliente** (`/cliente/*`) — protegidas pelo `ClienteLayout`
- **Rotas do Painel Administrativo** (`/admin/*`) — protegidas pelo `AdminLayout`

---

## Rotas Públicas

Acessíveis por qualquer visitante, sem necessidade de login.

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `Home` | Landing page principal do Despachante Bortone |
| `/servicos` | `Servicos` | Lista de serviços oferecidos pelo despachante |
| `/blog` | `Blog` | Listagem de posts do blog |
| `/blog/:id` | `Artigo` | Leitura de um artigo específico do blog |
| `/contato` | `Contato` | Página de contato |
| `/duvidas` | `Duvida` | FAQ público (accordion com perguntas e respostas) |
| `/login` | `Login` | Página de autenticação |
| `/cadastro` | `Cadastro` | Formulário de cadastro de novo cliente |
| `/SobreNos` | `SobreNos` | Página institucional "Sobre Nós" |
| `/mapa` | `Mapa` | Mapa interativo (React Leaflet) com localização |

---

## Rotas do Portal do Cliente

**Prefixo:** `/cliente`  
**Layout:** `ClienteLayout` (sidebar lateral)  
**Proteção:** Verificação de token JWT no `ClienteLayout`. Redireciona para `/login` se não autenticado.

| Rota | Componente | Descrição |
|---|---|---|
| `/cliente` | — | Redireciona para `/cliente/inicio` |
| `/cliente/inicio` | `InicioDashboard` | Dashboard inicial do cliente logado |
| `/cliente/debitos` | `DebitosPage` | Consulta de débitos veiculares |
| `/cliente/solicitacoes` | `Solicitacoes` | Lista de solicitações do cliente |
| `/cliente/solicitacoes/sucesso` | `SolicitacaoSucesso` | Confirmação de criação de solicitação |
| `/cliente/solicitacoes/historico` | `HistoricoSolicitacoes` | Histórico completo de solicitações |
| `/cliente/solicitacoes/:id` | `DetalhesSolicitacao` | Detalhes de uma solicitação específica |
| `/cliente/meus-veiculos` | `MeusVeiculos` | Lista de veículos do cliente |
| `/cliente/meus-veiculos/:id` | `DetalhesVeiculo` | Detalhes de um veículo específico |
| `/cliente/*` | (placeholder) | Tela genérica para rotas ainda não implementadas |

---

## Rotas do Painel Administrativo

**Prefixo:** `/admin`  
**Layout:** `AdminLayout` (sidebar lateral)  
**Proteção:** Verificação de token JWT e nível de acesso no `AdminLayout`. Redireciona para `/login` se não autenticado ou sem permissão.

### Solicitações

| Rota | Componente | Descrição |
|---|---|---|
| `/admin` | — | Redireciona para `/admin/posts` |
| `/admin/solicitacoes` | `SolicitacoesAdmin` | Lista todas as solicitações com filtros |
| `/admin/solicitacoes/:id/editar` | `EditarSolicitacao` | Editar solicitação (status, documentos, observações) |

### Relatórios

| Rota | Componente | Descrição |
|---|---|---|
| `/admin/relatorios` | `Relatorios` | Listagem de relatórios gerados |
| `/admin/relatorios/novo` | `CreateRelatorioCMS` | Criação de novo relatório |

### FAQ

| Rota | Componente | Descrição |
|---|---|---|
| `/admin/faq` | `FAQ` | Gestão de perguntas frequentes |
| `/admin/faq/novo` | `NovoFAQ` | Criação de nova pergunta |
| `/admin/faq/editar/:id` | `EditarFAQ` | Edição de pergunta existente |

### Empresas

| Rota | Componente | Descrição |
|---|---|---|
| `/admin/empresas` | `EmpresasAdmin` | Listagem de empresas parceiras |
| `/admin/empresas/novo` | `EmpresaFormPage` | Cadastro de nova empresa |
| `/admin/empresas/editar/:id` | `EmpresaFormPage` | Edição de empresa existente |

### Blog (CMS)

| Rota | Componente | Descrição |
|---|---|---|
| `/admin/posts` | `BlogAdmin` | Tabela de posts do blog |
| `/admin/posts/novo` | `CreatePostCMS` | Criação de novo post |
| `/admin/posts/editar/:id` | `EditPostCMS` | Edição de post existente |

### Carrossel (CMS)

| Rota | Componente | Descrição |
|---|---|---|
| `/admin/carrossel` | `CarouselAdmin` | Listagem de banners do carrossel |
| `/admin/carrossel/novo` | `CreateCarouselBanner` | Criação de novo banner |
| `/admin/carrossel/:id/editar` | `EditCarouselBanner` | Edição de banner existente |

### Publicidade (CMS)

| Rota | Componente | Descrição |
|---|---|---|
| `/admin/publicidade` | `PublicidadeAdmin` | Listagem de itens de publicidade |
| `/admin/publicidade/novo` | `CreatePublicidadeCMS` | Criação de item de publicidade |
| `/admin/publicidade/editar/:id` | `EditPublicidadeCMS` | Edição de item de publicidade |

### Serviços (CMS)

| Rota | Componente | Descrição |
|---|---|---|
| `/admin/servicos` | `ServicosAdmin` | Listagem de serviços cadastrados |
| `/admin/servicos/novo` | `NovoServicoCMS` | Criação de novo serviço |
| `/admin/servicos/editar/:id` | `EditarServicoCMS` | Edição de serviço existente |

### Dashboard Analytics

| Rota | Componente | Descrição |
|---|---|---|
| `/admin/dashboard` | `DashboardAdmin` | Container do dashboard (redireciona para `/geral`) |
| `/admin/dashboard/geral` | `GeralDashboard` | KPIs gerais do sistema |
| `/admin/dashboard/solicitacoes` | `SolicitacoesDashboard` | Métricas de solicitações |
| `/admin/dashboard/veiculos` | `VeiculosDashboard` | Métricas de veículos |
| `/admin/dashboard/servicos` | `ServicosDashboard` | Métricas de serviços |
| `/admin/dashboard/documentos` | `DocumentosDashboard` | Métricas de documentos |
| `/admin/dashboard/financeiro` | `FinanceiroDashboard` | Métricas financeiras |
| `/admin/dashboard/clientes` | `ClientesDashboard` | Métricas de clientes |

### Usuários

| Rota | Componente | Descrição |
|---|---|---|
| `/admin/usuarios` | `Usuarios` | Listagem de usuários do sistema |
| `/admin/usuarios/novo` | `NovoUsuario` | Cadastro de novo usuário |
| `/admin/usuarios/editar/:id` | `EditarUsuario` | Edição de usuário existente |

---

## Rotas protegidas

As rotas sob `/cliente/*` e `/admin/*` são **protegidas**. A autenticação é verificada nos layouts:

- **`ClienteLayout`** — verifica token no `localStorage` e redireciona para `/login` se ausente
- **`AdminLayout`** — verifica token no `localStorage` e, adicionalmente, valida o nível de acesso do usuário (apenas `administrador` pode acessar o painel admin)

O token JWT é armazenado em `localStorage` após login bem-sucedido e enviado nos headers `Authorization: Bearer <token>` para endpoints autenticados.
