# 🏢 Grupo Bortone - Despachante (Front-end)

Uma aplicação web moderna e responsiva desenvolvida para o Grupo Bortone. O projeto é dividido em duas partes principais: uma **Landing Page** focada em conversão de clientes e um **Painel Administrativo (CMS)** para gestão interna de processos.


## 🛠 Tecnologias Utilizadas

O projeto foi inicializado com [Vite](https://vitejs.dev/) e utiliza o seguinte ecossistema:

* **Framework:** [React 18](https://react.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Roteamento:** [React Router DOM](https://reactrouter.com/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
* **Ícones:** [React Icons](https://react-icons.github.io/react-icons/) e [Lucide React](https://lucide.dev/)

---

## ⚙️ Como executar o projeto localmente

### Pré-requisitos
Certifique-se de ter o **Node.js** (versão 18+ recomendada) e o **npm** instalados na sua máquina.

### Passo a Passo

1. Faça o clone do repositório:
```bash
git clone https://github.com/seu-usuario/despachante-front.git
```

2. Entre na pasta do projeto:
```bash
cd despachante-front
```

3. Instale as dependências:
```bash
npm install
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. O aplicativo estará disponível no seu navegador no endereço: `http://localhost:5173`.

---

## 📁 Estrutura de Pastas

O projeto segue uma arquitetura modular para facilitar a manutenção e escalabilidade:

```text
Com base em tudo que construímos até agora — incluindo a estruturação das rotas, a integração com a API do back-end (Railway) e a finalização do fluxo completo de CRUD do Blog (Criação, Edição e Listagem) —, o seu README.md precisa refletir esse amadurecimento do projeto.

Adicionei seções importantes como as Variáveis de Ambiente (já que agora temos o VITE_API_URL), atualizei a lista de rotas e detalhei a estrutura das pastas com as requisições de serviço.

Aqui está a versão atualizada e profissional do seu README:
Markdown

# 🏢 Grupo Bortone - Despachante (Front-end)

Uma aplicação web moderna e responsiva desenvolvida para o Grupo Bortone. O projeto é dividido em duas partes principais: uma **Landing Page** focada em conversão de clientes e um **Painel Administrativo (CMS)** para gestão interna de processos e conteúdo (Blog).

## 🛠 Tecnologias Utilizadas

O projeto foi inicializado com [Vite](https://vitejs.dev/) e utiliza o seguinte ecossistema:

* **Framework:** [React 18](https://react.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Roteamento:** [React Router DOM](https://reactrouter.com/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
* **Manipulação de Datas:** [date-fns](https://date-fns.org/)
* **Ícones:** [React Icons](https://react-icons.github.io/react-icons/) e [Lucide React](https://lucide.dev/)
* **Integração API:** Fetch API nativa (REST) com suporte a `FormData` para envio de imagens.

---

## ⚙️ Como executar o projeto localmente

### Pré-requisitos
Certifique-se de ter o **Node.js** (versão 18+ recomendada) e o **npm** instalados na sua máquina.

### Passo a Passo

1. Faça o clone do repositório:
```bash
git clone [https://github.com/seu-usuario/despachante-front.git](https://github.com/seu-usuario/despachante-front.git)

    Entre na pasta do projeto:

Bash

cd despachante-front

    Instale as dependências:

Bash

npm install

    Configuração de Ambiente:
    Crie um arquivo .env na raiz do projeto e configure a URL da API do back-end. (Caso não seja criado, o sistema fará fallback automático para a URL de produção no Railway).

Snippet de código

VITE_API_URL=http://localhost:3000

    Execute o servidor de desenvolvimento:

Bash

npm run dev

    O aplicativo estará disponível no seu navegador no endereço: http://localhost:5173.

📁 Estrutura de Pastas

O projeto segue uma arquitetura modular para facilitar a manutenção e escalabilidade:
Plaintext

src/
├── assets/         # Imagens estáticas, logotipos e SVGs
├── components/     # Componentes reutilizáveis
│   ├── admin/      # Componentes do painel CMS (ex: Sidebar, Forms do Blog)
│   ├── layout/     # Molduras estruturais (Navbar, AdminLayout)
│   ├── sections/   # Blocos da Landing Page (Header, OQueResolver)
│   ├── tables/     # Tabelas de listagem de dados (BlogTable)
│   └── ui/         # Componentes base do shadcn (Botões, Inputs, Calendário)
├── lib/            # Funções utilitárias (ex: cn do tailwind-merge)
├── pages/          # Páginas que representam rotas completas
│   ├── admin/      # Telas de dentro do painel CMS (ex: BlogAdmin)
│   ├── Home.tsx    # Página principal do site público
│   └── Servicos.tsx# Página detalhada de serviços
├── services/       # Arquivos de integração com o Back-end (ex: blogService.ts)
├── App.tsx         # Arquivo principal de configuração de Rotas
└── index.css       # Estilos globais e variáveis de tema do Tailwind
```

---

## 🔒 Rotas e Navegação

O gerenciamento de rotas é feito através do `react-router-dom`, permitindo uma navegação fluida entre a área pública e o painel administrativo.

### 🌐 Rotas Públicas (Landing Page)
* `/` - Página principal (Home) com seções de serviços, sobre, mapa e contato.
* `/servicos` - Catálogo completo de serviços oferecidos pelo despachante.
* `/login` - Tela de autenticação para acesso ao sistema administrativo.

### 🛠️ Rotas Administrativas (CMS)
* `/admin` - Dashboard principal e visão geral.
* `/admin/posts` - Listagem gerencial de todas as postagens do blog (Tabela).
* `/admin/posts/novo` - Interface para criação de novos conteúdos com upload de imagens.
* `/admin/posts/editar/:id` - Tela dinâmica para alteração de posts existentes, identificados por ID.

> **Nota:** As rotas do `/admin` estão atualmente abertas para desenvolvimento do front-end. Elas deverão ser protegidas (Private Routes) após a integração do fluxo de autenticação (Login).

---

## 🤝 Padrões e Contribuição

Para manter a consistência do código em equipe, siga as diretrizes abaixo:

1. **Commits Semânticos:** Utilize prefixos para identificar a natureza do commit:
   * `feat:` Nova funcionalidade (ex: *feat: adiciona tabela de blog*)
   * `fix:` Correção de bug (ex: *fix: resolve scroll do carrossel*)
   * `chore:` Manutenção, merges ou atualização de pacotes
   * `ui:` Ajustes puramente visuais e de design
2. **Branches:** Crie branches descritivas baseadas no que está sendo desenvolvido.
   * `feature/nome-da-feature`
   * `bugfix/nome-do-bug`
3. **Componentização:** Se um bloco de código se repetir em mais de uma tela, extraia-o para a pasta `src/components`.
