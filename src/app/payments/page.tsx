'use client';
import { PageHeader } from '@/app/components/page-header';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { Payment, Staff } from '@/lib/types';
import { getColumns } from './components/columns';
import { DataTable } from '@/app/staff/components/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PaymentForm } from './components/payment-form';

export default function PaymentsPage() {
  const [payments, setPayments] = useLocalStorage<Payment[]>('payments', initialData.payments);
  const [staff] = useLocalStorage<Staff[]>('staff', initialData.staff);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Pending'>('all');
  const [open, setOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | undefined>(undefined);

  const updatePaymentStatus = (paymentId: string, status: 'Paid' | 'Pending') => {
    setPayments(
      payments.map((p) => (p.id === paymentId ? { ...p, status } : p))
    );
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setOpen(true);
  };

  const handleDelete = (paymentId: string) => {
    setPayments(payments.filter((p) => p.id !== paymentId));
  };
  
  const columns = getColumns({ staff, onUpdateStatus: updatePaymentStatus, onEdit: handleEdit, onDelete: handleDelete });
  
  const filteredPayments = payments.filter(p => statusFilter === 'all' || p.status === statusFilter);

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
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(value: 'all' | 'Paid' | 'Pending') => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={ (isOpen) => { if (!isOpen) closeDialog(); else setOpen(true); }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingPayment(undefined); setOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Payment
              </Button>
            </DialogTrigger>
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
        </div>
      </PageHeader>
      
      <DataTable 
        columns={columns} 
        data={filteredPayments} 
      />
    </>
  );
}
