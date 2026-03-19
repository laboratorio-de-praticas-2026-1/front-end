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
src/
├── assets/         # Imagens estáticas, logotipos e ilustrações
├── components/     # Componentes reutilizáveis
│   ├── admin/      # Componentes exclusivos do painel CMS (ex: Sidebar)
│   ├── layout/     # Molduras estruturais (Navbar, AdminLayout)
│   ├── sections/   # Grandes blocos da Landing Page (Header, Carousel)
│   └── ui/         # Componentes base do shadcn (Botões, Inputs, Tabelas)
├── data/           # Dados mockados para testes (ex: lista de processos)
├── lib/            # Funções utilitárias (ex: cn do tailwind-merge)
├── pages/          # Páginas que representam rotas completas
│   ├── admin/      # Telas de dentro do painel CMS (ex: BlogAdmin)
│   └── Home.tsx    # Página principal do site público
├── App.tsx         # Arquivo principal de configuração de Rotas
└── index.css       # Estilos globais e variáveis de tema do Tailwind
```

---

## 🔒 Rotas e Navegação

* `/` - Landing Page pública(Home) do despachante.
* `/admin` - Redireciona para o painel principal do CMS.

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
