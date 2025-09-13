import { type ICategoryListParams } from '@/types/api'

export const CategoryQueryKeys = {
  all: 'categories',
  list: (params?: ICategoryListParams) => [...CategoryQueryKeys.all, 'list', params],
  detail: (id: string) => [...CategoryQueryKeys.all, 'detail', id],
}

export const CategoryEndpoints = {
  list: () => '/categories/',
  create: () => '/categories/',
  detail: (id: string) => `/categories/${id}/`,
  update: (id: string) => `/categories/${id}/`,
  delete: (id: string) => `/categories/${id}/`,
}
