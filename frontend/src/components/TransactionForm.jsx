import { useState } from 'react';
import { transactionsAPI } from '../utils/api';

export default function TransactionForm({ categorias, onTransacaoAdicionada }) {
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [type, setType] = useState('saída');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.category_id || !formData.amount) {
      setError('Categoria e valor são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await transactionsAPI.create(
        formData.category_id,
        formData.amount,
        type,
        formData.description,
        formData.date
      );

      setFormData({
        category_id: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

      onTransacaoAdicionada();
    } catch (erro) {
      setError(erro.response?.data?.error || 'Erro ao criar transação');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar categorias pelo tipo selecionado
  const categoriasFilteradas = categorias.filter(c => c.type === type);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>➕ Registrar Transação</h2>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Tipo</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setFormData({ ...formData, category_id: '' });
              }}
            >
              <option value="entrada">Entrada</option>
              <option value="saída">Saída</option>
            </select>
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categoriasFilteradas.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} (Código: {cat.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Descrição (opcional)</label>
            <input
              type="text"
              name="description"
              value={formData.description}
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
