export const AccountPlanQueryKeys = {
  all: 'accountPlan',
  orgAccountPlan: () => [...AccountPlanQueryKeys.all, 'orgAccountPlan'],
};

export const AccountPlanEndpoints = {
  orgAccountPlan: () => '/account-plans/organization',
};
