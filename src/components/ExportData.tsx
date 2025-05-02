import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFinance } from '@/contexts/FinanceContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Download, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
// Import the autoTable type declarations
import 'jspdf-autotable';

const ExportData: React.FC = () => {
  const [dataType, setDataType] = useState<'all' | 'income' | 'expense'>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');
  const [isExporting, setIsExporting] = useState(false);

  const { state, getFilteredTransactions } = useFinance();

  const getDataToExport = () => {
    let transactions = state.transactions || [];
    
    // Filtrar por tipo de transação
    if (dataType === 'income') {
      transactions = transactions.filter(t => t.type === 'income');
    } else if (dataType === 'expense') {
      transactions = transactions.filter(t => t.type === 'expense');
    }
    
    // Filtrar por data
    if (startDate) {
      transactions = transactions.filter(t => new Date(t.date) >= startDate);
    }
    if (endDate) {
      transactions = transactions.filter(t => new Date(t.date) <= endDate);
    }
    
    // Mapear para o formato de exportação
    return transactions.map(t => ({
      Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
      Descrição: t.description,
      Categoria: t.category,
      'Método de Pagamento': t.paymentMethod,
      Valor: t.type === 'expense' ? `-${t.amount}` : t.amount,
      Data: format(new Date(t.date), 'dd/MM/yyyy'),
      Contato: t.contact || '-'
    }));
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const data = getDataToExport();
      
      if (data.length === 0) {
        toast.error("Sem dados para exportar", {
          description: "Não há transações para exportar com os filtros selecionados."
        });
        return;
      }
      
      // Criar uma nova planilha
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transações");
      
      // Gerar nome do arquivo com data
      const fileName = `transacoes_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
      
      // Salvar arquivo
      XLSX.writeFile(wb, fileName);
      
      toast.success("Exportação concluída", {
        description: `Arquivo Excel "${fileName}" baixado com sucesso.`
      });
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      toast.error("Erro na exportação", {
        description: "Ocorreu um erro ao exportar os dados para Excel."
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const data = getDataToExport();
      
      if (data.length === 0) {
        toast.error("Sem dados para exportar", {
          description: "Não há transações para exportar com os filtros selecionados."
        });
        return;
      }
      
      // Criar documento PDF
      const doc = new jsPDF();
      
      // Adicionar título
      doc.setFontSize(18);
      doc.text("Relatório de Transações", 14, 22);
      
      // Adicionar filtros aplicados
      doc.setFontSize(11);
      let yPos = 30;
      
      doc.text(`Tipo: ${dataType === 'all' ? 'Todas' : dataType === 'income' ? 'Receitas' : 'Despesas'}`, 14, yPos);
      yPos += 6;
      
      if (startDate && endDate) {
        doc.text(`Período: ${format(startDate, 'dd/MM/yyyy')} a ${format(endDate, 'dd/MM/yyyy')}`, 14, yPos);
        yPos += 6;
      } else if (startDate) {
        doc.text(`A partir de: ${format(startDate, 'dd/MM/yyyy')}`, 14, yPos);
        yPos += 6;
      } else if (endDate) {
        doc.text(`Até: ${format(endDate, 'dd/MM/yyyy')}`, 14, yPos);
        yPos += 6;
      }
      
      // Adicionar data e hora da exportação
      doc.text(`Exportado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, yPos);
      yPos += 10;
      
      // Preparar dados para a tabela
      const tableColumn = ["Tipo", "Descrição", "Categoria", "Valor", "Data"];
      const tableRows = data.map(item => [
        item.Tipo,
        item.Descrição,
        item.Categoria,
        item.Valor.toString(),
        item.Data
      ]);
      
      // Usar autoTable com tipagem correta
      doc.autoTable({
        startY: yPos,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 9 }
      });
      
      // Gerar nome do arquivo com data
      const fileName = `transacoes_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
      
      // Salvar arquivo
      doc.save(fileName);
      
      toast.success("Exportação concluída", {
        description: `Arquivo PDF "${fileName}" baixado com sucesso.`
      });
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro na exportação", {
        description: "Ocorreu um erro ao exportar os dados para PDF."
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExport = () => {
    if (exportFormat === 'excel') {
      handleExportExcel();
    } else {
      handleExportPDF();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exportar Dados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="data-type" className="text-sm font-medium">
            Tipo de Dados
          </label>
          <Select value={dataType} onValueChange={(value: 'all' | 'income' | 'expense') => setDataType(value)}>
            <SelectTrigger id="data-type">
              <SelectValue placeholder="Selecione o tipo de dados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as transações</SelectItem>
              <SelectItem value="income">Apenas receitas</SelectItem>
              <SelectItem value="expense">Apenas despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="start-date" className="text-sm font-medium">
              Data Inicial
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label htmlFor="end-date" className="text-sm font-medium">
              Data Final
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="end-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => (startDate ? date < startDate : false)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="export-format" className="text-sm font-medium">
            Formato de Exportação
          </label>
          <Select value={exportFormat} onValueChange={(value: 'excel' | 'pdf') => setExportFormat(value)}>
            <SelectTrigger id="export-format">
              <SelectValue placeholder="Selecione o formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel (.xlsx)</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 flex flex-col space-y-4">
          <Button 
            onClick={handleExport} 
            className="w-full" 
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {exportFormat === 'excel' ? 'Exportar para Excel' : 'Exportar para PDF'}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>
              Nota: Os dados serão exportados conforme os filtros selecionados.
              {startDate && endDate && ` Período: ${format(startDate, "dd/MM/yyyy")} até ${format(endDate, "dd/MM/yyyy")}.`}
              {!startDate && !endDate && ' Nenhum filtro de data aplicado.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportData;
