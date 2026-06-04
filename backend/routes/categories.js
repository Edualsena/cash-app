import express from 'express';
import { Category } from '../models/Category.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Criar categoria
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, code, type } = req.body;

    if (!name || !code || !type) {
      return res.status(400).json({ error: 'Nome, código e tipo são obrigatórios' });
    }

    // Validar código (entre 9500 e 9599)
    const codeNum = parseInt(code, 10);
    if (isNaN(codeNum) || codeNum < 9500 || codeNum > 9599) {
      return res.status(400).json({ error: 'Código deve ser um número entre 9500 e 9599' });
    }

    // Validar tipo
    if (!['entrada', 'saída'].includes(type)) {
      return res.status(400).json({ error: 'Tipo deve ser "entrada" ou "saída"' });
    }

    const category = await Category.create(req.userId, name, codeNum, type);
    res.status(201).json(category);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    if (error.message.includes('entre 9500 e 9599')) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes('já existe')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  }
});

// Listar categorias do usuário
router.get('/', verifyToken, async (req, res) => {
  try {
    const categories = await Category.getByUserId(req.userId);
    res.json(categories);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro ao listar categorias' });
  }
});

// Obter categoria por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const category = await Category.getById(req.params.id, req.userId);
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.json(category);
  } catch (error) {
    console.error('Erro ao obter categoria:', error);
    res.status(500).json({ error: 'Erro ao obter categoria' });
  }
});

// Atualizar categoria
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, code, type } = req.body;

    if (!name || !code || !type) {
      return res.status(400).json({ error: 'Nome, código e tipo são obrigatórios' });
    }

    // Validar código
    const codeNum = parseInt(code, 10);
    if (isNaN(codeNum) || codeNum < 9500 || codeNum > 9599) {
      return res.status(400).json({ error: 'Código deve ser um número entre 9500 e 9599' });
    }

    // Validar tipo
    if (!['entrada', 'saída'].includes(type)) {
      return res.status(400).json({ error: 'Tipo deve ser "entrada" ou "saída"' });
    }

    const category = await Category.update(req.params.id, req.userId, name, codeNum, type);
    res.json(category);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    if (error.message.includes('entre 9500 e 9599')) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes('já existe')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
  }
});

// Deletar categoria
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Category.delete(req.params.id, req.userId);
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
});

export default router;
