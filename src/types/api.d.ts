import type { IStoreUser } from '@/stores/useUserStore'

export interface ApiErrorPayload {
  code: string
  status: number
  message: string
  response: {
    data: {
      message: string
    }
  }
}

export interface ILoginRes {
  user: IStoreUser
  accessToken: string
}
