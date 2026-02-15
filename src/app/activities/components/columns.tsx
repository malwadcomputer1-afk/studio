'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Activity } from '@/lib/types';
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
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
};

export const getColumns = ({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<Activity>[] => [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => format(new Date(row.getValue('date')), 'MMM d, yyyy')
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const activity = row.original;

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
                <DropdownMenuItem onClick={() => onEdit(activity)}>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(activity.id)}
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
