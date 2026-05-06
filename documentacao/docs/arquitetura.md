# Arquitetura do Front-end

Esta página descreve a organização estrutural e as decisões arquiteturais do front-end da aplicação Despachante Bortone.

---

## Visão geral

O front-end é uma **SPA (Single Page Application)** construída com **React 19 + Vite 7**, escrita em **TypeScript**. A aplicação é dividida em três grandes portais:

1. **Site público** — Acessível sem autenticação (landing page, blog, serviços, FAQ, mapa, contato)
2. **Portal do Cliente** — Área autenticada para clientes gerenciarem solicitações, veículos e débitos
3. **Painel Administrativo** — Área de back-office para administradores gerenciarem todo o sistema

---

## Organização de pastas

```
src/
├── assets/          # Imagens e recursos estáticos importados pelo Vite
├── components/      # Componentes reutilizáveis
│   ├── admin/       # Componentes exclusivos do painel administrativo
│   │   ├── dashboard/     # Sub-views do dashboard analytics
│   │   ├── faq/           # CRUD de FAQ (admin)
│   │   ├── relatorios/    # Gestão de relatórios
│   │   ├── servicos/      # Gestão de serviços
│   │   ├── solicitacoes/  # Gestão de solicitações (admin)
│   │   └── usuarios/      # Gestão de usuários
│   ├── chat/        # Componentes do chat em tempo real
│   ├── layout/      # Layouts de navegação (Navbar, Footer, sidebars)
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx (em components/admin/)
│   │   ├── ClienteLayout.tsx
│   │   ├── ClienteSidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── sections/    # Seções de página (carrossel, blog CMS, publicidade)
│   ├── tables/      # Componentes de tabela reutilizáveis
│   └── ui/          # Componentes base do shadcn/ui (Button, Input, Dialog, etc.)
├── context/         # React Contexts para estado global
│   └── VeiculoContext.tsx
├── lib/             # Utilitários internos (ex: cn() do shadcn)
├── mocks/           # Dados mock usados enquanto APIs não estão prontas
├── pages/           # Componentes de página (mapeados pelas rotas)
│   ├── admin/       # Páginas do painel administrativo
│   ├── cliente/     # Páginas do portal do cliente
│   ├── MeusVeiculos/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Cadastro.tsx
│   ├── Blog.tsx / Artigo.tsx
│   ├── Servicos.tsx
│   ├── Contato.tsx
│   ├── Duvida.tsx
│   ├── SobreNos.tsx
│   └── Mapa.tsx
├── schemas/         # Schemas Zod para validação de formulários
├── services/        # Camada de acesso à API (fetch/Socket.IO)
├── types/           # Tipos TypeScript compartilhados
├── App.tsx          # Definição de rotas (BrowserRouter + Routes)
├── main.tsx         # Ponto de entrada da aplicação
└── index.css        # Estilos globais + variáveis CSS do Tailwind
```

---

## Fluxo da aplicação

```
Usuário → Browser → React Router
                         ├── Rota Pública → Componente de Página
                         ├── /cliente → ClienteLayout (Sidebar) → Página do Cliente
                         └── /admin   → AdminLayout   (Sidebar) → Página Admin
                                                    ↓
                                            Service Layer (fetch / socket.io)
                                                    ↓
                                            API REST / WebSocket (Back-end NestJS)
```

---

## Decisões arquiteturais

### Roteamento
Utiliza **React Router DOM v7** com `BrowserRouter`. As rotas são organizadas em três grupos:
- Rotas públicas (sem layout especial)
- Rotas do cliente (`/cliente/*`) envolvidas pelo `ClienteLayout`
- Rotas do admin (`/admin/*`) envolvidas pelo `AdminLayout`

A proteção de rotas autenticadas é feita nos layouts (`ClienteLayout` e `AdminLayout`) que verificam o token no `localStorage` antes de renderizar o conteúdo.

### Gerenciamento de estado
O estado é gerenciado principalmente de forma **local** nos componentes via `useState`/`useReducer`. O único Context global presente é o `VeiculoContext`, que compartilha o estado de veículos entre componentes do portal do cliente.

Não há Redux, Zustand ou similar — a escolha foi manter a simplicidade dado o escopo atual da aplicação.

### Formulários e validação
Formulários são construídos com **React Hook Form** + **Zod**, garantindo validação tipada e integrada ao TypeScript. Os schemas ficam centralizados em `src/schemas/`.

### HTTP Client
A camada de serviços (`src/services/`) utiliza a **Fetch API nativa** do browser. Não há instância centralizada de axios ou similar — cada service importa a URL da API via `import.meta.env.VITE_API_URL`.

### Comunicação em tempo real
O módulo de chat usa **Socket.IO Client** (`src/services/socket.ts`). A conexão é autenticada via token JWT passado no objeto `auth` do socket. O socket é um singleton gerenciado manualmente (não usa estado React).

### Estilização
Utiliza **Tailwind CSS v4** com o plugin `@tailwindcss/vite`. Componentes base vêm do **shadcn/ui** (sobre Radix UI), garantindo acessibilidade.

### Build e deploy
- **Dev:** `vite` com HMR
- **Produção:** `tsc -b && vite build` → `dist/` servido por Nginx em container Docker
- **CI/CD:** `cloudbuild.yaml` para Google Cloud Build (Cloud Run)
