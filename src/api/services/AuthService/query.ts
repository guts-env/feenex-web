import AuthService from '@/api/services/AuthService/service'
import { type IRefreshTokenRes } from '@/types/api'

export default class AuthQuery {
  public static readonly getRefreshAccessToken = async (): Promise<IRefreshTokenRes> => {
    const data = await AuthService.refreshAccessToken()
    return data
  }
}
