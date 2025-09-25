import { AccountPlanQueryKeys } from '@/api/services/AccountPlanService/config';
import AccountPlanOrgPlanQuery from '@/api/services/AccountPlanService/query';
import { PlanUsage } from '@/components/features/PlanUsage';
import { useQuery } from '@tanstack/react-query';

function Settings() {
  const { data, isLoading } = useQuery({
    queryKey: AccountPlanQueryKeys.orgAccountPlan(),
    queryFn: AccountPlanOrgPlanQuery.orgAccountPlan,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div>Loading...</div>
      </div>
    );
  }

  return <div className="max-w-lg">{data && <PlanUsage data={data} />}</div>;
}

export default Settings;
