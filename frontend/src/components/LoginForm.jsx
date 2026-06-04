import { useState } from 'react';
import { authAPI } from '../utils/api';

export default function LoginForm({ onSuccess, onToggleForm }) {
  const [formData, setFormData] = useState({
    email: 'admin@test.com',
    password: 'admin123'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.user));
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💰 Controle de Caixa</h1>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.testInfo}>
          <strong>🧪 Credenciais de Teste:</strong>
          <p>Email: <code>admin@test.com</code></p>
          <p>Senha: <code>admin123</code></p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
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
    marginBottom: '30px',
    fontSize: '28px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  testInfo: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #90caf9',
    fontSize: '13px'
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
