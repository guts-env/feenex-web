import type { OrgTypeEnum, RoleEnum } from '@/constants/enums'

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

export interface ILoginUserRes {
  id: string
  email: string
  firstName: string
  lastName?: string
  middleName?: string
  profilePhoto?: string
}

export interface ILoginOrganizationRes {
  id: string
  name: string
  type: OrgTypeEnum
}

export interface ILoginRoleRes {
  id: string
  name: RoleEnum
}

export interface ILoginRes {
  user: ILoginUserRes & {
    organization: ILoginOrganizationRes
    role: ILoginRoleRes
  }
  accessToken: string
}

export interface IRefreshTokenRes {
  accessToken: string
}
