import type { IExpenseListParams, IExpensesTotal } from '@/types/api';

export const ExpenseQueryKeys = {
  all: 'expense',
  list: (params: IExpenseListParams) => [...ExpenseQueryKeys.all, 'list', params],
  detail: (id: string) => [...ExpenseQueryKeys.all, 'detail', id],
  total: (params: IExpensesTotal) => [...ExpenseQueryKeys.all, 'total', params],
};

export const ExpenseEndpoints = {
  list: () => '/expenses/',
  detail: (id: string) => `/expenses/${id}/`,
  createManual: () => '/expenses/',
  createAuto: () => '/expenses/auto/',
  update: (id: string) => `/expenses/${id}/`,
  verify: (id: string) => `/expenses/${id}/verify/`,
  delete: (id: string) => `/expenses/${id}/`,
  total: () => '/expenses/total/',
};
