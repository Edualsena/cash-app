import express from 'express';
import { Transaction } from '../models/Transaction.js';
import { Category } from '../models/Category.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Criar transação
router.post('/', verifyToken, async (req, res) => {
  try {
    const { category_id, amount, type, description, date } = req.body;

    if (!category_id || !amount || !type || !date) {
      return res.status(400).json({ error: 'Category, amount, type e date são obrigatórios' });
    }

    // Validar tipo
    if (!['entrada', 'saída'].includes(type)) {
      return res.status(400).json({ error: 'Tipo deve ser "entrada" ou "saída"' });
    }

    const category = await Category.getById(category_id, req.userId);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    if (category.type !== type) {
      return res.status(400).json({ error: 'A categoria não corresponde ao tipo da transação' });
    }

    // Validar amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: 'Valor deve ser maior que zero' });
    }

    // Validar data
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'Data deve estar no formato YYYY-MM-DD' });
    }

    const transaction = await Transaction.create(
      req.userId,
      category_id,
      amountNum,
      type,
      description || '',
      date
    );

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// Listar transações do usuário
router.get('/', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let transactions;
    if (startDate && endDate) {
      transactions = await Transaction.getByUserIdAndDate(req.userId, startDate, endDate);
    } else {
      transactions = await Transaction.getByUserId(req.userId);
    }

    res.json(transactions);
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    res.status(500).json({ error: 'Erro ao listar transações' });
  }
});

// Obter transação por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.getById(req.params.id, req.userId);

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Erro ao obter transação:', error);
    res.status(500).json({ error: 'Erro ao obter transação' });
  }
});

// Deletar transação
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Transaction.delete(req.params.id, req.userId);
    res.json({ message: 'Transação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
});

// Obter resumo diário
router.get('/summary/:date', verifyToken, async (req, res) => {
  try {
    const { date } = req.params;

    // Validar data
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'Data deve estar no formato YYYY-MM-DD' });
    }

    const summary = await Transaction.getDailySummary(req.userId, date);
    res.json(summary);
  } catch (error) {
    console.error('Erro ao obter resumo:', error);
    res.status(500).json({ error: 'Erro ao obter resumo' });
  }
});

export default router;
