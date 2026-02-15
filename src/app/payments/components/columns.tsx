'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Payment, Staff } from '@/lib/types';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type GetColumnsProps = {
  staff: Staff[];
  onUpdateStatus: (paymentId: string, status: 'Paid' | 'Pending') => void;
  onEdit: (payment: Payment) => void;
  onDelete: (paymentId: string) => void;
};

export const getColumns = ({ staff, onUpdateStatus, onEdit, onDelete }: GetColumnsProps): ColumnDef<Payment>[] => [
  {
    accessorKey: 'staffId',
    header: 'Staff Member',
    cell: ({ row }) => {
        const staffMember = staff.find(s => s.id === row.getValue('staffId'));
        return staffMember ? staffMember.name : 'Unknown';
    }
  },
  {
    accessorKey: 'date',
    header: 'Payment Date',
    cell: ({ row }) => format(new Date(row.getValue('date')), 'MMM d, yyyy')
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <Badge variant={status === 'Paid' ? 'default' : 'destructive'} className={status === 'Paid' ? 'bg-green-600' : ''}>{status}</Badge>
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(payment)}>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {payment.status === 'Pending' && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(payment.id, 'Paid')}>
                        Mark as Paid
                    </DropdownMenuItem>
                )}
                 {payment.status === 'Paid' && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(payment.id, 'Pending')}>
                        Mark as Pending
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(payment.id)}
                >
                Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];
