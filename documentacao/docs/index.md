# Front-end Bortone

Esta documentação cobre o repositório de front-end da aplicação **Despachante Bortone**, um sistema web para gestão de serviços de despachante veicular. O front-end é uma SPA (Single Page Application) construída com React + Vite, consumindo a API REST do back-end e expondo portais distintos para clientes e administradores.

---

## Escopo

- Interface pública (landing page, blog, serviços, contato, FAQ, mapa)
- Portal do Cliente autenticado (solicitações, veículos, débitos, chat)
- Painel Administrativo (CMS de conteúdo, dashboard analítico, gestão de usuários/empresas)
- Integração em tempo real via Socket.IO (chat)
- Deploy contínuo via Docker + Google Cloud Run / Railway

---

## Tecnologias

| Tecnologia | Versão | Função |
|---|---|---|
| React | 19.2 | Framework de UI (SPA) |
| TypeScript | ~5.9 | Tipagem estática |
| Vite | 7.x | Build tool e dev server |
| React Router DOM | 7.x | Roteamento client-side |
| Tailwind CSS | 4.2 | Estilização utilitária |
| shadcn/ui + Radix UI | — | Componentes de UI acessíveis |
| React Hook Form | 7.x | Gerenciamento de formulários |
| Zod | 4.x | Validação de schemas |
| Socket.IO Client | 4.x | Comunicação em tempo real (chat) |
| Recharts | 3.x | Gráficos no dashboard |
| React Leaflet | 5.x | Mapa interativo |
| Lucide React | — | Ícones |
| Sonner | 2.x | Notificações toast |
| date-fns | 4.x | Manipulação de datas |
| ESLint | 9.x | Linting de código |

---

## Início rápido

1. Clone o repositório:
   ```bash
   git clone https://github.com/laboratorio-de-praticas-2026-1/front-end.git
   cd front-end
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Edite o .env e preencha VITE_API_URL e VITE_SOCKET_URL
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse no navegador: [http://localhost:5173](http://localhost:5173)

---

## Mapa da documentação

| Seção | Descrição |
|---|---|
| [Configuração do Ambiente](configuracao.md) | Pré-requisitos, passo a passo de instalação, variáveis de ambiente e scripts |
| [Arquitetura](arquitetura.md) | Organização de pastas, camadas da aplicação e decisões arquiteturais |
| [Componentes](componentes.md) | Catálogo dos principais componentes e suas responsabilidades |
| [Páginas e Rotas](paginas-e-rotas.md) | Mapeamento completo de rotas públicas, do cliente e do admin |
| [Integração com a API](integracao-api.md) | Endpoints consumidos, HTTP client, autenticação e tratamento de erros |
| [Status de Implementação](status-implementacao.md) | Panorama do estado atual por módulo/página |

---

## Status da documentação

| Página | Status |
|---|---|
| Início (esta página) | ✅ Completo |
| Configuração do Ambiente | ✅ Completo |
| Arquitetura | ✅ Completo |
| Componentes | ✅ Completo |
| Páginas e Rotas | ✅ Completo |
| Integração com a API | ✅ Completo |
| Status de Implementação | ✅ Completo |

---

## Como rodar a documentação localmente

```bash
# Instalar MkDocs e o tema Material
pip install mkdocs-material

# Entrar na pasta da documentação
cd documentacao

# Servir localmente
mkdocs serve
# Acesse: http://127.0.0.1:8000
```

## Deploy no GitHub Pages

```bash
# A partir da pasta documentacao/
mkdocs gh-deploy
```

---

## Estrutura da documentação

```
documentacao/
├── docs/
│   ├── assets/               # Logo, imagens e recursos estáticos
│   ├── stylesheets/          # Estilos CSS customizados (se necessário)
│   ├── index.md              # Página inicial — escopo, tecnologias, início rápido
│   ├── configuracao.md       # Configuração do ambiente de desenvolvimento
│   ├── arquitetura.md        # Arquitetura do projeto front-end
│   ├── componentes.md        # Catálogo de componentes e suas responsabilidades
│   ├── paginas-e-rotas.md    # Mapeamento de páginas e sistema de rotas
│   ├── integracao-api.md     # Integração com a API do back-end (endpoints consumidos)
│   └── status-implementacao.md # Status atual por módulo/página
└── mkdocs.yml                # Configuração da navegação e tema
```

> **Nota:** Esta documentação representa o estado atual do código no repositório. Módulos ainda incompletos ou em desenvolvimento estão marcados explicitamente na página de [Status de Implementação](status-implementacao.md).

---

*Documentação gerada com [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)*
