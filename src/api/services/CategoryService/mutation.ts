import { useMutation } from '@tanstack/react-query'
import CategoryService from '@/api/services/CategoryService/service'
import { type IAddCategoryFormValues, type IUpdateCategoryFormValues } from '@/forms/schema/categories'
import { type ICategoryRes } from '@/types/api'

export const useAddCategory = () => {
  return useMutation({
    mutationFn: (data: IAddCategoryFormValues): Promise<void> => {
      return CategoryService.create(data)
    },
  })
}

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCategoryFormValues }): Promise<ICategoryRes> => {
      return CategoryService.update(id, data)
    },
  })
}

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      return CategoryService.delete(id)
    },
  })
}
