import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
  return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
}

export function gerarPdfDiario({ usuario, data, transacoes, totais }) {
  const doc = new jsPDF();
  const dataFormatada = formatarData(data);

  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text('Controle de Caixa', 105, 20, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Usuário: ${usuario.name}`, 14, 32);
  doc.text(`Email: ${usuario.email}`, 14, 39);
  doc.text(`Data: ${dataFormatada}`, 14, 46);

  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text('Resumo do Dia', 14, 58);

  doc.setFontSize(10);
  doc.setTextColor(40, 167, 69);
  doc.text(`Entradas: ${formatarMoeda(totais.entrada)}`, 14, 66);
  doc.setTextColor(220, 53, 69);
  doc.text(`Saídas: ${formatarMoeda(totais.saida)}`, 14, 73);
  doc.setTextColor(totais.saldo >= 0 ? 40 : 220, totais.saldo >= 0 ? 167 : 53, totais.saldo >= 0 ? 69 : 69);
  doc.text(`Saldo: ${formatarMoeda(totais.saldo)}`, 14, 80);

  if (transacoes.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Nenhuma transação registrada nesta data.', 14, 95);
  } else {
    const linhas = transacoes.map(t => [
      new Date(t.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      t.category_name,
      String(t.category_code),
      t.type === 'entrada' ? 'Entrada' : 'Saída',
      formatarMoeda(t.amount),
      t.description || '-'
    ]);

    autoTable(doc, {
      startY: 88,
      head: [['Hora', 'Categoria', 'Código', 'Tipo', 'Valor', 'Descrição']],
      body: linhas,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 51, 102] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
  }

  const nomeArquivo = `caixa-${usuario.name.replace(/\s+/g, '-').toLowerCase()}-${data}.pdf`;
  doc.save(nomeArquivo);
}
