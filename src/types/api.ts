import type {
  ExpenseProcessingStatusEnum,
  ExpenseStatusEnum,
  OrgTypeEnum,
  RecurringFrequencyEnum,
  RoleEnum,
  SortOrderEnum,
  SubscriptionStatusEnum,
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
  orderBy?: {
    field: string;
    order: SortOrderEnum;
  };
}

export interface IBaseDateRangeParams {
  startDate?: string;
  endDate?: string;
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
  orNumber?: string;
  merchantName: string;
  photos: string[];
  amount: number;
  isVat?: boolean;
  vat?: number;
  invoiceDate: string;
  paymentDate: string;
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
  invoiceStartDate?: string;
  invoiceEndDate?: string;
  paymentStartDate?: string;
  paymentEndDate?: string;
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
  statuses?: ExpenseStatusEnum[];
  minAmount?: number;
  maxAmount?: number;
}

export interface IExpenseListRes {
  data: IExpenseRes[];
  count: number;
}

export type IExpensesTotal = IBaseDateRangeParams;

export interface IExpenseTotalRes {
  total: number;
  count: number;
  unverified: number;
  verified: number;
  receiptsProcessed: number;
  dateRange: IBaseDateRangeParams;
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

export interface ISubscriptionRes {
  id: string;
  category: ICategoryRes;
  merchantName: string;
  amount: number;
  currency: string;
  description?: string;
  frequency: RecurringFrequencyEnum;
  startDate: string;
  endDate?: string | null;
  billingDate: string;
  status: SubscriptionStatusEnum;
  isVat?: boolean | null;
  vat?: number | null;
  createdBy: IUserRes;
  updatedBy: IUserRes;
  createdAt: string;
  updatedAt: string;
}

export interface ISubscriptionListRes {
  data: ISubscriptionRes[];
  count: number;
}

export interface ISubscriptionListParams extends IBasePaginatedParams {
  categoryIds?: string[];
  statuses?: SubscriptionStatusEnum[];
  frequency?: RecurringFrequencyEnum;
  isVat?: boolean;
}

export type ISubscriptionStatsParams = IBaseDateRangeParams;

export interface ISubscriptionStats {
  totalActive: number;
  totalMonthlyAmount: number;
  totalYearlyAmount: number;
  upcomingBillings: number;
}
