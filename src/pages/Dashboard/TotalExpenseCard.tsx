import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardAction,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUpIcon } from 'lucide-react';

function TotalExpenseCard() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Expenses</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(1250)}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendingUpIcon className="size-4" />
            +12.5%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month <TrendingUpIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">Expenses for the last 6 months</div>
      </CardFooter>
    </Card>
  );
}

export default TotalExpenseCard;
