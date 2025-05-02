
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface ExportFormatButtonProps {
  isExporting: boolean;
  exportFormat: 'excel' | 'pdf';
  onExport: () => void;
}

const ExportFormatButton: React.FC<ExportFormatButtonProps> = ({ isExporting, exportFormat, onExport }) => {
  return (
    <Button 
      onClick={onExport} 
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
  );
};

export default ExportFormatButton;
