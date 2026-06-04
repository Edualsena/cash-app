import express from 'express';
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }

    // Criar novo usuário
    const newUser = await User.create(name, email, password);
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: newUser,
      token
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha
    const passwordMatch = User.verifyPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar token
    const token = generateToken(user);

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

export default router;
