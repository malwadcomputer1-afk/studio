'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Staff } from '@/lib/types';
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

type StaffColumnsProps = {
  onEdit: (staff: Staff) => void;
  onDelete: (staffId: string) => void;
};

export const columns = ({
  onEdit,
  onDelete,
}: StaffColumnsProps): ColumnDef<Staff>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'yearlySalary',
    header: 'Yearly Salary',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('yearlySalary'));
      return <div className="font-medium">{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const staff = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(staff.contact)}>
                Copy Contact
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(staff)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(staff.id)}
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
