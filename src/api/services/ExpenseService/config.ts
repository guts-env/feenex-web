import type { IExpenseListParams } from '@/types/api'

export const ExpenseQueryKeys = {
  all: 'expense',
  list: (params: IExpenseListParams) => [...ExpenseQueryKeys.all, 'list', params],
  detail: (id: string) => [...ExpenseQueryKeys.all, 'detail', id],
}

export const ExpenseEndpoints = {
  list: () => '/expenses/',
  detail: (id: string) => `/expenses/${id}/`,
  createManual: () => '/expenses/',
  createAuto: () => '/expenses/auto/',
  update: (id: string) => `/expenses/${id}/`,
  verify: (id: string) => `/expenses/${id}/verify/`,
  delete: (id: string) => `/expenses/${id}/`,
}
