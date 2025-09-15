import request from '@/api/request';
import { InviteEndpoints } from '@/api/services/InviteService/config';
import type { IInviteFormValues } from '@/forms/schema/invite';

export default class InviteService {
  public static readonly create = async (data: IInviteFormValues): Promise<void> => {
    return request({
      url: InviteEndpoints.create(),
      method: 'POST',
      data,
    });
  };
}
