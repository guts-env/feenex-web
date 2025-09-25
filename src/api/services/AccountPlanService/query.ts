import AccountPlanOrgPlanService from '@/api/services/AccountPlanService/service';
import { type IAccountPlanOrgPlanRes } from '@/types/api';

export default class AccountPlanOrgPlanQuery {
  public static readonly orgAccountPlan = async (): Promise<IAccountPlanOrgPlanRes> => {
    const data = await AccountPlanOrgPlanService.orgAccountPlan();
    return data;
  };
}
