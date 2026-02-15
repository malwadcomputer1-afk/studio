'use client';
import { PageHeader } from '@/app/components/page-header';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { Payment, Staff } from '@/lib/types';
import { getColumns } from './components/columns';
import { DataTable } from '@/app/staff/components/data-table';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PaymentForm } from './components/payment-form';
import { PaymentList } from './components/payment-list';

export default function PaymentsPage() {
  const [payments, setPayments] = useLocalStorage<Payment[]>('payments', initialData.payments);
  const [staff] = useLocalStorage<Staff[]>('staff', initialData.staff);
  const [open, setOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | undefined>(undefined);

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setOpen(true);
  };

  const handleDelete = (paymentId: string) => {
    setPayments(payments.filter((p) => p.id !== paymentId));
  };
  
  const columns = getColumns({ staff, onEdit: handleEdit, onDelete: handleDelete });

  const closeDialog = () => {
    setOpen(false);
    setEditingPayment(undefined);
  }

  const handleFormSubmit = (values: Omit<Payment, 'id'>) => {
    if (editingPayment) {
      setPayments(payments.map(p => p.id === editingPayment.id ? { ...editingPayment, ...values, amount: Number(values.amount) } : p));
    } else {
      setPayments([...payments, { ...values, id: crypto.randomUUID(), amount: Number(values.amount) }]);
    }
    closeDialog();
  };

  return (
    <>
      <PageHeader
        title="Payment Tracking"
        description="Record and view salary payments."
      >
        <Button onClick={() => { setEditingPayment(undefined); setOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Payment
        </Button>
      </PageHeader>
      
      <Dialog open={open} onOpenChange={ (isOpen) => { if (!isOpen) closeDialog(); else setOpen(true); }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingPayment ? 'Edit Payment' : 'Add New Payment'}</DialogTitle>
            </DialogHeader>
            <PaymentForm 
              staff={staff}
              onSubmit={handleFormSubmit}
              onCancel={closeDialog}
              payment={editingPayment} 
            />
          </DialogContent>
      </Dialog>
      
      {/* Mobile View */}
      <div className="md:hidden">
        <PaymentList payments={payments} staff={staff} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DataTable 
          columns={columns} 
          data={payments} 
        />
      </div>
    </>
  );
}
