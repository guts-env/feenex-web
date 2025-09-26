import request from '@/api/request';
import { EmailEndpoints } from '@/api/services/EmailService/config';
import { type ISupportEmailFormValues } from '@/forms/schema/email';

export default class EmailService {
  public static readonly sendSupportEmail = async (
    data: ISupportEmailFormValues,
  ): Promise<void> => {
    return request({
      url: EmailEndpoints.sendSupportEmail(),
      method: 'POST',
      data,
    });
  };
}
