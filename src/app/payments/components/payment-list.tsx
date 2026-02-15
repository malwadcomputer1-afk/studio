'use client';

import { Payment, Staff } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentListProps {
  payments: Payment[];
  staff: Staff[];
  onEdit: (payment: Payment) => void;
  onDelete: (paymentId: string) => void;
}

export function PaymentList({ payments, staff, onEdit, onDelete }: PaymentListProps) {
  const staffMap = new Map(staff.map((s) => [s.id, s.name]));

  if (payments.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-center text-muted-foreground">
        No results.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
            <div>
              <CardTitle className="text-base font-semibold">{staffMap.get(payment.staffId) || 'Unknown Staff'}</CardTitle>
              <p className="text-sm text-muted-foreground">{format(new Date(payment.date), 'MMM d, yyyy')}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu for payment to {staffMap.get(payment.staffId)}</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(payment)}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(payment.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-lg font-medium">₹{payment.amount.toLocaleString()}</p>
            {payment.notes && <p className="text-sm text-muted-foreground pt-1">{payment.notes}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
