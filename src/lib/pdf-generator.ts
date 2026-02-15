'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense, Payment, Staff, Attendance, AttendanceStatus } from './types';
import { format } from 'date-fns';

const generatePdf = (title: string, head: any[], body: any[], fileName: string, total?: number) => {
  const doc = new jsPDF();

  doc.text(title, 14, 20);
  autoTable(doc, {
    head,
    body,
    startY: 25,
    theme: 'grid',
    headStyles: { fillColor: [107, 142, 35] }, // Olive Drab
  });

  if (total !== undefined) {
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${total}`, 14, finalY + 10);
  }

  doc.save(`${fileName}.pdf`);
};

export const generateExpensesPdf = (expenses: Expense[]) => {
  const head = [['Sr. No.', 'Service', 'Amount', 'Date']];
  const body = expenses.map((exp, index) => [
    index + 1,
    exp.service,
    exp.amount,
    format(new Date(exp.date), 'MMM d, yyyy'),
  ]);
  
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  generatePdf('Expense Report', head, body, `expense-report-${format(new Date(), 'yyyy-MM-dd')}`, totalAmount);
};

export const generatePaymentsPdf = (payments: Payment[], staff: Staff[]) => {
    const staffMap = new Map(staff.map(s => [s.id, s.name]));
    
    const isSingleStaffReport = staff.length === 1 && payments.every(p => p.staffId === staff[0].id);

    const reportTitle = isSingleStaffReport
        ? `Payment Report for ${staff[0].name}` 
        : 'Salary Payments Report';
    
    const fileName = isSingleStaffReport
      ? `payment-report-${staff[0].name.toLowerCase().replace(/ /g, '-')}-${format(new Date(), 'yyyy-MM-dd')}`
      : `payments-report-all-${format(new Date(), 'yyyy-MM-dd')}`;

    const head = isSingleStaffReport
      ? [['Sr. No.', 'Notes', 'Amount', 'Date']]
      : [['Sr. No.', 'Staff Member', 'Notes', 'Amount', 'Date']];
      
    const body = payments.map((p, index) => {
        if (isSingleStaffReport) {
            return [
                index + 1,
                p.notes || '',
                p.amount,
                format(new Date(p.date), 'MMM d, yyyy'),
            ];
        }
        return [
            index + 1,
            staffMap.get(p.staffId) || 'Unknown',
            p.notes || '',
            p.amount,
            format(new Date(p.date), 'MMM d, yyyy'),
        ];
    });
    
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    generatePdf(reportTitle, head, body, fileName, totalAmount);
};

export const generateAttendancePdf = (
  attendance: Attendance[],
  staff: Staff[],
  _month: Date, // No longer used for titling, but kept for function signature consistency
  staffMember?: Staff
) => {
  const staffMap = new Map(staff.map(s => [s.id, s.name]));
  
  const reportTitle = staffMember
    ? `Attendance Report for ${staffMember.name}`
    : `Full Attendance Report`;

  const fileName = staffMember
    ? `attendance-report-${staffMember.name.toLowerCase().replace(/ /g, '-')}-${format(new Date(), 'yyyy-MM-dd')}`
    : `attendance-report-all-${format(new Date(), 'yyyy-MM-dd')}`;

  const head = staffMember
    ? [['Sr. No.', 'Date', 'Status', 'Hours Worked']]
    : [['Sr. No.', 'Date', 'Staff Member', 'Status', 'Hours Worked']];

  // Sort by date descending
  const sortedAttendance = [...attendance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const body = sortedAttendance.map((att, index) => {
    const row: (string | number)[] = [
        index + 1,
        format(new Date(att.date), 'MMM d, yyyy'),
    ];
    if (!staffMember) {
        row.push(staffMap.get(att.staffId) || 'Unknown');
    }
    row.push(
        att.status,
        att.hoursWorked?.toString() || 'N/A'
    );
    return row;
  });

  const doc = new jsPDF();
  doc.text(reportTitle, 14, 20);
  autoTable(doc, {
    head,
    body,
    startY: 25,
    theme: 'grid',
    headStyles: { fillColor: [107, 142, 35] },
  });

  if (staffMember) {
    const summary: Record<AttendanceStatus, number> = {
      'Present': 0,
      'Absent': 0,
      'Half-Day': 0,
      'Overtime': 0,
    };
    attendance.forEach(att => {
        summary[att.status]++;
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, finalY + 10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let summaryY = finalY + 17;
    (Object.keys(summary) as AttendanceStatus[]).forEach(status => {
      if (summary[status] > 0) {
        doc.text(`${status}: ${summary[status]} days`, 14, summaryY);
        summaryY += 7;
      }
    });
  }


  doc.save(`${fileName}.pdf`);
};
