import { z } from 'zod';

export const SupportEmailSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Valid email is required'),
    subject: z.string().min(1, 'Subject is required'),
    customSubject: z.string().optional(),
    message: z
      .string()
      .min(1, 'Message is required')
      .max(2000, 'Message cannot exceed 2000 characters'),
  })
  .refine(
    (data) => {
      if (data.subject === 'other') {
        return data.customSubject && data.customSubject.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Please specify the subject',
      path: ['customSubject'],
    },
  );

export type ISupportEmailFormValues = z.infer<typeof SupportEmailSchema>;
