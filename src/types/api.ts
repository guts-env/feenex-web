import type {
  ExpenseProcessingStatusEnum,
  ExpenseStatusEnum,
  OrgTypeEnum,
  RoleEnum,
  SortOrderEnum,
} from '@/constants/enums';

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

export interface IBasePaginatedParams {
  offset: number;
  limit: number;
  search?: string;
}

export interface IOrganizationRes {
  id: string;
  name: string;
  type: OrgTypeEnum;
}

export interface IRoleRes {
  id: string;
  name: RoleEnum;
}

export interface IUserRes {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  profilePhoto?: string;
}

export interface ILoginRes {
  user: IUserRes & {
    organization: IOrganizationRes;
    role: IRoleRes;
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
  createdBy: Partial<IUserRes>;
  createdAt: string;
  updatedBy: Partial<IUserRes>;
  updatedAt: string;
  verifiedBy: Partial<IUserRes>;
  verifiedAt: string;
  status: ExpenseStatusEnum;
  processingStatus: ExpenseProcessingStatusEnum;
  items?: IExpenseLineItemRes[];
  otherDetails?: IExpenseOtherDetailsRes[];
}

export interface IExpenseListParams extends IBasePaginatedParams {
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
  statuses?: ExpenseStatusEnum[];
  minAmount?: number;
  maxAmount?: number;
  orderBy?: {
    field: string;
    order: SortOrderEnum;
  };
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

export interface IOrganizationRes {
  id: string;
  name: string;
  type: OrgTypeEnum;
}

export interface IOrganizationMembersListParams {
  offset: number;
  limit: number;
  search?: string;
}

export interface IOrganizationMemberRes extends IUserRes {
  role: IRoleRes;
  joinedAt: string;
}

export interface IOrganizationMembersListRes {
  data: IOrganizationMemberRes[];
  count: number;
}
