import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { category: 'groceries', expense: 275, fill: 'var(--chart-1)' },
  { category: 'utilities', expense: 200, fill: 'var(--chart-2)' },
  { category: 'packaging', expense: 187, fill: 'var(--chart-3)' },
  { category: 'transportation', expense: 173, fill: 'var(--chart-4)' },
  { category: 'payroll', expense: 90, fill: 'var(--chart-5)' },
];

const chartConfig = {
  expense: {
    label: 'Expense',
  },
  groceries: {
    label: 'Groceries',
    color: 'var(--chart-1)',
  },
  utilities: {
    label: 'Utilities',
    color: 'var(--chart-2)',
  },
  packaging: {
    label: 'Packaging',
    color: 'var(--chart-3)',
  },
  transportation: {
    label: 'Transportation',
    color: 'var(--chart-4)',
  },
  payroll: {
    label: 'Payroll',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

export default function ExpensePieChart() {
  return (
    <Card className="py-0 gap-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0 h-24">
          <CardTitle>Expense Pie Chart</CardTitle>
          <CardDescription>Showing total expenses for the last 3 months</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-auto h-[250px] w-full pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="expense" label nameKey="category" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
