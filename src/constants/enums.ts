export enum RoutesEnum {
  LOGIN = '/login',
  REGISTER = '/register',
  ACCEPT_INVITE = '/accept-invite',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  DASHBOARD = '/',
  EXPENSES = '/expenses',
  SETTINGS = '/settings',
}

export enum OrgTypeEnum {
  BUSINESS = 'business',
  PERSONAL = 'personal',
}

export enum RoleEnum {
  BUSINESS_ADMIN = 'business_admin',
  PERSONAL_ADMIN = 'personal_admin',
  MEMBER = 'member',
}

export enum ExpenseStatusEnum {
  DRAFT = 'draft',
  PENDING = 'pending',
  REJECTED = 'rejected',
  VERIFIED = 'verified',
}
