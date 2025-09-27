import { startOfMonth, endOfMonth } from 'date-fns';
import TotalExpenseCard from '@/pages/Dashboard/TotalExpenseCard';
import VerifiedExpenseCard from '@/pages/Dashboard/VerifiedExpenseCard';
import ReceiptsProcessedCard from '@/pages/Dashboard/ReceiptsProcessedCard';
import UnverifiedExpenseCard from '@/pages/Dashboard/UnverifiedExpenseCard';
// import ExpenseBarChart from '@/pages/Dashboard/ExpenseBarChart';
// import ExpensePieChart from '@/pages/Dashboard/ExpensePieChart';
import { useQuery } from '@tanstack/react-query';
import ExpenseQuery from '@/api/services/ExpenseService/query';
import { ExpenseQueryKeys } from '@/api/services/ExpenseService/config';

function Dashboard() {
  const params = {
    startDate: startOfMonth(new Date()).toISOString(),
    endDate: endOfMonth(new Date()).toISOString(),
  };

  const { data: total } = useQuery({
    queryKey: ExpenseQueryKeys.total(params),
    queryFn: () => ExpenseQuery.getTotal(params),
  });

  return (
    <div className="flex flex-col gap-4">
      {/* <WorkInProgressIndicator description="Everything here is just a placeholder for now. Actual data will be shown here soon." /> */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 xl:grid-cols-4">
        <TotalExpenseCard total={total?.total ?? 0} />
        <VerifiedExpenseCard total={total?.verified ?? 0} />
        <UnverifiedExpenseCard total={total?.unverified ?? 0} />
        <ReceiptsProcessedCard receiptsProcessed={total?.receiptsProcessed ?? 0} />
      </div>
      {/* <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        <div className="col-span-1 lg:col-span-3">
          <ExpenseBarChart />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ExpensePieChart />
        </div>
      </div> */}
    </div>
  );
}

export default Dashboard;
