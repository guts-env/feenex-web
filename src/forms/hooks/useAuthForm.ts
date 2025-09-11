'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrgTypeEnum } from '@/constants/enums'
import {
  type ILoginFormValues,
  type IRegisterFormValues,
  type IForgotPasswordFormValues,
  type IResetPasswordFormValues,
  type IAcceptInviteFormValues,
  LoginSchema,
  RegisterSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  AcceptInviteSchema,
} from '@/forms/schema/auth'

export const useLoginForm = () => {
  return useForm<ILoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
}

export const useRegisterForm = () => {
  return useForm<IRegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      orgType: OrgTypeEnum.BUSINESS,
      orgName: '',
    },
  })
}

export const useAcceptInviteForm = () => {
  return useForm<IAcceptInviteFormValues>({
    resolver: zodResolver(AcceptInviteSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  })
}

export const useForgotPasswordForm = () => {
  return useForm<IForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })
}

export const useResetPasswordForm = () => {
  return useForm<IResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })
}
