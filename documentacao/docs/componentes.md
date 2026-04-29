# Componentes

Catálogo dos principais componentes do front-end da aplicação Despachante Bortone, organizados por área.

---

## Componentes de Layout

Estes componentes definem a estrutura visual das páginas e portais.

### `Navbar`
**Localização:** `src/components/layout/Navbar.tsx`

Barra de navegação principal do site público. Exibe o logo, links de navegação (Início, Serviços, Blog, Contato, FAQ, Sobre Nós, Mapa) e botões de Login/Cadastro. Adapta-se para mobile com menu hambúrguer.

### `Footer`
**Localização:** `src/components/layout/Footer.tsx`

Rodapé do site público com links institucionais, redes sociais e informações de contato.

### `AdminLayout`
**Localização:** `src/components/layout/AdminLayout.tsx`

Layout wrapper para todas as rotas do painel administrativo (`/admin/*`). Inclui a `AdminSidebar` lateral e área de conteúdo. Verifica autenticação antes de renderizar.

### `AdminSidebar`
**Localização:** `src/components/admin/AdminSidebar.tsx`

Sidebar do painel administrativo. Exibe links para: Solicitações, Dashboard, Blog (Posts), Carrossel, Publicidade, FAQ, Relatórios, Empresas e Usuários.

### `ClienteLayout`
**Localização:** `src/components/layout/ClienteLayout.tsx`

Layout wrapper para todas as rotas do portal do cliente (`/cliente/*`). Inclui a `ClienteSidebar` e área de conteúdo. Verifica autenticação antes de renderizar.

### `ClienteSidebar`
**Localização:** `src/components/layout/ClienteSidebar.tsx`

Sidebar do portal do cliente com links para: Início, Solicitações, Meus Veículos e Débitos.

---

## Componentes de UI (shadcn/ui)

Localizados em `src/components/ui/`, são componentes base do sistema de design, construídos sobre **Radix UI**:

| Componente | Descrição |
|---|---|
| `Button` | Botão com variantes (default, outline, ghost, destructive) |
| `Input` | Campo de entrada de texto |
| `Label` | Label acessível para inputs |
| `Dialog` | Modal/diálogo acessível |
| `AlertDialog` | Diálogo de confirmação com ações destrutivas |
| `Select` | Dropdown de seleção acessível |
| `Popover` | Painel flutuante |
| `Accordion` | Painel expansível (usado no FAQ público) |
| `Separator` | Divisor horizontal/vertical |
| `Slider` | Controle deslizante |
| `Sonner` (Toaster) | Sistema de notificações toast |
| `Badge` | Etiqueta de status |
| `Card` | Container de conteúdo com sombra |
| `Table` | Tabela acessível |

---

## Componentes Administrativos

### Dashboard

| Componente | Localização | Descrição |
|---|---|---|
| `GeralDashboard` | `components/admin/dashboard/` | Visão geral com KPIs principais |
| `SolicitacoesDashboard` | `components/admin/dashboard/` | Gráficos e métricas de solicitações |
| `VeiculosDashboard` | `components/admin/dashboard/` | Estatísticas de veículos cadastrados |
| `ServicosDashboard` | `components/admin/dashboard/` | Análise de serviços realizados |
| `DocumentosDashboard` | `components/admin/dashboard/` | Status de documentos enviados |
| `FinanceiroDashboard` | `components/admin/dashboard/` | Visão financeira e receitas |
| `ClientesDashboard` | `components/admin/dashboard/` | Dados de clientes cadastrados |

### CMS de Conteúdo

| Componente | Localização | Descrição |
|---|---|---|
| `CreatePostCMS` | `components/sections/admin/blog/` | Formulário de criação de post do blog |
| `EditPostCMS` | `components/sections/admin/blog/` | Formulário de edição de post do blog |
| `CarouselAdmin` | `components/sections/admin/carrossel/` | Listagem de banners do carrossel |
| `CreateCarouselBanner` | `components/sections/admin/carrossel/` | Criação de banner do carrossel |
| `EditCarouselBanner` | `components/sections/admin/carrossel/` | Edição de banner do carrossel |
| `CreatePublicidadeCMS` | `components/sections/admin/publicidade/` | Criação de item de publicidade |
| `EditPublicidadeCMS` | `components/sections/admin/publicidade/` | Edição de item de publicidade |

### FAQ Admin

| Componente | Localização | Descrição |
|---|---|---|
| `FaqAdmin` | `components/admin/faq/` | Listagem e gestão de perguntas frequentes |
| `CreateFaqCMS` | `components/admin/faq/` | Formulário de criação de FAQ |
| `EditarFaqCMS` | `components/admin/faq/` | Formulário de edição de FAQ |

### Solicitações Admin

| Componente | Localização | Descrição |
|---|---|---|
| `SolicitacoesAdmin` | `components/admin/solicitacoes/` | Listagem de todas as solicitações com filtros |
| `EditarSolicitacao` | `components/admin/` | Formulário completo de edição de solicitação (upload de documentos, mudança de status) |

---

## Componentes do Portal do Cliente

| Componente | Localização | Descrição |
|---|---|---|
| `SolicitacoesAdmin` (cliente) | `pages/cliente/solicitacoes/` | Listagem de solicitações do cliente logado |
| `HistoricoSolicitacoes` | `pages/cliente/solicitacoes/` | Histórico completo de solicitações |
| `DetalhesSolicitacao` | `pages/cliente/solicitacoes/` | Detalhes de uma solicitação específica |
| `SolicitacaoSucesso` | `pages/cliente/solicitacoes/` | Tela de confirmação após criação de solicitação |

---

## Seções do Site Público

| Componente/Seção | Arquivo | Descrição |
|---|---|---|
| Carrossel de banners | seção em `Home.tsx` | Slider de imagens promocionais |
| Mapa interativo | `pages/Mapa.tsx` | Mapa Leaflet com localização do despachante |
| Blog público | `pages/Blog.tsx` + `pages/Artigo.tsx` | Listagem e leitura de posts |
| FAQ público | `pages/Duvida.tsx` | Accordion com perguntas e respostas |

---

## Contextos (React Context)

### `VeiculoContext`
**Localização:** `src/context/VeiculoContext.tsx`

Fornece o estado compartilhado de veículos do cliente logado para os componentes filhos do portal do cliente. Encapsula a lista de veículos e permite que múltiplas páginas acessem os mesmos dados sem prop drilling.

**Uso:**
```tsx
import { useVeiculoContext } from "@/context/VeiculoContext";

const { veiculos, carregando } = useVeiculoContext();
```
