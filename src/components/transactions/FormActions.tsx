
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { TransactionType } from '@/types';

interface FormActionsProps {
  type: TransactionType;
  onCancel?: () => void;
  loading: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ type, onCancel, loading }) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button variant="outline" onClick={onCancel} type="button" disabled={loading}>
          Cancelar
        </Button>
      )}
      <Button 
        type="submit" 
        className={type === TransactionType.INCOME ? "bg-positive hover:bg-positive/80" : "bg-negative hover:bg-negative/80"}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          type === TransactionType.INCOME ? "Adicionar Receita" : "Adicionar Despesa"
        )}
      </Button>
    </div>
  );
};

export default FormActions;
