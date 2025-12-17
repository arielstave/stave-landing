
export interface StaveCommand {
  type: 'recurring' | 'onetime' | 'modifier';
  name: string;
  value: number;
  isPercent: boolean;
  frequency?: string; // e.g., 'dec' or 'monthly'
  category: 'income' | 'fixed' | 'variable';
}

export interface MonthlyProjection {
  month: string;
  opening: number;
  income: number;
  fixed: number;
  variable: number;
  closing: number;
}
