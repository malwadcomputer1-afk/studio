'use client';

import { PageHeader } from '@/app/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { Attendance, Staff, AttendanceStatus } from '@/lib/types';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';

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

  const staffOnSelectedDate = date ? staff.map(s => {
    const status = getAttendanceStatus(s.id);
    return { ...s, status };
  }) : [];
  
  const attendanceSummary: Record<string, number> = staffOnSelectedDate.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<AttendanceStatus, number>);

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
        // Adding 'T00:00:00' ensures the date is parsed in the user's local timezone
        const newDate = new Date(event.target.value + 'T00:00:00');
        setDate(newDate);
    } else {
        setDate(undefined);
    }
  };

  return (
    <>
      <PageHeader
        title="Attendance Tracking"
        description="Select a date to view and manage daily staff attendance."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
                <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
                <Input
                    type="date"
                    value={date ? format(date, 'yyyy-MM-dd') : ''}
                    onChange={handleDateChange}
                />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 md:row-start-1 md:row-span-2">
          <Card>
              <CardHeader>
              <CardTitle className="text-center">
                  Staff
              </CardTitle>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                  {staff.map((s) => (
                  <div
                      key={s.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between p-2 rounded-md hover:bg-muted gap-2"
                  >
                      <div className="flex items-center gap-4">
                          <Avatar>
                              <AvatarFallback>{getInitials(s.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                              <p className="font-semibold">{s.name}</p>
                              <p className="text-sm text-muted-foreground">{s.role}</p>
                          </div>
                      </div>

                      <div className="w-full md:w-auto mt-2 md:mt-0">
                        <Select
                        value={getAttendanceStatus(s.id)}
                        onValueChange={(status: AttendanceStatus) =>
                            handleAttendanceChange(s.id, status)
                        }
                        disabled={!date}
                        >
                        <SelectTrigger className="w-full md:w-[140px]">
                            <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                            <SelectItem value="Half-Day">Half-Day</SelectItem>
                        </SelectContent>
                        </Select>
                      </div>
                  </div>
                  ))}
              </div>
              </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          {date && (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Summary for {format(date, 'MMMM d')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {(Object.keys(attendanceSummary) as AttendanceStatus[]).filter(status => attendanceSummary[status] > 0).length > 0 ? (
                        (Object.keys(attendanceSummary) as AttendanceStatus[]).map(status => (
                            attendanceSummary[status] > 0 &&
                            <Badge key={status} variant={status === 'Absent' ? 'destructive' : status === 'Present' ? 'default' : 'secondary'} className="flex items-center gap-2 text-sm">
                                <span>{status}</span>
                                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-background/20 text-xs font-bold">{attendanceSummary[status]}</span>
                            </Badge>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm">No attendance recorded for this day.</p>
                    )}
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
