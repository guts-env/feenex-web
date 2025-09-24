import request from '@/api/request';
import { SubscriptionEndpoints } from '@/api/services/SubscriptionService/config';
import type {
  IAddSubscriptionFormValues,
  IUpdateSubscriptionFormValues,
} from '@/forms/schema/subscriptions';
import type { ISubscriptionListParams, ISubscriptionListRes, ISubscriptionRes, ISubscriptionStats, ISubscriptionStatsParams } from '@/types/api';

export default class SubscriptionService {
  public static readonly list = async (params: ISubscriptionListParams): Promise<ISubscriptionListRes> => {
    return request({
      url: SubscriptionEndpoints.list(),
      method: 'GET',
      params,
    });
  };

  public static readonly getStats = async (params?: ISubscriptionStatsParams): Promise<ISubscriptionStats> => {
    return request({
      url: SubscriptionEndpoints.stats(),
      method: 'GET',
      params,
    });
  };

  public static readonly getActiveBilling = async (): Promise<ISubscriptionListRes> => {
    return request({
      url: SubscriptionEndpoints.activeBilling(),
      method: 'GET',
    });
  };

  public static readonly getDueForBilling = async (): Promise<ISubscriptionListRes> => {
    return request({
      url: SubscriptionEndpoints.dueForBilling(),
      method: 'GET',
    });
  };

  public static readonly create = async (
    data: IAddSubscriptionFormValues,
  ): Promise<void> => {
    return request({
      url: SubscriptionEndpoints.create(),
      method: 'POST',
      data,
    });
  };

  public static readonly update = async (
    id: string,
    data: IUpdateSubscriptionFormValues,
  ): Promise<ISubscriptionRes> => {
    return request({
      url: SubscriptionEndpoints.update(id),
      method: 'PATCH',
      data,
    });
  };

  public static readonly delete = async (id: string): Promise<void> => {
    return request({
      url: SubscriptionEndpoints.delete(id),
      method: 'DELETE',
    });
  };
}