import { useMutation } from '@tanstack/react-query';
import SubscriptionService from '@/api/services/SubscriptionService/service';
import type { ISubscriptionRes } from '@/types/api';
import type {
  IAddSubscriptionFormValues,
  IUpdateSubscriptionFormValues,
} from '@/forms/schema/subscriptions';

export const useCreateSubscription = () => {
  return useMutation({
    mutationFn: (data: IAddSubscriptionFormValues): Promise<void> => {
      return SubscriptionService.create(data);
    },
  });
};

export const useUpdateSubscription = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateSubscriptionFormValues }): Promise<ISubscriptionRes> => {
      return SubscriptionService.update(id, data);
    },
  });
};

export const useDeleteSubscription = () => {
  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      return SubscriptionService.delete(id);
    },
  });
};