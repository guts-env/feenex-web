export enum RoutesEnum {
  LOGIN = '/login',
  REGISTER = '/register',
  ACCEPT_INVITE = '/accept-invite',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  DASHBOARD = '/',
  EXPENSES = '/expenses',
  SUBSCRIPTIONS = '/subscriptions',
  ORGANIZATION = '/organization',
  SETTINGS = '/settings',
  SUPPORT = '/support',
}

export enum OrgTypeEnum {
  BUSINESS = 'business',
  PERSONAL = 'personal',
}

export enum RoleEnum {
  BUSINESS_ADMIN = 'business_admin',
  MANAGER = 'manager',
  MEMBER = 'member',
  PERSONAL_ADMIN = 'personal_admin',
}

export enum ExpenseStatusEnum {
  DRAFT = 'draft',
  PENDING = 'pending',
  REJECTED = 'rejected',
  VERIFIED = 'verified',
}

export enum ExpenseProcessingStatusEnum {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ExpenseTypeEnum {
  MANUAL = 'manual',
  AUTO = 'auto',
}

export enum UploadTypeEnum {
  RECEIPTS = 'receipts',
  IMPORTS = 'imports',
}

export enum UploadStatusEnum {
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  ERROR = 'error',
}

export enum SortOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SubscriptionStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
}

export enum RecurringFrequencyEnum {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}
