import { useState, useEffect } from 'react';
import './index.css';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
      } catch (e) {
        console.error('Erro ao parsear usuário:', e);
      }
    }
    setLoading(false);
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
