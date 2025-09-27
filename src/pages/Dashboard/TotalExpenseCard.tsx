import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { TrendingUpIcon } from 'lucide-react';

function TotalExpenseCard({ total }: { total: number }) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Expenses</CardDescription>
        <CardTitle className="text-2xl font-medium tabular-nums @[250px]/card:text-3xl">
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
        <div className="text-muted-foreground">Total expenses for this month</div>
      </CardFooter>
    </Card>
  );
}

export default TotalExpenseCard;
