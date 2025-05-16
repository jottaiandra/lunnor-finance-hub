
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Transaction } from '@/types';
import { toast } from '@/components/ui/sonner';

interface ExportFilters {
  dataType: 'all' | 'income' | 'expense';
  startDate?: Date;
  endDate?: Date;
}

export const getDataToExport = (transactions: Transaction[], filters: ExportFilters) => {
  let filteredTransactions = [...transactions];
  
  // Filter by transaction type
  if (filters.dataType === 'income') {
    filteredTransactions = filteredTransactions.filter(t => t.type === 'income');
  } else if (filters.dataType === 'expense') {
    filteredTransactions = filteredTransactions.filter(t => t.type === 'expense');
  }
  
  // Filter by date
  if (filters.startDate) {
    filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= filters.startDate!);
  }
  if (filters.endDate) {
    filteredTransactions = filteredTransactions.filter(t => new Date(t.date) <= filters.endDate!);
  }
  
  // Map to the export format
  return filteredTransactions.map(t => ({
    Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
    Descrição: t.description,
    Categoria: t.category,
    'Método de Pagamento': t.paymentMethod,
    Valor: t.type === 'expense' ? `-${t.amount}` : t.amount,
    Data: format(new Date(t.date), 'dd/MM/yyyy'),
    Contato: t.contact || '-'
  }));
};

export const exportToExcel = async (transactions: Transaction[], filters: ExportFilters) => {
  try {
    const data = getDataToExport(transactions, filters);
    
    if (data.length === 0) {
      toast.error("Sem dados para exportar", {
        description: "Não há transações para exportar com os filtros selecionados."
      });
      return false;
    }
    
    // Create a new spreadsheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transações");
    
    // Generate filename with date
    const fileName = `transacoes_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, fileName);
    
    toast.success("Exportação concluída", {
      description: `Arquivo Excel "${fileName}" baixado com sucesso.`
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao exportar Excel:", error);
    toast.error("Erro na exportação", {
      description: "Ocorreu um erro ao exportar os dados para Excel."
    });
    return false;
  }
};

export const exportToPDF = async (transactions: Transaction[], filters: ExportFilters) => {
  try {
    const data = getDataToExport(transactions, filters);
    
    if (data.length === 0) {
      toast.error("Sem dados para exportar", {
        description: "Não há transações para exportar com os filtros selecionados."
      });
      return false;
    }
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Relatório de Transações", 14, 22);
    
    // Add applied filters
    doc.setFontSize(11);
    let yPos = 30;
    
    doc.text(`Tipo: ${filters.dataType === 'all' ? 'Todas' : filters.dataType === 'income' ? 'Receitas' : 'Despesas'}`, 14, yPos);
    yPos += 6;
    
    if (filters.startDate && filters.endDate) {
      doc.text(`Período: ${format(filters.startDate, 'dd/MM/yyyy')} a ${format(filters.endDate, 'dd/MM/yyyy')}`, 14, yPos);
      yPos += 6;
    } else if (filters.startDate) {
      doc.text(`A partir de: ${format(filters.startDate, 'dd/MM/yyyy')}`, 14, yPos);
      yPos += 6;
    } else if (filters.endDate) {
      doc.text(`Até: ${format(filters.endDate, 'dd/MM/yyyy')}`, 14, yPos);
      yPos += 6;
    }
    
    // Add export date and time
    doc.text(`Exportado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, yPos);
    yPos += 10;
    
    // Prepare data for the table
    const tableColumn = ["Tipo", "Descrição", "Categoria", "Valor", "Data"];
    const tableRows = data.map(item => [
      item.Tipo,
      item.Descrição,
      item.Categoria,
      item.Valor.toString(),
      item.Data
    ]);
    
    // Use autoTable with correct typing
    doc.autoTable({
      startY: yPos,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 9 }
    });
    
    // Generate filename with date
    const fileName = `transacoes_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
    
    // Save file
    doc.save(fileName);
    
    toast.success("Exportação concluída", {
      description: `Arquivo PDF "${fileName}" baixado com sucesso.`
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao exportar PDF:", error);
    toast.error("Erro na exportação", {
      description: "Ocorreu um erro ao exportar os dados para PDF."
    });
    return false;
  }
};
