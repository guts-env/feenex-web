import capitalize from 'lodash/capitalize';
import { Badge } from '@/components/ui/badge';
import { SubscriptionStatusEnum } from '@/constants/enums';
import { cn } from '@/lib/utils';

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatusEnum;
}

function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
  const className = {
    [SubscriptionStatusEnum.ACTIVE]: 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400 before:bg-green-500 dark:before:bg-green-400',
    [SubscriptionStatusEnum.SUSPENDED]: 'border-amber-500 text-amber-500 dark:border-amber-400 dark:text-amber-400 before:bg-amber-500 dark:before:bg-amber-400',
    [SubscriptionStatusEnum.CANCELLED]: 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 before:bg-red-500 dark:before:bg-red-400',
  };

  return (
    <Badge
      className={cn(
        className[status],
        'before:content-[\'\'] before:w-2 before:h-2 before:rounded-full before:mr-1.5 before:flex-shrink-0'
      )}
      variant="outline"
    >
      {capitalize(status)}
    </Badge>
  );
}

export default SubscriptionStatusBadge;