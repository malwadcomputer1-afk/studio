'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense, Payment, Staff } from './types';
import { format } from 'date-fns';

const generatePdf = (title: string, head: any[], body: any[], fileName: string) => {
  const doc = new jsPDF();

  doc.text(title, 14, 20);
  autoTable(doc, {
    head,
    body,
    startY: 25,
    theme: 'striped',
    headStyles: { fillColor: [107, 142, 35] }, // Olive Drab
  });

  doc.save(`${fileName}.pdf`);
};

export const generateExpensesPdf = (expenses: Expense[]) => {
  const head = [['Date', 'Service', 'Amount']];
  const body = expenses.map(exp => [
    format(new Date(exp.date), 'MMM d, yyyy'),
    exp.service,
    exp.amount.toLocaleString(),
  ]);
  
  generatePdf('Expense Report', head, body, `expense-report-${format(new Date(), 'yyyy-MM-dd')}`);
};

export const generatePaymentsPdf = (payments: Payment[], staff: Staff[]) => {
    const staffMap = new Map(staff.map(s => [s.id, s.name]));
    
    // A report is for a single staff member if only one staff member is provided
    // and all payments belong to them.
    const isSingleStaffReport = staff.length === 1 && payments.every(p => p.staffId === staff[0].id);

    const reportTitle = isSingleStaffReport
        ? `Payment Report for ${staff[0].name}` 
        : 'Salary Payments Report';
    
    const fileName = isSingleStaffReport
      ? `payment-report-${staff[0].name.toLowerCase().replace(/ /g, '-')}-${format(new Date(), 'yyyy-MM-dd')}`
      : `payments-report-all-${format(new Date(), 'yyyy-MM-dd')}`;

    const head = isSingleStaffReport
      ? [['Date', 'Amount', 'Notes']]
      : [['Date', 'Staff Member', 'Amount', 'Notes']];
      
    const body = payments.map(p => {
        if (isSingleStaffReport) {
            return [
                format(new Date(p.date), 'MMM d, yyyy'),
                p.amount.toLocaleString(),
                p.notes || '',
            ];
        }
        return [
            format(new Date(p.date), 'MMM d, yyyy'),
            staffMap.get(p.staffId) || 'Unknown',
            p.amount.toLocaleString(),
            p.notes || '',
        ];
    });

    generatePdf(reportTitle, head, body, fileName);
};
