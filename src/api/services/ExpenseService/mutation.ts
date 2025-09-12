import { useMutation } from '@tanstack/react-query'
import ExpenseService from '@/api/services/ExpenseService/service'

export const useVerifyExpense = () => {
  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      return ExpenseService.verify(id)
    },
  })
}

export const useDeleteExpense = () => {
  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      return ExpenseService.delete(id)
    },
  })
}
