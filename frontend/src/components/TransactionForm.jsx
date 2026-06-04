import { useState } from 'react';
import { transactionsAPI } from '../utils/api';

export default function TransactionForm({ categorias, onTransacaoAdicionada }) {
  const [formData, setFormData] = useState({
    categoryId: '',
    valor: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.categoryId || !formData.valor) {
      setError('Categoria e valor são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await transactionsAPI.create(
        formData.categoryId,
        formData.valor,
        formData.descricao,
        formData.data
      );

      setFormData({
        categoryId: '',
        valor: '',
        descricao: '',
        data: new Date().toISOString().split('T')[0]
      });

      onTransacaoAdicionada();
    } catch (erro) {
      setError(erro.response?.data?.error || 'Erro ao criar transação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>➕ Registrar Transação</h2>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Categoria</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome} ({cat.tipo === 'entrada' ? '↓ Entrada' : '↑ Saída'})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Descrição (opcional)</label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="ex: Venda de produtos..."
            />
          </div>
        </div>

        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? 'Adicionando...' : 'Adicionar Transação'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '2px solid #003366',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  title: {
    color: '#003366',
    marginBottom: '20px',
    fontSize: '20px'
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
    backgroundColor: '#003366',
    color: '#ffffff',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    width: '100%'
  }
};
