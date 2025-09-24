import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import {
  type IAddSubscriptionFormValues,
  type IUpdateSubscriptionFormValues,
  AddSubscriptionSchema,
  UpdateSubscriptionSchema,
} from '@/forms/schema/subscriptions';
import { RecurringFrequencyEnum, SubscriptionStatusEnum } from '@/constants/enums';

export const useAddSubscriptionForm = () => {
  return useForm<IAddSubscriptionFormValues>({
    resolver: zodResolver(AddSubscriptionSchema),
    defaultValues: {
      merchantName: '',
      amount: 0,
      vat: 0,
      isVat: false,
      categoryId: '',
      frequency: RecurringFrequencyEnum.MONTHLY,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: undefined,
      status: SubscriptionStatusEnum.ACTIVE,
    },
  });
};

export const useEditSubscriptionForm = (defaultValues: IAddSubscriptionFormValues) => {
  return useForm<IUpdateSubscriptionFormValues>({
    resolver: zodResolver(UpdateSubscriptionSchema),
    defaultValues: {
      ...defaultValues,
    },
  });
};
