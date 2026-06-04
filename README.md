# 💰 Controle de Caixa - Web App

Uma aplicação web moderna e intuitiva para gerenciar entradas e saídas diárias de caixa. Desenvolvida com React, Node.js e SQLite.

## 🎯 Características

- ✅ **Autenticação de Usuários**: Sistema seguro com JWT
- ✅ **Múltiplos Usuários**: Cada usuário possui seus próprios dados
- ✅ **Categorias Dinâmicas**: Crie categorias personalizadas de entrada/saída
- ✅ **Registro de Transações**: Registre entradas e saídas com data, valor e descrição
- ✅ **Dashboard em Tempo Real**: Visualize totais e saldos do dia
- ✅ **Design Responsivo**: Interface bonita com cores azul marinho e branco
- ✅ **Sem Configuração**: SQLite embutido, sem servidor externo

## 📊 Fluxograma da Aplicação

```
┌─────────────────────────────────────────────────────────────┐
│                   CONTROLE DE CAIXA                         │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
            ┌───▼────┐              ┌──────▼──┐
            │ LOGIN  │              │REGISTRO │
            └────┬───┘              └────┬────┘
                 │                       │
                 └───────────┬───────────┘
                             │
                       ┌─────▼─────┐
                       │  AUTENTICADO
                       └─────┬─────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼───┐    ┌─────▼──┐    ┌────▼──┐
         │DASHBOARD│    │TRANSAÇÕES│   │CATEGORIAS
         └────┬────┘    └─────┬───┘   └────┬───┘
              │               │            │
         ┌────▼───┐    ┌─────▼──┐    ┌────▼──┐
         │Resumo  │    │Adicionar│   │Criar  │
         │do Dia  │    │Deletar  │   │Editar │
         └────────┘    └─────────┘   └───────┘
```

## 🏗️ Arquitetura

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Estilo**: CSS Puro (Azul Marinho + Branco)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Banco de Dados**: SQLite3
- **Autenticação**: JWT
- **Hash de Senha**: bcryptjs

## 📁 Estrutura do Projeto

```
cash-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx       # Form de login/registro
│   │   │   ├── Dashboard.jsx       # Tela principal
│   │   │   ├── TransactionForm.jsx # Form de transação
│   │   │   ├── TransactionTable.jsx# Tabela de transações
│   │   │   └── CategoryManager.jsx # Gerenciar categorias
│   │   ├── utils/
│   │   │   └── api.js              # Cliente HTTP
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Estilos globais
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── models/
│   │   ├── User.js                 # Modelo usuário
│   │   ├── Category.js             # Modelo categoria
│   │   └── Transaction.js          # Modelo transação
│   ├── routes/
│   │   ├── auth.js                 # Rotas de autenticação
│   │   ├── categories.js           # Rotas de categorias
│   │   └── transactions.js         # Rotas de transações
│   ├── middleware/
│   │   └── auth.js                 # Middleware JWT
│   ├── config/
│   │   └── database.js             # Configuração SQLite
│   ├── server.js                   # Entrada do servidor
│   └── package.json
│
├── README.md                        # Este arquivo
└── .gitignore
```

## 🗄️ Banco de Dados

### Tabela `users`
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Tabela `categories`
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL REFERENCES users(id),
  nome VARCHAR(255) NOT NULL,
  tipo ENUM('entrada', 'saida') NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Tabela `transactions`
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL REFERENCES users(id),
  categoryId INTEGER NOT NULL REFERENCES categories(id),
  valor DECIMAL(10, 2) NOT NULL,
  descricao VARCHAR(255),
  data DATETIME NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js (v16+)
- npm ou yarn

### Backend

```bash
# Entrar no diretório backend
cd backend

# Instalar dependências
npm install

# Iniciar servidor (porta 5000)
npm run dev
```

### Frontend

```bash
# Em outro terminal, entrar no diretório frontend
cd frontend

# Instalar dependências
npm install

# Iniciar desenvolvimento (porta 5173)
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Categorias
- `GET /api/categories` - Listar categorias do usuário
- `POST /api/categories` - Criar categoria
- `DELETE /api/categories/:id` - Deletar categoria

### Transações
- `GET /api/transactions` - Listar transações (filtrar por data opcional)
- `POST /api/transactions` - Criar transação
- `DELETE /api/transactions/:id` - Deletar transação

## 🎨 Paleta de Cores

| Cor | Código | Uso |
|-----|--------|-----|
| Azul Marinho | #003366 | Header, botões, títulos |
| Branco | #ffffff | Fundo, cards |
| Cinza Claro | #f5f5f5 | Fundo alternativo |
| Verde (Entrada) | #28a745 | Valores de entrada |
| Vermelho (Saída) | #dc3545 | Valores de saída |

## 📝 Exemplo de Uso

1. **Registre uma conta**: Clique em "Criar conta" e preencha o formulário
2. **Faça login**: Use email e senha cadastrados
3. **Crie categorias**: Vá em "Gerenciar Categorias" e adicione suas categorias
   - Ex: "Aluguel" (saída), "Internet" (saída), "Venda" (entrada)
4. **Registre transações**: Selecione categoria, valor, data e descrição
5. **Visualize resumo**: O dashboard mostra totais de entrada, saída e saldo

## 🔒 Segurança

- Senhas são criptografadas com bcryptjs
- Autenticação via JWT tokens
- Cada usuário só vê seus dados
- CORS configurado para produção

## 🛠️ Desenvolvimento

### Executar testes
```bash
cd backend
npm test
```

### Build para produção
```bash
cd frontend
npm run build
```

## 📱 Responsividade

A aplicação é totalmente responsiva:
- 📱 Mobile: otimizado para telas pequenas
- 💻 Desktop: layout completo com múltiplas colunas
- 📊 Tablets: interface adaptada

## 🤝 Contribuição

Sinta-se livre para:
- Reportar bugs
- Sugerir novas funcionalidades
- Fazer pull requests

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido com ❤️ para simplificar o controle de caixa.

---

**Dúvidas?** Abra uma issue ou entre em contato!
