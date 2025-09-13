import { useMutation } from '@tanstack/react-query';
import ExpenseService from '@/api/services/ExpenseService/service';
import { type IAddManualExpenseFormValues } from '@/forms/schema/expenses';

export const useCreateManualExpense = () => {
  return useMutation({
    mutationFn: (data: IAddManualExpenseFormValues): Promise<void> => {
      return ExpenseService.createManual(data);
    },
  });
};

export const useVerifyExpense = () => {
  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      return ExpenseService.verify(id);
    },
  });
};

export const useDeleteExpense = () => {
  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      return ExpenseService.delete(id);
    },
  });
};
