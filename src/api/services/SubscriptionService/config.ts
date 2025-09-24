import type { ISubscriptionListParams, ISubscriptionStatsParams } from '@/types/api';

export const SubscriptionQueryKeys = {
  all: 'subscription',
  list: (params: ISubscriptionListParams) => [...SubscriptionQueryKeys.all, 'list', params],
  detail: (id: string) => [...SubscriptionQueryKeys.all, 'detail', id],
  stats: (params: ISubscriptionStatsParams) => [...SubscriptionQueryKeys.all, 'stats', params],
  activeBilling: () => [...SubscriptionQueryKeys.all, 'active-billing'],
  dueForBilling: () => [...SubscriptionQueryKeys.all, 'due-for-billing'],
};

export const SubscriptionEndpoints = {
  list: () => '/subscriptions',
  detail: (id: string) => `/subscriptions/${id}`,
  create: () => '/subscriptions',
  update: (id: string) => `/subscriptions/${id}`,
  delete: (id: string) => `/subscriptions/${id}`,
  stats: () => '/subscriptions/stats',
  activeBilling: () => '/subscriptions/active-billing',
  dueForBilling: () => '/subscriptions/due-for-billing',
};