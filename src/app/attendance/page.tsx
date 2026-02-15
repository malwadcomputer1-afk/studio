'use client';

import { PageHeader } from '@/app/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { Attendance, Staff, AttendanceStatus } from '@/lib/types';
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AttendancePage() {
  const [staff] = useLocalStorage<Staff[]>('staff', initialData.staff);
  const [attendance, setAttendance] = useLocalStorage<Attendance[]>(
    'attendance',
    initialData.attendance
  );
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleAttendanceChange = (
    staffId: string,
    status: AttendanceStatus
  ) => {
    if (!date) return;
    const formattedDate = format(date, 'yyyy-MM-dd');
    const existingRecordIndex = attendance.findIndex(
      (a) => a.staffId === staffId && a.date === formattedDate
    );

    let newAttendance = [...attendance];

    if (existingRecordIndex > -1) {
      newAttendance[existingRecordIndex] = {
        ...newAttendance[existingRecordIndex],
        status,
        hoursWorked: status === 'Present' ? 8 : status === 'Half-Day' ? 4 : 0,
      };
    } else {
      newAttendance.push({
        id: crypto.randomUUID(),
        staffId,
        date: formattedDate,
        status,
        hoursWorked: status === 'Present' ? 8 : status === 'Half-Day' ? 4 : 0,
      });
    }
    setAttendance(newAttendance);
  };

  const getAttendanceStatus = (staffId: string): AttendanceStatus => {
    if (!date) return 'Absent';
    const formattedDate = format(date, 'yyyy-MM-dd');
    const record = attendance.find(
      (a) => a.staffId === staffId && a.date === formattedDate
    );
    return record?.status || 'Absent';
  };
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length-1][0]}`;
    }
    return names[0][0];
  }

  return (
    <>
      <PageHeader
        title="Attendance Tracking"
        description="View and manage daily staff attendance."
      />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
            <Card>
                <CardContent className="p-0 sm:p-2">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md"
                        disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                    />
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Attendance for {date ? format(date, 'MMMM d, yyyy') : '...'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staff.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                  >
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/40?u=${s.id}`} />
                            <AvatarFallback>{getInitials(s.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{s.name}</p>
                            <p className="text-sm text-muted-foreground">{s.role}</p>
                        </div>
                    </div>

                    <Select
                      value={getAttendanceStatus(s.id)}
                      onValueChange={(status: AttendanceStatus) =>
                        handleAttendanceChange(s.id, status)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Half-Day">Half-Day</SelectItem>
                        <SelectItem value="Overtime">Overtime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
