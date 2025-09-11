import { useMutation } from '@tanstack/react-query'
import AuthService from '@/api/services/AuthService/service'
import { type ILoginRes, type IRefreshTokenRes } from '@/types/api'
import {
  type IForgotPasswordFormValues,
  type ILoginFormValues,
  type IRegisterFormValues,
  type IResetPasswordFormValues,
  type IAcceptInviteFormValues,
} from '@/forms/schema/auth'

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: ILoginFormValues): Promise<ILoginRes> => {
      return AuthService.login(data)
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: IRegisterFormValues): Promise<void> => {
      return AuthService.register(data)
    },
  })
}

export const useAcceptInvite = () => {
  return useMutation({
    mutationFn: (data: IAcceptInviteFormValues): Promise<void> => {
      return AuthService.acceptInvite(data)
    },
  })
}

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (): Promise<IRefreshTokenRes> => {
      return AuthService.refreshToken()
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: IForgotPasswordFormValues): Promise<void> => {
      return AuthService.requestPasswordReset(data)
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: IResetPasswordFormValues): Promise<void> => {
      return AuthService.resetPassword(data)
    },
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: (): Promise<void> => {
      return AuthService.logout()
    },
  })
}
