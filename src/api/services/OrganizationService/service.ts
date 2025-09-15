import request from '@/api/request';
import { OrganizationEndpoints } from '@/api/services/OrganizationService/config';
import type { RoleEnum } from '@/constants/enums';
import type {
  IOrganizationMembersListParams,
  IOrganizationMembersListRes,
  IOrganizationRes,
} from '@/types/api';

export default class OrganizationService {
  public static readonly get = async (id: string): Promise<IOrganizationRes> => {
    return request({
      url: OrganizationEndpoints.get(id),
      method: 'GET',
    });
  };

  // public static readonly update = async (
  //   id: string,
  //   data: IOrganizationRes,
  // ): Promise<IOrganizationRes> => {
  //   return request({
  //     url: OrganizationEndpoints.update(id),
  //     method: 'PATCH',
  //     data,
  //   });
  // };

  public static readonly getMembers = async (
    params: IOrganizationMembersListParams,
  ): Promise<IOrganizationMembersListRes> => {
    return request({
      url: OrganizationEndpoints.getMembers(),
      method: 'GET',
      params,
    });
  };

  // public static readonly getMember = async (id: string): Promise<IOrganizationMemberRes> => {
  //   return request({
  //     url: OrganizationEndpoints.getMember(id),
  //     method: 'GET',
  //   });
  // };

  public static readonly updateMemberRole = async (
    id: string,
    data: { role: RoleEnum },
  ): Promise<void> => {
    return request({
      url: OrganizationEndpoints.updateMemberRole(id),
      method: 'PATCH',
      data,
    });
  };

  public static readonly removeMember = async (id: string): Promise<void> => {
    return request({
      url: OrganizationEndpoints.removeMember(id),
      method: 'DELETE',
    });
  };
}
