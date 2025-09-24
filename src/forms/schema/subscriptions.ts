import { RecurringFrequencyEnum, SubscriptionStatusEnum } from '@/constants/enums';
import { isBefore, isEqual } from 'date-fns';
import { z } from 'zod';

export const AddSubscriptionSchema = z
  .object({
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
    frequency: z.enum(RecurringFrequencyEnum, {
      error: 'Frequency is required',
    }),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    status: z.enum(SubscriptionStatusEnum, {
      error: 'Status is required',
    }),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;

      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      return isBefore(start, end) || isEqual(start, end);
    },
    {
      message: 'Start date cannot be later than end date',
      path: ['startDate'],
    },
  )
  .refine(
    (data) => {
      if (!data.isVat) return true;
      return data.vat && data.vat >= 0.01;
    },
    {
      message: 'VAT must be at least 0.01 for vatable subscriptions',
      path: ['vat'],
    },
  );

export type IAddSubscriptionFormValues = z.infer<typeof AddSubscriptionSchema>;

export const UpdateSubscriptionSchema = AddSubscriptionSchema.partial();

export type IUpdateSubscriptionFormValues = z.infer<typeof UpdateSubscriptionSchema>;
