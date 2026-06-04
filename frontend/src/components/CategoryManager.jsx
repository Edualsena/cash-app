import { useState } from 'react';
import { categoriesAPI } from '../utils/api';

export default function CategoryManager({ categorias, onClose, onCategoriaAdicionada }) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('saida');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nome.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    setLoading(true);
    try {
      await categoriesAPI.create(nome, tipo);
      setNome('');
      onCategoriaAdicionada();
    } catch (erro) {
      setError(erro.response?.data?.error || 'Erro ao criar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await categoriesAPI.delete(id);
        onCategoriaAdicionada();
      } catch (erro) {
        alert('Erro ao deletar categoria');
      }
    }
  };

  const categoriasSaida = categorias.filter(c => c.tipo === 'saida');
  const categoriasEntrada = categorias.filter(c => c.tipo === 'entrada');

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>⚙️ Gerenciar Categorias</h2>

        <form onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}

          <div className="form-group">
            <label>Nome da Categoria</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="ex: Aluguel, Internet, Venda..."
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="saida">Saída</option>
              <option value="entrada">Entrada</option>
            </select>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Adicionando...' : 'Adicionar Categoria'}
          </button>
        </form>

        <hr style={styles.divider} />

        <h3 style={styles.subtitle}>Categorias de Saída</h3>
        <div style={styles.categoryList}>
          {categoriasSaida.length === 0 ? (
            <p style={styles.empty}>Nenhuma categoria de saída</p>
          ) : (
            categoriasSaida.map(cat => (
              <div key={cat.id} style={styles.categoryItem}>
                <span>{cat.nome}</span>
                <button
                  onClick={() => handleDelete(cat.id)}
                  style={styles.deleteBtn}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <h3 style={styles.subtitle}>Categorias de Entrada</h3>
        <div style={styles.categoryList}>
          {categoriasEntrada.length === 0 ? (
            <p style={styles.empty}>Nenhuma categoria de entrada</p>
          ) : (
            categoriasEntrada.map(cat => (
              <div key={cat.id} style={styles.categoryItem}>
                <span>{cat.nome}</span>
                <button
                  onClick={() => handleDelete(cat.id)}
                  style={styles.deleteBtn}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <button onClick={onClose} style={styles.closeBtn}>
          Fechar
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
  },
  title: {
    color: '#003366',
    marginBottom: '20px'
  },
  subtitle: {
    color: '#003366',
    fontSize: '16px',
    marginTop: '20px',
    marginBottom: '10px'
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
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  divider: {
    border: 'none',
    borderTop: '2px solid #003366',
    margin: '20px 0'
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px'
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '18px'
  },
  closeBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#6c757d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px'
  },
  empty: {
    color: '#999',
    textAlign: 'center',
    padding: '10px'
  }
};
