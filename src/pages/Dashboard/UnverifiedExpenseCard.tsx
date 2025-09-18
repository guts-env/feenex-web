import { useNavigate } from 'react-router-dom';
import { TrendingUpIcon } from 'lucide-react';
import { ExpenseStatusEnum, RoutesEnum } from '@/constants/enums';
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  // CardAction,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';

function UnverifiedExpenseCard({ total }: { total: number }) {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(RoutesEnum.EXPENSES, {
      state: {
        initialFilters: {
          statuses: [ExpenseStatusEnum.PENDING],
        },
      },
    });
  };

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleViewClick}
          className="absolute top-0 right-4"
        >
          View
        </Button>
        <CardDescription>Unverified Expenses</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(total)}
        </CardTitle>
        {/* <CardAction>
          <Badge variant="outline">
            <TrendingUpIcon className="size-4" />
            +12.5%
          </Badge>
        </CardAction> */}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month <TrendingUpIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">Unverified expenses for this month</div>
      </CardFooter>
    </Card>
  );
}

export default UnverifiedExpenseCard;
