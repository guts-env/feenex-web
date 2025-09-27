import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef, type SortingState, type Updater } from '@tanstack/react-table';
import { useShallow } from 'zustand/react/shallow';
import debounce from 'lodash/debounce';
import { MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import queryClient from '@/api/queryClient';
import { ExpenseQueryKeys } from '@/api/services/ExpenseService/config';
import ExpenseQuery from '@/api/services/ExpenseService/query';
import { useDeleteExpense, useVerifyExpense } from '@/api/services/ExpenseService/mutation';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/stores/useUserStore';
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
import { ExpenseStatusEnum, SortOrderEnum, RoleEnum } from '@/constants/enums';
import { type IExpenseRes } from '@/types/api';
import { CompoundButton } from '@/components/ui/compound-button';
import MultipleAutoExpensesForm from './MultipleAutoExpensesForm';
import { usePaginationOnDelete } from '@/hooks/usePaginationOnDelete';
import {
  ExpensesTableFilters,
  type IExpenseFilters,
} from '@/components/features/ExpensesTableFilters';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ExpenseCard } from '@/components/features/ExpenseCard';

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
    id: 'merchant_name',
    header: 'Merchant Name',
    accessorKey: 'merchantName',
    cell: ({ row }) => {
      const isProcessing = row.original.processingStatus === 'processing';
      const merchantName = row.original.merchantName;
      const truncatedName =
        merchantName.length > 30 ? `${merchantName.substring(0, 30)}...` : merchantName;
      const isTruncated = merchantName.length > 30;

      return (
        <div className="flex items-center gap-2">
          {isProcessing && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          {isTruncated ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={isProcessing ? 'text-muted-foreground' : ''}>{truncatedName}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{merchantName}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className={isProcessing ? 'text-muted-foreground' : ''}>{merchantName}</span>
          )}
        </div>
      );
    },
  },
  {
    id: 'or_number',
    header: 'OR Number',
    accessorKey: 'orNumber',
    cell: ({ row }) => {
      const isProcessing = row.original.processingStatus === 'processing';
      return (
        <span>
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Processing...</span>
            </div>
          ) : (
            row.original.orNumber
          )}
        </span>
      );
    },
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const isProcessing = row.original.processingStatus === 'processing';

      if (isProcessing) {
        return null;
      }

      return (
        <span>
          {Intl.NumberFormat('ph-PH', { style: 'currency', currency: 'PHP' }).format(
            row.original.amount,
          )}
        </span>
      );
    },
  },
  {
    id: 'vat',
    accessorKey: 'vat',
    header: 'VAT',
    cell: ({ row }) => {
      const isProcessing = row.original.processingStatus === 'processing';

      if (isProcessing) {
        return null;
      }

      return (
        <span>
          {Intl.NumberFormat('ph-PH', { style: 'currency', currency: 'PHP' }).format(
            row.original.vat ?? 0,
          )}
        </span>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => {
      const isProcessing = row.original.processingStatus === 'processing';

      if (isProcessing) {
        return null;
      }

      return (
        <div className="flex items-center gap-2">
          <ExpenseStatusBadge status={row.original.status} />
        </div>
      );
    },
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Category',
    enableSorting: false,
    cell: ({ row }) => {
      const isProcessing = row.original.processingStatus === 'processing';

      if (isProcessing) {
        return null;
      }

      return row.original.category?.name ? (
        <Badge variant="secondary">{row.original.category.name}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    id: 'invoice_date',
    header: 'Invoice Date',
    accessorKey: 'invoiceDate',
    cell: ({ row }) => {
      const isProcessing = row.original.processingStatus === 'processing';

      if (isProcessing) {
        return null;
      }

      return <span>{format(row.original.invoiceDate, 'MMM dd, yyyy')}</span>;
    },
  },
  {
    id: 'payment_date',
    header: 'Payment Date',
    accessorKey: 'paymentDate',
    cell: ({ row }) => {
      const isProcessing = row.original.processingStatus === 'processing';

      if (isProcessing) {
        return null;
      }

      return <span>{format(row.original.paymentDate, 'MMM dd, yyyy')}</span>;
    },
  },
  {
    id: 'created_at',
    header: 'Created At',
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      const isProcessing = row.original.processingStatus === 'processing';

      if (isProcessing) {
        return null;
      }

      return <span>{format(row.original.createdAt, 'MMM dd, yyyy')}</span>;
    },
  },
];

function ExpensesTable() {
  const location = useLocation();
  const { user } = useUserStore(useShallow((state) => ({ user: state.user })));

  const userRole = user?.role.name;
  const isAdmin = userRole === RoleEnum.BUSINESS_ADMIN || userRole === RoleEnum.PERSONAL_ADMIN;
  const isManager = userRole === RoleEnum.MANAGER;
  const isMember = userRole === RoleEnum.MEMBER;

  const canVerify = isAdmin || isManager;

  /* Table State */
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [search, setSearch] = useState('');

  const getInitialFilters = (): IExpenseFilters => {
    const state = location.state as { initialFilters?: IExpenseFilters } | null;
    return state?.initialFilters || {};
  };

  const [filters, setFilters] = useState<IExpenseFilters>(getInitialFilters());

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

  const queryParams = useMemo(
    () => ({
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      search,
      ...filters,
      orderBy:
        sorting.length > 0
          ? {
              field: sorting[0].id,
              order: sorting[0].desc ? SortOrderEnum.DESC : SortOrderEnum.ASC,
            }
          : undefined,
    }),
    [pagination, search, filters, sorting],
  );

  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ExpenseQueryKeys.list(queryParams),
    queryFn: async () => {
      const result = await ExpenseQuery.list(queryParams);

      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        count: result.count,
        data: result.data.map((expense) => ({
          ...expense,
          items: undefined /* temporary to hide items */,
        })),
      };
    },
  });

  const { mutate: deleteExpense } = useDeleteExpense();
  const { mutate: verifyExpense } = useVerifyExpense();

  useExpenseSocket(data?.data ?? [], refetch);

  const handleSearch = debounce((search: Updater<string>) => {
    setSearch(search);
    setPagination({ ...pagination, pageIndex: 0 });
  }, 500);

  const handleFiltersChange = (newFilters: IExpenseFilters) => {
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
    enableSorting: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const status = row.original.status;
      const isProcessing = row.original.processingStatus === 'processing';

      const canDelete = isAdmin || isManager || (isMember && status !== ExpenseStatusEnum.VERIFIED);

      if (isProcessing) {
        return (
          <Button variant="ghost" className="h-8 w-8 p-0" disabled>
            <span className="sr-only">Open expenses actions</span>
            <MoreHorizontal />
          </Button>
        );
      }

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
            {canVerify && status !== ExpenseStatusEnum.VERIFIED && (
              <DropdownMenuItem onClick={() => handleVerify(id)}>Verify</DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => setEditExpense(row.original)}>Edit</DropdownMenuItem>
            {canDelete && (
              <DropdownMenuItem onClick={() => setDeleteExpenseId(id)}>Delete</DropdownMenuItem>
            )}
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
      </Button>
    </div>
  );


  const mobileExpensesList = (
    <div className="space-y-4">
      {data?.data?.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onView={() => setSelectedExpense(expense)}
          onEdit={() => setEditExpense(expense)}
          onDelete={() => setDeleteExpenseId(expense.id)}
          onVerify={() => handleVerify(expense.id)}
        />
      ))}
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
              <span className="hidden sm:block">Add Expense</span>
            </CompoundButton>
          </div>
        }
        mobileContent={mobileExpensesList}
      />

      <ExpenseDetails
        expense={selectedExpense}
        open={!!selectedExpense}
        onOpenChange={(open) => !open && setSelectedExpense(undefined)}
        onExpenseVerified={invalidateExpenseList}
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
