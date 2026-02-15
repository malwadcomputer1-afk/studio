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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function StaffPage() {
  const [staff, setStaff] = useLocalStorage<Staff[]>('staff', initialData.staff);
  const [open, setOpen] = useState(false);

  const addStaffMember = (newStaffMember: Omit<Staff, 'id'>) => {
    setStaff([...staff, { ...newStaffMember, id: crypto.randomUUID() }]);
    setOpen(false);
  };

  const updateStaffMember = (updatedStaffMember: Staff) => {
    setStaff(
      staff.map((s) => (s.id === updatedStaffMember.id ? updatedStaffMember : s))
    );
  };
  
  const deleteStaffMember = (staffId: string) => {
    setStaff(staff.filter((s) => s.id !== staffId));
  }


  return (
    <>
      <PageHeader title="Staff Management" description="Manage your farm staff details.">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <StaffForm onSubmit={addStaffMember} />
          </DialogContent>
        </Dialog>
      </PageHeader>
      <DataTable 
        columns={columns({ onEdit: updateStaffMember, onDelete: deleteStaffMember })} 
        data={staff} 
        filterColumn={{id: 'name', placeholder: 'Filter by name...'}}
      />
    </>
  );
}
