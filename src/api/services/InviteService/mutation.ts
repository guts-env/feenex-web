import { useMutation } from '@tanstack/react-query';
import InviteService from '@/api/services/InviteService/service';
import type { IInviteFormValues } from '@/forms/schema/invite';

export const useCreateInvite = () => {
  return useMutation({
    mutationFn: (data: IInviteFormValues): Promise<void> => {
      return InviteService.create(data);
    },
  });
};
