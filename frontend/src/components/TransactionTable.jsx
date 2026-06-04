export default function TransactionTable({ transacoes, onDelete }) {
  if (transacoes.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>Nenhuma transação registrada para esta data.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Transações do Dia</h2>
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Categoria</th>
            <th>Código</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map(transacao => (
            <tr key={transacao.id}>
              <td>{new Date(transacao.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
              <td>{transacao.category_name}</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{transacao.category_code}</td>
              <td>
                <span style={{
                  color: transacao.type === 'entrada' ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {transacao.type === 'entrada' ? '↓ Entrada' : '↑ Saída'}
                </span>
              </td>
              <td style={{
                fontWeight: 'bold',
                color: transacao.type === 'entrada' ? '#28a745' : '#dc3545'
              }}>
                R$ {parseFloat(transacao.amount).toFixed(2)}
              </td>
              <td>{transacao.description || '-'}</td>
              <td>
                <button
                  onClick={() => onDelete(transacao.id)}
                  style={styles.deleteBtn}
                  title="Deletar"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '30px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  title: {
    color: '#003366',
    marginBottom: '20px',
    fontSize: '20px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
    fontSize: '16px'
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '5px'
  }
};
