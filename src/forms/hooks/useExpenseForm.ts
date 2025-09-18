import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  type IAddAutoExpenseFormValues,
  type IAddManualExpenseFormValues,
  type IAddMultipleAutoExpensesFormValues,
  AddAutoExpenseSchema,
  AddManualExpenseSchema,
  AddMultipleAutoExpensesSchema,
} from '@/forms/schema/expenses';
import { ExpenseStatusEnum } from '@/constants/enums';

export const useAddManualExpenseForm = () => {
  return useForm<IAddManualExpenseFormValues>({
    resolver: zodResolver(AddManualExpenseSchema),
    defaultValues: {
      amount: 0,
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
      items: undefined,
      merchantName: '',
      otherDetails: undefined,
      photos: undefined,
      status: ExpenseStatusEnum.DRAFT,
    },
  });
};

export const useEditExpenseForm = (defaultValues: IAddManualExpenseFormValues) => {
  return useForm<IAddManualExpenseFormValues>({
    resolver: zodResolver(AddManualExpenseSchema),
    defaultValues: {
      ...defaultValues,
    },
  });
};

export const useAddAutoExpenseForm = () => {
  return useForm<IAddAutoExpenseFormValues>({
    resolver: zodResolver(AddAutoExpenseSchema),
    defaultValues: {
      photos: undefined,
    },
  });
};

export const useAddMultipleAutoExpensesForm = () => {
  return useForm<IAddMultipleAutoExpensesFormValues>({
    resolver: zodResolver(AddMultipleAutoExpensesSchema),
    defaultValues: {
      expenses: [
        { id: '1', photos: [] },
        { id: '2', photos: [] },
      ],
    },
  });
};
