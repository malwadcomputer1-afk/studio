'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Expense } from '@/lib/types';
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
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
};

export const getColumns = ({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<Expense>[] => [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => format(new Date(row.getValue('date')), 'MMM d, yyyy')
  },
  {
    accessorKey: 'service',
    header: 'Service',
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      return <div className="text-right font-medium">{amount.toLocaleString()}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const expense = row.original;

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
                <DropdownMenuItem onClick={() => onEdit(expense)}>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(expense.id)}
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
