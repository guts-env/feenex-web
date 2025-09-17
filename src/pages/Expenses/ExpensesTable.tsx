import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef, type SortingState, type Updater } from '@tanstack/react-table';
import debounce from 'lodash/debounce';
import { MoreHorizontal, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import queryClient from '@/api/queryClient';
import { ExpenseQueryKeys } from '@/api/services/ExpenseService/config';
import ExpenseQuery from '@/api/services/ExpenseService/query';
import { useDeleteExpense, useVerifyExpense } from '@/api/services/ExpenseService/mutation';
import { DataTable } from '@/components/ui/data-table';
// import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ExpenseStatusBadge from '@/pages/Expenses/ExpenseStatusBadge';
import ExpenseDetails from '@/pages/Expenses/ExpenseDetails';
import DeleteExpense from '@/pages/Expenses/DeleteExpense';
import AddExpense from '@/pages/Expenses/AddExpense';
import EditExpense from '@/pages/Expenses/EditExpense';
import { useExpenseSocket } from '@/hooks/useExpenseSocket';
import { ExpenseStatusEnum } from '@/constants/enums';
import { type IExpenseRes } from '@/types/api';
import { CompoundButton } from '@/components/ui/compound-button';
import MultipleAutoExpensesForm from './MultipleAutoExpensesForm';
import { usePaginationOnDelete } from '@/hooks/usePaginationOnDelete';
import {
  ExpensesTableFilters,
  type ExpenseFilters,
} from '@/components/features/ExpensesTableFilters';

const columns: ColumnDef<IExpenseRes>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    id: 'Merchant Name',
    header: 'Merchant Name',
    accessorKey: 'merchantName',
  },
  {
    id: 'Amount',
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) =>
      Intl.NumberFormat('ph-PH', { style: 'currency', currency: 'PHP' }).format(
        row.original.amount,
      ),
  },
  {
    id: 'Date',
    header: 'Date',
    accessorKey: 'date',
    cell: ({ row }) => {
      return format(row.original.date, 'MMM dd, yyyy');
    },
  },
  {
    id: 'Status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <ExpenseStatusBadge status={row.original.status} />;
    },
  },
  {
    id: 'Category',
    header: 'Category',
    accessorKey: 'category',
    cell: ({ row }) => row.original.category?.name,
  },
  {
    id: 'Created By',
    header: 'Created By',
    accessorKey: 'createdBy',
    cell: ({ row }) => row.original.createdBy.firstName,
  },
  {
    id: 'Verified By',
    header: 'Verified By',
    accessorKey: 'verifiedBy',
    cell: ({ row }) => row.original.verifiedBy?.firstName,
  },
];

function ExpensesTable() {
  /* Table State */
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ExpenseFilters>({});

  /* Modals and Sheets */
  const [selectedExpense, setSelectedExpense] = useState<IExpenseRes | undefined>(undefined);
  const [editExpense, setEditExpense] = useState<IExpenseRes | undefined>(undefined);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | undefined>(undefined);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [multipleAutoExpensesFormOpen, setMultipleAutoExpensesFormOpen] = useState(false);

  const { pagination, setPagination, handleDeleteWithPagination } = usePaginationOnDelete({
    initialPagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  });

  const queryParams = {
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
    search,
    ...filters,
  };

  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ExpenseQueryKeys.list(queryParams),
    queryFn: async () => {
      const result = await ExpenseQuery.list(queryParams);

      await new Promise((resolve) => setTimeout(resolve, 300));
      return result;
    },
  });

  const { mutate: deleteExpense } = useDeleteExpense();
  const { mutate: verifyExpense } = useVerifyExpense();

  useExpenseSocket(data?.data ?? [], refetch);

  const handleSearch = debounce((search: Updater<string>) => {
    setSearch(search);
    setPagination({ ...pagination, pageIndex: 0 });
  }, 500);

  const handleFiltersChange = (newFilters: ExpenseFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  const invalidateExpenseList = () => {
    queryClient.invalidateQueries({
      queryKey: ExpenseQueryKeys.list(queryParams),
    });
  };

  const handleVerify = (id: string) => {
    verifyExpense(id, {
      onSuccess: () => {
        invalidateExpenseList();
        toast.success('Expense verified! 🎉');
      },
      onError: (error) => {
        toast.error('Failed to verify expense', {
          description: error.message,
        });
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteExpense(
      id,
      handleDeleteWithPagination({
        currentPageData: data?.data ?? [],
        onSuccess: () => {
          invalidateExpenseList();
          toast.success('Expense deleted! 🎉');
          setDeleteExpenseId(undefined);
        },
        onError: (error) => {
          toast.error('Failed to delete expense', {
            description: error.message,
          });
        },
      }),
    );
  };

  const columnsWithActions = columns.concat({
    id: 'Actions',
    header: 'Actions',
    accessorKey: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const status = row.original.status;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open expenses actions</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedExpense(row.original)}>
              View
            </DropdownMenuItem>
            {status !== ExpenseStatusEnum.VERIFIED && (
              <DropdownMenuItem onClick={() => handleVerify(id)}>Verify</DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => setEditExpense(row.original)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteExpenseId(id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  });

  const emptyState = (
    <div className="flex flex-col items-center justify-center h-full py-8">
      <p className="text-lg text-muted-foreground pb-1">No expenses found.</p>
      <p className="text-sm text-muted-foreground">
        Click "Add Expense" to start adding expenses or check the filters
      </p>
      <Button variant="link" onClick={() => setAddExpenseModalOpen(true)} className="mt-4">
        <Plus className="size-4" />
        Add Expense
      </Button>{' '}
    </div>
  );

  return (
    <>
      <DataTable<IExpenseRes, unknown>
        loading={isLoading}
        error={isError ? 'Failed to fetch expenses' : ''}
        emptyState={emptyState}
        columns={columnsWithActions}
        data={data?.data ?? []}
        pageCount={data?.count ? Math.ceil(data.count / pagination.pageSize) : 0}
        sorting={sorting}
        onSortingChange={setSorting}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={(search) => handleSearch(search)}
        searchValue={search}
        searchPlaceholder="Search expenses..."
        filtersSlot={
          <ExpensesTableFilters filters={filters} onFiltersChange={handleFiltersChange} />
        }
        rightSlot={
          <div className="flex gap-4">
            <CompoundButton
              onMainClick={() => setAddExpenseModalOpen(true)}
              dropdownItems={[
                {
                  label: 'Process Multiple Expenses',
                  onClick: () => setMultipleAutoExpensesFormOpen(true),
                },
              ]}
            >
              <Plus />
              <span className="hidden md:block">Add Expense</span>
            </CompoundButton>
          </div>
        }
      />

      <ExpenseDetails
        expense={selectedExpense}
        open={!!selectedExpense}
        onOpenChange={(open) => !open && setSelectedExpense(undefined)}
      />
      <DeleteExpense
        deleteExpenseId={deleteExpenseId}
        handleDelete={handleDelete}
        onClose={() => setDeleteExpenseId(undefined)}
      />
      <AddExpense
        open={addExpenseModalOpen}
        onOpenChange={setAddExpenseModalOpen}
        onExpenseAdded={invalidateExpenseList}
      />
      <EditExpense
        expense={editExpense}
        open={!!editExpense}
        onOpenChange={(open) => !open && setEditExpense(undefined)}
        onExpenseUpdated={invalidateExpenseList}
      />
      <MultipleAutoExpensesForm
        open={multipleAutoExpensesFormOpen}
        onOpenChange={setMultipleAutoExpensesFormOpen}
        onExpenseAdded={invalidateExpenseList}
      />
    </>
  );
}

export default ExpensesTable;
