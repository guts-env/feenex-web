import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type IAddManualExpenseFormValues, AddManualExpenseSchema } from '../schema/expenses';
import { ExpenseStatusEnum } from '@/constants/enums';

export const useAddManualExpenseForm = () => {
  return useForm<IAddManualExpenseFormValues>({
    resolver: zodResolver(AddManualExpenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      status: ExpenseStatusEnum.DRAFT,
      merchantName: '',
      amount: undefined,
      categoryId: '',
    },
  });
};
