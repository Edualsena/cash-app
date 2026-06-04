# Cash App Backend

Backend seguro para aplicação de controle de caixa com autenticação JWT, SQLite e validações.

## 🚀 Iniciar

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Rodar servidor de desenvolvimento
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5000`

## 🔐 Segurança

- **JWT**: Autenticação com tokens JWT (validade: 7 dias)
- **Senhas criptografadas**: Bcrypt com 10 rounds
- **Validações**: Entrada de dados validada em todas as rotas
- **CORS**: Configurado para frontend em localhost:5173

## 📊 Banco de Dados

Usa **SQLite** com 3 tabelas:

### Users
- id (PK)
- name
- email (UNIQUE)
- password (hashed)
- created_at

### Categories
- id (PK)
- user_id (FK)
- name
- code (9500-9599)
- type (entrada/saída)
- created_at
- UNIQUE constraint: (user_id, code)

### Transactions
- id (PK)
- user_id (FK)
- category_id (FK)
- amount
- type (entrada/saída)
- description
- date
- created_at

## 🔌 API Endpoints

### Autenticação

**POST** `/api/auth/register`
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Categorias

**GET** `/api/categories` - Listar categorias do usuário (autenticado)

**POST** `/api/categories` - Criar categoria (autenticado)
```json
{
  "name": "Vendas",
  "code": 9500,
  "type": "entrada"
}
```

**GET** `/api/categories/:id` - Obter categoria (autenticado)

**PUT** `/api/categories/:id` - Atualizar categoria (autenticado)

**DELETE** `/api/categories/:id` - Deletar categoria (autenticado)

### Transações

**GET** `/api/transactions` - Listar transações (autenticado)
- Query params: `startDate` e `endDate` (opcional, formato: YYYY-MM-DD)

**POST** `/api/transactions` - Criar transação (autenticado)
```json
{
  "category_id": 1,
  "amount": 150.50,
  "type": "entrada",
  "description": "Venda de produto",
  "date": "2024-06-04"
}
```

**GET** `/api/transactions/:id` - Obter transação (autenticado)

**DELETE** `/api/transactions/:id` - Deletar transação (autenticado)

**GET** `/api/transactions/summary/:date` - Resumo do dia (autenticado)

## 📝 Exemplo de Fluxo

1. **Registrar usuário**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"João","email":"joao@test.com","password":"senha123"}'
   ```
   Resposta inclui: `token`

2. **Criar categoria**
   ```bash
   curl -X POST http://localhost:5000/api/categories \
     -H "Authorization: Bearer SEU_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Vendas","code":9500,"type":"entrada"}'
   ```

3. **Criar transação**
   ```bash
   curl -X POST http://localhost:5000/api/transactions \
     -H "Authorization: Bearer SEU_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"category_id":1,"amount":100,"type":"entrada","description":"Venda","date":"2024-06-04"}'
   ```

## 🛡️ Validações

- **Email**: Deve ser válido (regex)
- **Senha**: Mínimo 6 caracteres
- **Código da categoria**: Entre 9500 e 9599 (obrigatório)
- **Tipo**: "entrada" ou "saída"
- **Valor**: Maior que zero
- **Data**: Formato YYYY-MM-DD

## 📦 Dependências

- **express**: Framework web
- **sqlite3**: Banco de dados
- **jsonwebtoken**: Autenticação JWT
- **bcryptjs**: Criptografia de senhas
- **cors**: Controle de CORS
- **dotenv**: Variáveis de ambiente
- **nodemon**: Reload automático em desenvolvimento
