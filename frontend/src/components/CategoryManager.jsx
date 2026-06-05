import { useState } from 'react';
import { categoriesAPI } from '../utils/api';

export default function CategoryManager({ categorias, onClose, onCategoriaAdicionada }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'saída'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    if (name === 'type') {
      updated.code = '';
    }
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    const code = parseInt(formData.code, 10);
    if (!formData.code || isNaN(code) || code < 9500 || code > 9599) {
      setError('Código deve ser um número entre 9500 e 9599');
      return;
    }

    setLoading(true);
    try {
      await categoriesAPI.create(formData.name, code, formData.type);
      setFormData({ name: '', code: '', type: 'saída' });
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
      } catch {
        alert('Erro ao deletar categoria');
      }
    }
  };

  const codigosUsados = categorias
    .filter(c => c.type === formData.type)
    .map(c => c.code);

  const codigosDisponiveis = Array.from({ length: 100 }, (_, i) => 9500 + i)
    .filter(code => !codigosUsados.includes(code));

  const categoriasSaida = categorias.filter(c => c.type === 'saída');
  const categoriasEntrada = categorias.filter(c => c.type === 'entrada');

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
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ex: Aluguel, Internet, Venda..."
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="saída">Saída</option>
              <option value="entrada">Entrada</option>
            </select>
          </div>

          <div className="form-group">
            <label>Código (9500-9599)</label>
            <select name="code" value={formData.code} onChange={handleChange} required>
              <option value="">
                {codigosDisponiveis.length === 0
                  ? 'Nenhum código disponível para este tipo'
                  : 'Selecione um código'}
              </option>
              {codigosDisponiveis.map(code => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || codigosDisponiveis.length === 0}
            style={styles.submitBtn}
          >
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
                <span>{cat.name} <small style={{ color: '#666' }}>(Código: {cat.code})</small></span>
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
                <span>{cat.name} <small style={{ color: '#666' }}>(Código: {cat.code})</small></span>
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
