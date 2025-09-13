import { z } from 'zod'

export const AddCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export type IAddCategoryFormValues = z.infer<typeof AddCategorySchema>

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export type IUpdateCategoryFormValues = z.infer<typeof UpdateCategorySchema>
