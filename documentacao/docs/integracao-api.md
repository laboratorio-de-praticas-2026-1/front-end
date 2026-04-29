# Integração com a API

Esta página documenta como o front-end consome a API REST do back-end NestJS da aplicação Despachante Bortone.

---

## HTTP Client

O projeto utiliza a **Fetch API nativa** do browser para todas as requisições HTTP. Não há uma biblioteca de terceiros como axios. Cada módulo de serviço em `src/services/` gerencia suas próprias chamadas.

A URL base é configurada via variável de ambiente:

```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Autenticação

### Armazenamento do token

Após o login bem-sucedido, o token JWT é armazenado no `localStorage`:

```typescript
localStorage.setItem('token', tokenRecebido);
```

### Envio nos headers

Endpoints autenticados recebem o token no header `Authorization`:

```typescript
const authHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
});
```

> **Atenção:** O token é recuperado do `localStorage` a cada chamada. Não há interceptor global — cada service que exige autenticação inclui os headers manualmente.

---

## Tratamento de erros

O padrão adotado nos services é:

1. Verificar `response.ok` após o `fetch`
2. Em caso de erro, ler o corpo da resposta com `response.text()` e logar via `console.error`
3. Lançar um `Error` com mensagem descritiva para que a camada de UI trate via `try/catch`

```typescript
const response = await fetch(`${API_URL}/recurso`);
if (!response.ok) {
  const motivo = await response.text();
  console.error(`Erro (${response.status}):`, motivo);
  throw new Error('Mensagem amigável para o usuário');
}
```

---

## Módulos de serviço e endpoints

### `blogService` — `/blog`

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/blog` | Não | Lista todos os posts do blog |
| `GET` | `/blog/:id` | Não | Busca um post específico |
| `POST` | `/blog` | Sim (admin) | Cria um novo post (multipart/form-data com imagem) |
| `PUT` | `/blog/:id` | Sim (admin) | Atualiza um post existente (multipart/form-data) |
| `DELETE` | `/blog/:id` | Sim (admin) | Remove um post |

---

### `buscaService` — `/busca`

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/busca/blog/periodo` | Não | Filtra posts de blog por intervalo de data (`de`, `ate`) |
| `GET` | `/busca/blog/termo` | Não | Busca posts por termo no título/conteúdo |
| `GET` | `/busca/banner/status` | Não | Filtra banners por status (`ativo` \| `inativo`) |
| `GET` | `/busca/carrossel/termo` | Não | Busca banners do carrossel por termo |

---

### `contatoService` — `/contato`

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/contato` | Não | Retorna dados de contato/empresa |
| `GET` | `/contato/:id` | Não | Busca registro de contato por ID |
| `PUT` | `/contato/:id` | Sim (admin) | Atualiza dados de contato |

---

### `carrosselService` — `/header`

> O serviço de carrossel no front-end consome o módulo `/header` do back-end, responsável pelos banners exibidos no carrossel da página inicial.

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/header/carrossel` | Não | Retorna banners ativos para exibição no carrossel |
| `GET` | `/header` | Não | Lista todos os banners |
| `GET` | `/header/:id` | Não | Busca banner por ID |
| `POST` | `/header` | Sim (admin) | Cria banner (multipart/form-data com imagem) |
| `PATCH` | `/header/:id` | Sim (admin) | Atualiza banner (multipart/form-data, imagem opcional) |
| `DELETE` | `/header/:id` | Sim (admin) | Remove banner |

---

### `solicitacaoService` — `/solicitacoes`

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/solicitacoes` | Não (atual) | Lista todas as solicitações (com filtros client-side) |
| `POST` | `/solicitacoes` | Não (atual) | Cria uma nova solicitação |
| `PUT` | `/solicitacoes/:id` | Sim (admin) | Atualiza status da solicitação |
| `POST` | `/solicitacoes/:id/documentos` | Sim | Envia documento para uma solicitação (multipart/form-data) |

**Filtros disponíveis** (aplicados client-side após busca completa):

| Filtro | Tipo | Descrição |
|---|---|---|
| `usuario_id` | `number` | Filtra por ID do cliente |
| `status` | `string` | Filtra por status da solicitação |
| `search` | `string` | Busca textual em protocolo, serviço e observações |
| `dataInicio` | `string` (YYYY-MM-DD) | Data mínima da solicitação |
| `dataFim` | `string` (YYYY-MM-DD) | Data máxima da solicitação |
| `page` | `number` | Página para paginação |
| `limit` | `number` | Itens por página |

**Status possíveis:**

```typescript
type StatusSolicitacao =
  | "recebido"
  | "em_andamento"
  | "aguardando_pagamento"
  | "aguardando_documento"
  | "concluido"
  | "cancelado";
```

---

### `publicidadeService` — `/publicidade`

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/publicidade` | Não | Lista itens de publicidade |
| `GET` | `/publicidade/:id` | Não | Busca publicidade por ID |
| `GET` | `/publicidade/status/:status` | Não | Filtra por status (`ativo` \| `inativo`) |
| `POST` | `/publicidade` | Sim (admin) | Cria item de publicidade (multipart/form-data com campo `file`) |
| `PUT` | `/publicidade/:id` | Sim (admin) | Atualiza item existente (multipart/form-data) |
| `DELETE` | `/publicidade/:id` | Sim (admin) | Remove item |

---

### `usuariosService` — `/usuario`

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/usuario` | Sim | Lista todos os usuários |
| `GET` | `/usuario/:id` | Sim | Busca usuário por ID |
| `POST` | `/usuario/admin/usuarios` | Sim (admin) | Cria novo usuário (admin) |
| `PATCH` | `/usuario/:id` | Sim | Atualiza dados do usuário |
| `DELETE` | `/usuario/:id` | Sim (admin) | Remove usuário |

---

### `empresaService` — `/empresa`

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/empresa` | Não | Lista empresas parceiras |
| `GET` | `/empresa/:id` | Não | Busca empresa por ID |
| `POST` | `/empresa` | Sim (admin) | Cria nova empresa |
| `PATCH` | `/empresa/:id` | Sim (admin) | Atualiza empresa existente |
| `DELETE` | `/empresa/:id` | Sim (admin) | Remove empresa |

---

### `faqService` — `/faq`

> ⚠️ **Stub:** O `faqService` está atualmente usando dados mock locais (`src/mocks/faq.mocks.ts`). A integração com o endpoint real do back-end está comentada no código e aguarda implementação.

```typescript
// Código comentado aguardando integração:
// const response = await fetch(`${API_URL}/faq`);
// return await handleResponse(response);
```

---

### `dashboardService` — `/dashboard`

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/dashboard` | Sim | Dados analíticos para os gráficos do painel admin |

> ⚠️ O módulo `dashboard` ainda está em fase de estrutura base no back-end (sem rotas HTTP finalizadas).

---

### `reportsService` — `/relatorios`

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/relatorios` | Sim (admin) | Lista relatórios gerados |
| `POST` | `/relatorios` | Sim (admin) | Cria novo relatório |

---

### Serviços em stub (sem integração real)

Os serviços abaixo existem no front-end mas ainda consomem dados mock ou aguardam endpoint do back-end:

| Serviço | Endpoint esperado | Situação |
|---|---|---|
| `clienteDashboardService` | `/dashboard/cliente` | Stub / mock |
| `debitosService` | `/debitos` | Stub / mock |
| `faqPublicoService` | `/faq` | Stub (aguarda back-end) |

---

## WebSocket — Chat em tempo real

### Conexão

```typescript
import { connectChatSocket } from "@/services/socket";

const socket = connectChatSocket(localStorage.getItem('token'));
```

A conexão é feita com `socket.io-client` apontando para `VITE_SOCKET_URL`. O JWT é enviado no objeto `auth`:

```typescript
socket = io(SOCKET_URL, {
  auth: { token: tokenJWT },
  transports: ["websocket"],
});
```

### Eventos de erro

| Evento | Descrição |
|---|---|
| `connect_error` | Falha na conexão com o servidor |
| `chat_error` | Erros de validação do chat (spam, fora do horário, mensagem longa) |

**Mensagens de erro possíveis (vindas do back-end):**
- "Fora do horário comercial (8h às 18h)"
- "Limite de mensagens atingido (Spam)"
- "Mensagem maior que 200 caracteres"

### Desconexão

```typescript
import { disconnectChatSocket } from "@/services/socket";

disconnectChatSocket();
```

O socket é um **singleton** gerenciado em módulo — uma única instância é compartilhada por toda a aplicação.
