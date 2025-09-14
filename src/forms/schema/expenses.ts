import { ExpenseStatusEnum } from '@/constants/enums';
import { z } from 'zod';

export const AddManualExpenseSchema = z.object({
  merchantName: z.string().min(1, 'Merchant name is required'),
  amount: z
    .number('Amount is required')
    .min(0.01, 'Amount must be greater than 0')
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: 'Amount must have at most 2 decimal places',
    }),
  date: z.string().min(1, 'Date is required'),
  categoryId: z.string().min(1, 'Category is required'),
  photos: z.array(z.string()).optional(),
  status: z.enum(ExpenseStatusEnum, {
    error: 'Status is required',
  }),
  items: z
    .array(
      z.object({
        name: z.string('Item name is required').min(1, 'Item name is required'),
        quantity: z.number('Quantity is required').min(1, 'Quantity must be at least 1'),
        price: z.number('Price is required').min(0.01, 'Price must be greater than 0'),
      }),
    )
    .optional(),
  otherDetails: z
    .array(
      z.object({
        key: z.string('Label is required').min(1, 'Label is required'),
        value: z.string('Value is required').min(1, 'Value is required'),
      }),
    )
    .optional(),
});

export type IAddManualExpenseFormValues = z.infer<typeof AddManualExpenseSchema>;

export const AddAutoExpenseSchema = z.object({
  photos: z.array(z.string()).min(1, 'Photos are required'),
});

export type IAddAutoExpenseFormValues = z.infer<typeof AddAutoExpenseSchema>;
