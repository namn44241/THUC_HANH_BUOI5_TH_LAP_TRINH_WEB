export interface BudgetCategory {
  name: string;
  amount: number;
  color: string;
}

export interface Budget {
  total: number;
  spent: number;
  categories: BudgetCategory[];
}

export const defaultBudgetCategories: BudgetCategory[] = [
  { name: 'Lưu trú', amount: 0, color: '#1890ff' },
  { name: 'Ăn uống', amount: 0, color: '#52c41a' },
  { name: 'Di chuyển', amount: 0, color: '#faad14' },
  { name: 'Hoạt động', amount: 0, color: '#722ed1' },
  { name: 'Khác', amount: 0, color: '#f5222d' },
]; 