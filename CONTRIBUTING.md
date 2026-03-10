*Guia de Contribuição*
Este documento descreve o fluxo de trabalho adotado neste repositório. Siga as etapas abaixo para contribuir de forma organizada.

- Estrutura de Branches
main
└── develop
      ├── chore/                    ← tarefas técnicas globais
      └── release/entrega-DD-MM     ← entrega do período
              └── {issue}-{descricao}  ← sua branch (criada pela issue)

- Passo a Passo
1. Encontre sua Issue
Acesse a aba Issues do repositório e filtre por assignee:@me para ver as issues atribuídas a você.

2. Leia e analise a tarefa
Antes de começar, leia a issue com atenção e entenda o que precisa ser feito.

3. Crie a branch pela própria Issue
No painel lateral direito da issue, clique em "Create a branch" na seção Development.

// Deixe o nome ser gerado automaticamente — ele já vem no formato correto baseado no título da issue (ex: 10-feature-preparar-tela-de-login). //

Escolha a origem correta:

Situação                | Branch de origem
Feature de uma entrega	| release/entrega-DD-MM
Tarefa técnica global	| develop

Selecione a branch de origem no campo "Branch source" e clique em "Create branch".

4. Faça checkout na branch criada
Após criar, o GitHub mostra o comando. Você pode usar:

git fetch origin
git checkout nome-da-branch-criada
Ou pelo VSCode (aba Source Control → trocar branch) ou pelo GitHub Desktop.

5. Desenvolva e commite
Faça seu trabalho e commite seguindo o padrão Conventional Commits:
____________________________________________________
git add .
git commit -m "feat: descrição do que foi feito"
git push origin nome-da-sua-branch

- Prefixo Uso
feat:	Nova funcionalidade
fix:	Correção de bug
chore:	Tarefa técnica sem impacto funcional
docs:	Documentação
refactor:	Refatoração sem mudança de comportamento
test:	Adição ou ajuste de testes
ci:	Configuração de CI/CD
____________________________________________________


6. Abra o Pull Request
Na aba Pull Requests, clique em New pull request e configure:

Campo	          |  Valor
base (esquerda)   |	branch pai (release/entrega-DD-MM ou develop)
compare (direita) |	sua branch

- No corpo do PR: 
Descreva com detalhes o que foi feito
Referencie a issue com closes #numero para fechá-la automaticamente

- No painel lateral:
Solicite a review do seu PO ou PM na aba Reviewers 

- Fluxo de Merges
sua branch  →  release/entrega-DD-MM  →  develop  →  main
chore/      →  develop  →  main

O merge entre os níveis acima é responsabilidade do PO/PM. Sua responsabilidade é abrir o PR da sua branch para a release correspondente.

- Regras Gerais
1. Nunca faça push direto em main, develop ou release/*
2. Todo merge deve ser feito via Pull Request com ao menos 1 aprovação
3. Sempre crie sua branch a partir da Issue para manter o rastreamento automático
4. Atualize sua branch com a base antes de abrir o PR para evitar 