import { useMutation } from '@tanstack/react-query';
import OrganizationService from './service';
import type { RoleEnum } from '@/constants/enums';

// export const useUpdateOrganization = () => {
//   return useMutation({
//     mutationFn: (data: IOrganizationRes): Promise<IOrganizationRes> => {
//       return OrganizationService.update(data);
//     },
//   });
// };

export const useUpdateMemberRole = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { role: RoleEnum } }): Promise<void> => {
      return OrganizationService.updateMemberRole(id, data);
    },
  });
};

export const useRemoveMember = () => {
  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      return OrganizationService.removeMember(id);
    },
  });
};
