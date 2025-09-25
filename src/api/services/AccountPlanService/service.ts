import request from '@/api/request';
import { type IAccountPlanOrgPlanRes } from '@/types/api';
import { AccountPlanEndpoints } from '@/api/services/AccountPlanService/config';

export default class AccountPlanService {
  public static readonly orgAccountPlan = async (): Promise<IAccountPlanOrgPlanRes> => {
    return request({
      url: AccountPlanEndpoints.orgAccountPlan(),
      method: 'GET',
    });
  };
}
