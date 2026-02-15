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

export default function PaymentsPage() {
  const [payments, setPayments] = useLocalStorage<Payment[]>('payments', initialData.payments);
  const [staff] = useLocalStorage<Staff[]>('staff', initialData.staff);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Pending'>('all');

  const updatePaymentStatus = (paymentId: string, status: 'Paid' | 'Pending') => {
    setPayments(
      payments.map((p) => (p.id === paymentId ? { ...p, status } : p))
    );
  };
  
  const columns = getColumns({ staff, onUpdateStatus: updatePaymentStatus });
  
  const filteredPayments = payments.filter(p => statusFilter === 'all' || p.status === statusFilter);

  return (
    <>
      <PageHeader
        title="Payment Tracking"
        description="Record and view salary payments."
      />
      <div className="mb-4 flex justify-end">
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
      </div>
      <DataTable 
        columns={columns} 
        data={filteredPayments} 
      />
    </>
  );
}
