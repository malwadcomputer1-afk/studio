'use server';
/**
 * @fileOverview An AI agent for calculating staff salaries.
 *
 * - calculateSalary - A function that handles the AI-powered salary calculation process.
 * - CalculateSalaryInput - The input type for the calculateSalary function.
 * - CalculateSalaryOutput - The return type for the calculateSalary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AttendanceRecordSchema = z.object({
  date: z.string().describe('The date of the attendance record in YYYY-MM-DD format.'),
  status: z
    .enum(['Present', 'Absent', 'Half-Day', 'Overtime'])
    .describe('The attendance status for the day.'),
  hoursWorked: z.number().optional().describe('Number of hours worked on this day, applicable for Present/Overtime.'),
  overtimeHours: z.number().optional().describe('Number of overtime hours for the day.'),
});

const DeductionSchema = z.object({
  description: z.string().describe('Description of the deduction.'),
  amount: z.number().describe('Amount of the deduction.'),
});

const CalculateSalaryInputSchema = z.object({
  staffName: z.string().describe('The name of the staff member.'),
  hourlyRate: z.number().describe('The staff member\'s hourly rate.'),
  standardWorkHoursPerDay: z.number().default(8).describe('Standard working hours per full day.'),
  halfDayHours: z.number().optional().describe('Optional: Hours counted for a half-day, if different from standardWorkHoursPerDay / 2.'),
  overtimeRateMultiplier: z.number().default(1.5).describe('Multiplier for overtime hours, e.g., 1.5 for time and a half.'),
  attendanceRecords: z.array(AttendanceRecordSchema).describe('A list of daily attendance records for the pay period.'),
  deductions: z.array(DeductionSchema).optional().describe('A list of deductions for the staff member.'),
});
export type CalculateSalaryInput = z.infer<typeof CalculateSalaryInputSchema>;

const CalculateSalaryOutputSchema = z.object({
  calculatedSalary: z.number().describe('The total calculated salary.'),
  calculationBreakdown: z.string().describe('A detailed, human-readable breakdown of how the salary was calculated.'),
});
export type CalculateSalaryOutput = z.infer<typeof CalculateSalaryOutputSchema>;

export async function calculateSalary(input: CalculateSalaryInput): Promise<CalculateSalaryOutput> {
  return calculateSalaryFlow(input);
}

const calculateSalaryPrompt = ai.definePrompt({
  name: 'calculateSalaryPrompt',
  input: { schema: CalculateSalaryInputSchema },
  output: { schema: CalculateSalaryOutputSchema },
  prompt: `You are an expert payroll specialist tasked with calculating a staff member's salary.

Calculate the total salary for {{{staffName}}} based on the following information:

Staff Name: {{{staffName}}}
Hourly Rate: {{{hourlyRate}}} per hour
Standard Work Hours per Full Day: {{{standardWorkHoursPerDay}}} hours
{{#if halfDayHours}}Half-Day Hours: {{{halfDayHours}}} hours{{/if}}
Overtime Rate Multiplier: {{{overtimeRateMultiplier}}}

Attendance Records:
{{#each attendanceRecords}}
- Date: {{{date}}}, Status: {{{status}}}{{#if hoursWorked}}, Hours Worked: {{{hoursWorked}}}{{/if}}{{#if overtimeHours}}, Overtime Hours: {{{overtimeHours}}}{{/if}}
{{/each}}

{{#if deductions.length}}
Deductions:
{{#each deductions}}
- Description: {{{description}}}, Amount: {{{amount}}}
{{/each}}
{{else}}
No deductions.
{{/if}}

Instructions:
1. For 'Present' days, assume {{{standardWorkHoursPerDay}}} hours worked unless 'hoursWorked' is specified.
2. For 'Half-Day' status, assume {{{halfDayHours}} or ({{{standardWorkHoursPerDay}}} / 2)}} hours worked.
3. For 'Overtime' status, consider 'overtimeHours' at the 'overtimeRateMultiplier' times the 'hourlyRate'. Also account for base hours worked if specified, or assume {{{standardWorkHoursPerDay}}} hours otherwise.
4. 'Absent' days contribute 0 hours.
5. Sum up all earnings from regular and overtime hours.
6. Subtract any specified deductions.
7. Provide a detailed, step-by-step breakdown of your calculation, showing how you arrived at the final salary. Highlight total regular hours, total overtime hours, total earnings, and total deductions.
`,
});

const calculateSalaryFlow = ai.defineFlow(
  {
    name: 'calculateSalaryFlow',
    inputSchema: CalculateSalaryInputSchema,
    outputSchema: CalculateSalaryOutputSchema,
  },
  async (input) => {
    const { output } = await calculateSalaryPrompt(input);
    return output!;
  }
);
