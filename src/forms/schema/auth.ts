import { z } from 'zod';
import { OrgTypeEnum } from '@/constants/enums';

export const LoginSchema = z.object({
  email: z.email({
    error: (iss) => (!iss.input ? 'Email is required' : 'Invalid email address'),
  }),
  password: z.string().min(8, {
    error: 'Password must be at least 8 characters',
  }),
});

export type ILoginFormValues = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    firstName: z.string().min(1, {
      error: 'First name is required',
    }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, {
      error: 'Last name is required',
    }),
    email: z.email({
      error: (iss) => (!iss.input ? 'Email is required' : 'Invalid email address'),
    }),
    password: z.string().min(8, {
      error: 'Password must be at least 8 characters',
    }),
    confirmPassword: z.string().min(8, {
      error: 'Confirm password must be at least 8 characters',
    }),
    orgType: z.enum(OrgTypeEnum, {
      error: 'Organization type is required',
    }),
    orgName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
    if (data.orgType === OrgTypeEnum.BUSINESS && (!data.orgName || data.orgName.trim() === '')) {
      ctx.addIssue({
        code: 'custom',
        path: ['orgName'],
        message: 'Organization name is required for business accounts',
      });
    }
  });

export type IRegisterFormValues = z.infer<typeof RegisterSchema>;

export const AcceptInviteSchema = z
  .object({
    inviteToken: z.string().optional(),
    firstName: z.string().min(1, {
      error: 'First name is required',
    }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, {
      error: 'Last name is required',
    }),
    password: z.string().min(8, {
      error: 'Password must be at least 8 characters',
    }),
    confirmPassword: z.string().min(8, {
      error: 'Confirm password must be at least 8 characters',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });

export type IAcceptInviteFormValues = z.infer<typeof AcceptInviteSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.email({
    error: (iss) => (!iss.input ? 'Email is required' : 'Invalid email address'),
  }),
});

export type IForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z
  .object({
    email: z.email().optional(),
    resetToken: z.string().optional(),
    newPassword: z.string().min(8, {
      error: 'Password must be at least 8 characters',
    }),
    confirmPassword: z.string().min(8, {
      error: 'Confirm password must be at least 8 characters',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });

export type IResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;
