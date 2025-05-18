
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface GoalFormActionsProps {
  loading: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

const GoalFormActions: React.FC<GoalFormActionsProps> = ({
  loading,
  onCancel,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar"
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button variant="outline" onClick={onCancel} type="button" disabled={loading}>
          {cancelLabel}
        </Button>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
};

export default GoalFormActions;
