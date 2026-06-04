# 🚀 Guia de Início Rápido

## Instalação Completa

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

O servidor estará rodando em: **http://localhost:5000**

### 2. Frontend (em outro terminal)

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

## 🧪 Teste Rápido

### 1. Registrar Usuário
- Clique em "Criar conta"
- Preencha: Nome, Email, Senha
- Clique em "Registrar"

### 2. Fazer Login
- Use as credenciais criadas
- Clique em "Entrar"

### 3. Criar Categorias
- Clique em "⚙️ Gerenciar Categorias"
- Crie algumas categorias:
  - Nome: "Aluguel" | Tipo: Saída
  - Nome: "Internet" | Tipo: Saída
  - Nome: "Venda" | Tipo: Entrada

### 4. Registrar Transações
- Selecione uma categoria no dropdown
- Digite um valor (ex: 50.00)
- Adicione descrição (opcional)
- Clique em "Adicionar Transação"

### 5. Visualizar Dashboard
- Veja o resumo no topo:
  - Entradas: total de entradas
  - Saídas: total de saídas
  - Saldo: diferença (entrada - saída)
- A tabela mostra todas as transações do dia

## 🎨 Tema

A aplicação usa:
- **Azul Marinho (#003366)** para header e componentes principais
- **Branco (#ffffff)** para fundo
- **Verde (#28a745)** para entradas
- **Vermelho (#dc3545)** para saídas

## 📱 Responsividade

A aplicação funciona em:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktops

## 🔧 Variáveis de Ambiente (Opcional)

Crie `.env` na pasta backend:

```
JWT_SECRET=sua_chave_secreta_aqui
PORT=5000
```

## 🐛 Troubleshooting

### Porta 5000 já em uso
```bash
lsof -ti:5000 | xargs kill -9
```

### Porta 5173 já em uso
```bash
lsof -ti:5173 | xargs kill -9
```

### Banco de dados corrompido
```bash
rm backend/database.sqlite
```

## 📂 Arquivos Criados

```
cash-app/
├── backend/          # Node.js + Express
├── frontend/         # React + Vite
├── README.md         # Documentação completa
└── SETUP.md          # Este arquivo
```

---

**Aproveite o app! 💰**
