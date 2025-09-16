import request from '@/api/request';
import { AuthEndpoints } from '@/api/services/AuthService/config';
import {
  type IForgotPasswordFormValues,
  type ILoginFormValues,
  type IRegisterFormValues,
  type IResetPasswordFormValues,
  type IAcceptInviteFormValues,
} from '@/forms/schema/auth';
import { authRequest } from '@/api/services/AuthService/authRequest';
import { type ILoginRes, type IRefreshTokenRes } from '@/types/api';

export default class AuthService {
  public static readonly login = (data: ILoginFormValues): Promise<ILoginRes> => {
    return authRequest({
      url: AuthEndpoints.login(),
      method: 'POST',
      withCredentials: true,
      data,
    });
  };

  public static readonly register = (data: IRegisterFormValues): Promise<void> => {
    return authRequest({
      url: AuthEndpoints.register(),
      method: 'POST',
      data,
    });
  };

  public static readonly acceptInvite = (data: IAcceptInviteFormValues): Promise<void> => {
    return authRequest({
      url: AuthEndpoints.acceptInvite(),
      method: 'POST',
      data,
    });
  };

  public static readonly refreshAccessToken = (): Promise<IRefreshTokenRes> => {
    return authRequest({
      url: AuthEndpoints.refreshAccessToken(),
      method: 'GET',
      withCredentials: true,
    });
  };

  public static readonly requestPasswordReset = (
    data: IForgotPasswordFormValues,
  ): Promise<void> => {
    return authRequest({
      url: AuthEndpoints.requestPasswordReset(),
      method: 'POST',
      data,
    });
  };

  public static readonly resetPassword = (data: IResetPasswordFormValues): Promise<void> => {
    return authRequest({
      url: AuthEndpoints.resetPassword(),
      method: 'PATCH',
      data,
    });
  };

  public static readonly logout = (): Promise<void> => {
    return request({
      url: AuthEndpoints.logout(),
      method: 'POST',
      withCredentials: true,
    });
  };

  // public static readonly logoutAll = (data: { refresh: string }): Promise<void> => {
  //   return request({
  //     url: AuthEndpoints.logoutAll(),
  //     method: 'POST',
  //     data,
  //   })
  // }

  // public static readonly updatePassword = (data: UpdatePasswordDto): Promise<UpdatePasswordDtoRes> => {
  //   return request({
  //     url: AuthEndpoints.updatePassword(),
  //     method: 'POST',
  //     data,
  //   })
  // }
}
