'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense, Payment, Staff } from './types';
import { format } from 'date-fns';

const generatePdf = (title: string, head: any[], body: any[], fileName: string, total?: number) => {
  const doc = new jsPDF();

  doc.text(title, 14, 20);
  autoTable(doc, {
    head,
    body,
    startY: 25,
    theme: 'striped',
    headStyles: { fillColor: [107, 142, 35] }, // Olive Drab
  });

  if (total !== undefined) {
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${total.toLocaleString()}`, 14, finalY + 10);
  }

  doc.save(`${fileName}.pdf`);
};

export const generateExpensesPdf = (expenses: Expense[]) => {
  const head = [['Service', 'Amount', 'Date']];
  const body = expenses.map(exp => [
    exp.service,
    exp.amount.toLocaleString(),
    format(new Date(exp.date), 'MMM d, yyyy'),
  ]);
  
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  generatePdf('Expense Report', head, body, `expense-report-${format(new Date(), 'yyyy-MM-dd')}`, totalAmount);
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
      ? [['Notes', 'Amount', 'Date']]
      : [['Staff Member', 'Notes', 'Amount', 'Date']];
      
    const body = payments.map(p => {
        if (isSingleStaffReport) {
            return [
                p.notes || '',
                p.amount.toLocaleString(),
                format(new Date(p.date), 'MMM d, yyyy'),
            ];
        }
        return [
            staffMap.get(p.staffId) || 'Unknown',
            p.notes || '',
            p.amount.toLocaleString(),
            format(new Date(p.date), 'MMM d, yyyy'),
        ];
    });
    
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    generatePdf(reportTitle, head, body, fileName, totalAmount);
};
