import SubscriptionService from '@/api/services/SubscriptionService/service';
import type {
  ISubscriptionListParams,
  ISubscriptionListRes,
  ISubscriptionStatsParams,
  ISubscriptionStats,
} from '@/types/api';

export default class SubscriptionQuery {
  public static readonly list = async (params: ISubscriptionListParams): Promise<ISubscriptionListRes> => {
    const data = await SubscriptionService.list(params);
    return data;
  };

  public static readonly getStats = async (params?: ISubscriptionStatsParams): Promise<ISubscriptionStats> => {
    const data = await SubscriptionService.getStats(params);
    return data;
  };

  public static readonly getActiveBilling = async (): Promise<ISubscriptionListRes> => {
    const data = await SubscriptionService.getActiveBilling();
    return data;
  };

  public static readonly getDueForBilling = async (): Promise<ISubscriptionListRes> => {
    const data = await SubscriptionService.getDueForBilling();
    return data;
  };
}