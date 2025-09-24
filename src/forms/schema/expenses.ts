import { ExpenseStatusEnum } from '@/constants/enums';
import { isBefore, isEqual } from 'date-fns';
import { z } from 'zod';

export const AddManualExpenseSchema = z
  .object({
    orNumber: z.string().optional(),
    merchantName: z.string().min(1, 'Merchant name is required'),
    amount: z
      .number('Amount is required')
      .min(0.01, 'Amount must be greater than 0')
      .max(999999.99, 'Amount must not exceed 999,999.99')
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Amount must have at most 2 decimal places',
      }),
    vat: z.number().optional(),
    isVat: z.boolean().optional(),
    categoryId: z.string().min(1, 'Category is required'),
    photos: z.array(z.string()).optional(),
    status: z.enum(ExpenseStatusEnum, {
      error: 'Status is required',
    }),
    invoiceDate: z.string().min(1, 'Invoice date is required'),
    paymentDate: z.string().optional(),
    items: z
      .array(
        z.object({
          name: z.string('Item name is required').min(1, 'Item name is required'),
          quantity: z.number('Quantity is required').min(1, 'Quantity must be at least 1'),
          price: z.number('Price is required').min(0.01, 'Price must be greater than 0'),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.paymentDate) return true;

      const invoice = new Date(data.invoiceDate);
      const payment = new Date(data.paymentDate);

      return isBefore(invoice, payment) || isEqual(invoice, payment);
    },
    {
      message: 'Invoice date cannot be later than payment date',
      path: ['invoiceDate'],
    },
  )
  .refine(
    (data) => {
      if (!data.isVat) return true;
      return data.vat && data.vat >= 0.01;
    },
    {
      message: 'VAT must be at least 0.01 for vatable expenses',
      path: ['vat'],
    },
  );

export type IAddManualExpenseFormValues = z.infer<typeof AddManualExpenseSchema>;

export const AddAutoExpenseSchema = z.object({
  photos: z.array(z.string()).min(1, 'Photos are required'),
});

export type IAddAutoExpenseFormValues = z.infer<typeof AddAutoExpenseSchema>;

export const AddMultipleAutoExpensesSchema = z.object({
  expenses: z
    .array(
      z.object({
        id: z.string(),
        photos: z.array(z.string()).min(1, 'At least one photo is required for each expense'),
      }),
    )
    .min(1, 'At least one expense is required'),
});

export type IAddMultipleAutoExpensesFormValues = z.infer<typeof AddMultipleAutoExpensesSchema>;
