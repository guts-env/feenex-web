import { z } from 'zod';

export const InviteSchema = z.object({
  email: z.email({
    error: (iss) => (!iss.input ? 'Email is required' : 'Invalid email address'),
  }),
});

export type IInviteFormValues = z.infer<typeof InviteSchema>;
