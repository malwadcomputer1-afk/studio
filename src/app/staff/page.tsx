'use client';
import { PageHeader } from '@/app/components/page-header';
import { Button } from '@/components/ui/button';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { Staff } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { useState } from 'react';
import { StaffForm } from './components/staff-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StaffList } from './components/staff-list';

export default function StaffPage() {
  const [staff, setStaff] = useLocalStorage<Staff[]>('staff', initialData.staff);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | undefined>(undefined);

  const handleFormSubmit = (values: Omit<Staff, 'id'>) => {
    if (editingStaff) {
      setStaff(staff.map((s) => (s.id === editingStaff.id ? { ...editingStaff, ...values } : s)));
    } else {
      setStaff([...staff, { ...values, id: crypto.randomUUID() }]);
    }
    closeDialog();
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (staffId: string) => {
    setStaff(staff.filter((s) => s.id !== staffId));
  }

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingStaff(undefined);
  }

  return (
    <>
      <PageHeader title="Staff Management" description="Manage your farm staff details.">
        <Button onClick={() => { setEditingStaff(undefined); setIsDialogOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Staff
        </Button>
      </PageHeader>

      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          </DialogHeader>
          <StaffForm 
            onSubmit={handleFormSubmit}
            onCancel={closeDialog}
            staff={editingStaff}
          />
        </DialogContent>
      </Dialog>
      
      {/* Mobile view */}
      <div className="md:hidden">
        <StaffList staff={staff} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <DataTable 
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })} 
          data={staff} 
          filterColumn={{id: 'name', placeholder: 'Filter by name...'}}
        />
      </div>
    </>
  );
}
