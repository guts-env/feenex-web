import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type IInviteFormValues, InviteSchema } from '@/forms/schema/invite';

export const useCreateInviteForm = () => {
  return useForm<IInviteFormValues>({
    resolver: zodResolver(InviteSchema),
    defaultValues: {
      email: undefined,
    },
  });
};
