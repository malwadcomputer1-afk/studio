'use client';

import { Staff } from '@/lib/types';
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

interface StaffListProps {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (staffId: string) => void;
}

export function StaffList({ staff, onEdit, onDelete }: StaffListProps) {
  if (staff.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-center text-muted-foreground">
        No results.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {staff.map((s) => (
        <Card key={s.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-base font-semibold">{s.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu for {s.name}</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(s)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(s.contact)}>
                  Copy Contact
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(s.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{s.role}</p>
              <p>Salary: <span className="font-mono">₹{s.yearlySalary.toLocaleString()}</span></p>
              <p>Contact: <span className="font-mono">{s.contact}</span></p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
