import { PageHeader } from '@/app/components/page-header';
import { SalaryCalculator } from './components/salary-calculator';

export default function SalaryPage() {
  return (
    <>
      <PageHeader
        title="AI-Powered Salary Calculation"
        description="Calculate staff salaries based on attendance, rates, and deductions."
      />
      <SalaryCalculator />
    </>
  );
}
