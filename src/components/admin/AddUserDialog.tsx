
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import AddUserForm from './AddUserForm';

interface AddUserDialogProps {
  onUserAdded: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ onUserAdded }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleUserAdded = () => {
    setIsOpen(false);
    onUserAdded();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
        </DialogHeader>
        <AddUserForm
          onSuccess={handleUserAdded}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
