import { useMutation } from '@tanstack/react-query';
import EmailService from '@/api/services/EmailService/service';
import { type ISupportEmailFormValues } from '@/forms/schema/email';

export const useSendSupportEmail = () => {
  return useMutation({
    mutationFn: (data: ISupportEmailFormValues): Promise<void> => {
      return EmailService.sendSupportEmail(data);
    },
  });
};
