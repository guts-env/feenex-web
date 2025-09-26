import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type IAccountPlanOrgPlanRes } from '@/types/api';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/useUserStore';
import { useShallow } from 'zustand/react/shallow';
import { RoleEnum } from '@/constants/enums';

interface PlanUsageProps {
  data: IAccountPlanOrgPlanRes;
}

interface UsageItemProps {
  label: string;
  current: number;
  limit: number;
  remaining: number;
  type: 'members' | 'subscriptions' | 'manual_expenses' | 'auto_expenses';
}

function UsageItem({ label, current, limit, remaining }: UsageItemProps) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : limit > 0 ? (current / limit) * 100 : 0;

  const getStatusColor = (percentage: number, isUnlimited: boolean) => {
    if (isUnlimited) return 'secondary';
    if (percentage >= 90) return 'destructive';
    if (percentage >= 70) return 'outline';
    return 'secondary';
  };

  const getProgressColor = (percentage: number, isUnlimited: boolean) => {
    if (isUnlimited) return 'bg-primary';
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-primary';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {isUnlimited ? (
          <Badge variant="secondary">Unlimited</Badge>
        ) : (
          <Badge variant={getStatusColor(percentage, isUnlimited)}>
            {current}/{limit}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{current} used</span>
          <span>{isUnlimited ? 'Unlimited' : `${remaining} remaining`}</span>
        </div>

        {isUnlimited ? (
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="w-full h-2 bg-primary rounded-full" />
          </div>
        ) : (
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                getProgressColor(percentage, isUnlimited),
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {isUnlimited ? 'Unlimited usage' : `${percentage.toFixed(1)}% used`}
        </div>
      </div>
    </div>
  );
}

export function PlanUsage({ data }: PlanUsageProps) {
  const { user } = useUserStore(useShallow((state) => ({ user: state.user })));

  const formatPlanType = (planType: string) => {
    if (!planType || typeof planType !== 'string') {
      return 'Unknown Plan';
    }

    return planType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-6 border-b-1">
        <CardTitle>Plan Usage</CardTitle>
        <Badge
          variant="outline"
          className="border-green-500 text-green-500 dark:border-green-400 dark:text-green-400 before:bg-green-500 dark:before:bg-green-400"
        >
          {formatPlanType(data.plan.plan_type)} Plan
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <UsageItem
          label="Auto Expenses"
          current={data.usage.auto_expenses.current}
          limit={data.usage.auto_expenses.limit}
          remaining={data.usage.auto_expenses.remaining}
          type="auto_expenses"
        />

        <UsageItem
          label="Manual Expenses"
          current={data.usage.manual_expenses.current}
          limit={data.usage.manual_expenses.limit}
          remaining={data.usage.manual_expenses.remaining}
          type="manual_expenses"
        />

        <UsageItem
          label="Subscriptions"
          current={data.usage.subscriptions.current}
          limit={data.usage.subscriptions.limit}
          remaining={data.usage.subscriptions.remaining}
          type="subscriptions"
        />

        {user?.role?.name === RoleEnum.BUSINESS_ADMIN && (
          <UsageItem
            label="Team Members"
            current={data.usage.members.current}
            limit={data.usage.members.limit}
            remaining={data.usage.members.remaining}
            type="members"
          />
        )}
      </CardContent>
    </Card>
  );
}
