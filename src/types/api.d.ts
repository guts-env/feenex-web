import type { OrgTypeEnum, RoleEnum } from '@/constants/enums';

export interface ApiErrorPayload {
  code: string;
  status: number;
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export interface ILoginUserRes {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  profilePhoto?: string;
}

export interface ILoginOrganizationRes {
  id: string;
  name: string;
  type: OrgTypeEnum;
}

export interface ILoginRoleRes {
  id: string;
  name: RoleEnum;
}

export interface ILoginRes {
  user: ILoginUserRes & {
    organization: ILoginOrganizationRes;
    role: ILoginRoleRes;
  };
  accessToken: string;
}

export interface IRefreshTokenRes {
  accessToken: string;
}

export interface IExpenseLineItemRes {
  name: string;
  quantity: number;
  price: number;
}

export interface IExpenseOtherDetailsRes {
  key: string;
  value: string;
}

export interface IExpenseRes {
  id: string;
  merchantName: string;
  photos: string[];
  amount: number;
  date: string;
  category: {
    id: string;
    name: string;
  };
  createdBy: Partial<IPartialUserRes>;
  createdAt: string;
  updatedBy: Partial<IPartialUserRes>;
  updatedAt: string;
  verifiedBy: Partial<IPartialUserRes>;
  verifiedAt: string;
  status: ExpenseStatusEnum;
  items?: IExpenseLineItemRes[];
  otherDetails?: IExpenseOtherDetailsRes[];
}

export interface IExpenseListParams {
  offset: number;
  limit: number;
  search?: string;
}

export interface IExpenseListRes {
  data: IExpenseRes[];
  count: number;
}

export interface IUploadPresigned {
  key: string;
  filename: string;
  contentType: string;
  filesize: number;
}

export type IUploadPresignedRes = {
  url: string;
  key: string;
};

export interface IUploadGetPresigned {
  keys: string[];
}

interface IUploadGetPresignedResItem {
  key: string;
  url: string;
  fileName: string;
}

export type IUploadGetPresignedRes = IUploadGetPresignedResItem[];

export interface IUploadFile {
  url: string;
  file: File;
}

export type IUploadFileRes = void;

export interface ICategoryListParams {
  offset: number;
  limit: number;
  search?: string;
}

export interface ICategoryRes {
  id: string;
  name: string;
}
