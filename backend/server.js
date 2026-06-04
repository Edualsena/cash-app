import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import transactionRoutes from './routes/transactions.js';
import db from './config/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['https://cash-hss6j5sa2-eduardo-sena-s-projects.vercel.app/'],
  credentials: true
}));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Servidor rodando ✅' });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Cash App API v1.0',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      transactions: '/api/transactions',
      health: '/api/health'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`https://cash-hss6j5sa2-eduardo-sena-s-projects.vercel.app/`);
  console.log(`https://cash-hss6j5sa2-eduardo-sena-s-projects.vercel.app/`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Encerrando servidor...');
  db.close();
  process.exit(0);
});
