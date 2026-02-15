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

type GetColumnsProps = {
  staff: Staff[];
  onEdit: (payment: Payment) => void;
  onDelete: (paymentId: string) => void;
};

export const getColumns = ({ staff, onEdit, onDelete }: GetColumnsProps): ColumnDef<Payment>[] => [
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
      return <div className="text-right font-medium">{amount.toLocaleString('en-IN')}</div>;
    },
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
