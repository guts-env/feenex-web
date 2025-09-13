import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AddCategorySchema,
  UpdateCategorySchema,
  type IUpdateCategoryFormValues,
  type IAddCategoryFormValues,
} from '@/forms/schema/categories'

export const useAddCategoryForm = () => {
  return useForm<IAddCategoryFormValues>({
    resolver: zodResolver(AddCategorySchema),
    defaultValues: {
      name: '',
    },
  })
}

export const useUpdateCategoryForm = () => {
  return useForm<IUpdateCategoryFormValues>({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: {
      name: '',
    },
  })
}
