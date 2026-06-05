import { useState } from 'react';
import { authAPI } from '../utils/api';

export default function LoginForm({ onSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = isRegister
        ? await authAPI.register(formData.name, formData.email, formData.password)
        : await authAPI.login(formData.email, formData.password);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.user));
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || (isRegister ? 'Erro ao criar conta' : 'Erro ao fazer login'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💰 Controle de Caixa</h1>
        <p style={styles.subtitle}>
          {isRegister ? 'Crie sua conta para começar' : 'Acesse sua conta'}
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isRegister ? 'Mínimo 6 caracteres' : 'Sua senha'}
              required
              minLength={isRegister ? 6 : undefined}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Carregando...' : (isRegister ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>

        <button type="button" onClick={toggleMode} style={styles.toggleBtn}>
          {isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Criar conta'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    color: '#003366',
    textAlign: 'center',
    marginBottom: '8px',
    fontSize: '28px'
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '14px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#003366',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px'
  },
  toggleBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'transparent',
    color: '#003366',
    border: '2px solid #003366',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '10px'
  }
};
