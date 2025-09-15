import OrganizationService from '@/api/services/OrganizationService/service';
import type {
  IOrganizationMembersListParams,
  IOrganizationMembersListRes,
  IOrganizationRes,
} from '@/types/api';

export default class OrganizationQuery {
  public static readonly get = async (id: string): Promise<IOrganizationRes> => {
    const data = await OrganizationService.get(id);
    return data;
  };

  public static readonly getMembers = async (
    params: IOrganizationMembersListParams,
  ): Promise<IOrganizationMembersListRes> => {
    const data = await OrganizationService.getMembers(params);
    return data;
  };

  // public static readonly getMember = async (id: string): Promise<IOrganizationMemberRes> => {
  //   const data = await OrganizationService.getMember(id);
  //   return data;
  // };
}
