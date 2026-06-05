import { useState, useEffect } from 'react';
import './index.css';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { authAPI } from './utils/api';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validarSessao = async () => {
      const token = localStorage.getItem('token');
      const usuarioSalvo = localStorage.getItem('usuario');

      if (!token || !usuarioSalvo) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.me();
        setUsuario(response.data.user);
        localStorage.setItem('usuario', JSON.stringify(response.data.user));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      } finally {
        setLoading(false);
      }
    };

    validarSessao();
  }, []);

  const handleLoginSuccess = () => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Carregando...</div>;
  }

  return (
    <>
      {usuario ? (
        <Dashboard usuario={usuario} onLogout={handleLogout} />
      ) : (
        <LoginForm onSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
