import { useState, useEffect } from 'react';
import { transactionsAPI, categoriesAPI } from '../utils/api';
import { gerarPdfDiario } from '../utils/generatePdf';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import CategoryManager from './CategoryManager';

export default function Dashboard({ usuario, onLogout }) {
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  useEffect(() => {
    carregarTransacoes();
    carregarCategorias();
  }, [dataSelecionada]);

  const carregarTransacoes = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll(dataSelecionada, dataSelecionada);
      setTransacoes(response.data);
    } catch (erro) {
      console.error('Erro ao carregar transações:', erro);
    } finally {
      setLoading(false);
    }
  };

  const carregarCategorias = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategorias(response.data);
    } catch (erro) {
      console.error('Erro ao carregar categorias:', erro);
    }
  };

  const handleNovaTransacao = async () => {
    await carregarTransacoes();
  };

  const handleNovaCategoria = async () => {
    await carregarCategorias();
  };

  const handleDeleteTransacao = async (id) => {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      try {
        await transactionsAPI.delete(id);
        await carregarTransacoes();
      } catch (erro) {
        alert('Erro ao deletar transação');
      }
    }
  };

  const totals = transacoes.reduce((acc, t) => {
    if (t.type === 'entrada') {
      acc.entrada += parseFloat(t.amount);
    } else {
      acc.saida += parseFloat(t.amount);
    }
    return acc;
  }, { entrada: 0, saida: 0 });

  totals.saldo = totals.entrada - totals.saida;

  const handleExportarPdf = () => {
    gerarPdfDiario({
      usuario,
      data: dataSelecionada,
      transacoes,
      totais: totals
    });
  };

  return (
    <div>
      <header style={styles.header}>
        <div className="container">
          <div style={styles.headerContent}>
            <h1>💰 Controle de Caixa</h1>
            <div style={styles.userSection}>
              <span>Bem-vindo, {usuario.name}!</span>
              <button onClick={onLogout} style={styles.logoutBtn}>Sair</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={styles.main}>
        <div style={styles.datePicker}>
          <label>Data:</label>
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            style={styles.dateInput}
          />
        </div>

        <div className="dashboard-cards">
          <div className="card entrada">
            <h3>Entradas</h3>
            <div className="value">R$ {totals.entrada.toFixed(2)}</div>
          </div>
          <div className="card saida">
            <h3>Saídas</h3>
            <div className="value">R$ {totals.saida.toFixed(2)}</div>
          </div>
          <div className="card">
            <h3>Saldo</h3>
            <div className="value" style={{ color: totals.saldo >= 0 ? '#28a745' : '#dc3545' }}>
              R$ {totals.saldo.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={() => setShowCategoryManager(true)} style={styles.btn}>
            ⚙️ Gerenciar Categorias
          </button>
          <button onClick={handleExportarPdf} style={styles.btnPdf}>
            📄 Exportar PDF do Dia
          </button>
        </div>

        {showCategoryManager && (
          <CategoryManager
            categorias={categorias}
            onClose={() => setShowCategoryManager(false)}
            onCategoriaAdicionada={handleNovaCategoria}
          />
        )}

        <TransactionForm
          categorias={categorias}
          onTransacaoAdicionada={handleNovaTransacao}
        />

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <TransactionTable
            transacoes={transacoes}
            onDelete={handleDeleteTransacao}
          />
        )}
      </main>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: '#003366',
    color: '#ffffff',
    padding: '20px 0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userSection: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  main: {
    marginTop: '30px',
    marginBottom: '30px'
  },
  datePicker: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '20px'
  },
  dateInput: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '150px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  btn: {
    backgroundColor: '#003366',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  btnPdf: {
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
