import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef, type SortingState, type Updater } from '@tanstack/react-table';
import debounce from 'lodash/debounce';
import { MoreHorizontal, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';

import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SortOrderEnum } from '@/constants/enums';
import { type ISubscriptionRes } from '@/types/api';
import { SubscriptionQueryKeys } from '@/api/services/SubscriptionService/config';
import SubscriptionQuery from '@/api/services/SubscriptionService/query';
import { useDeleteSubscription } from '@/api/services/SubscriptionService/mutation';
import queryClient from '@/api/queryClient';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import SubscriptionStatusBadge from '@/pages/Subscriptions/SubscriptionStatusBadge';
import {
  SubscriptionsTableFilters,
  type ISubscriptionFilters,
} from '@/pages/Subscriptions/SubscriptionsTableFilters';
import AddSubscription from '@/pages/Subscriptions/AddSubscription';
import EditSubscription from '@/pages/Subscriptions/EditSubscription';
import SubscriptionDetails from '@/pages/Subscriptions/ViewSubscription';
import { SubscriptionCard } from '@/components/features/SubscriptionCard';
import { SubscriptionCardSkeleton } from '@/components/features/SubscriptionCardSkeleton';

const columns: ColumnDef<ISubscriptionRes>[] = [
  {
    id: 'merchant_name',
    header: 'Subscription',
    accessorKey: 'merchantName',
    cell: ({ row }) => {
      const merchantName = row.original.merchantName;
      const truncatedName =
        merchantName.length > 30 ? `${merchantName.substring(0, 30)}...` : merchantName;
      const isTruncated = merchantName.length > 30;

      return (
        <div className="flex items-center gap-2">
          {isTruncated ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{truncatedName}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{merchantName}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span>{merchantName}</span>
          )}
        </div>
      );
    },
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
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
    id: 'billing_date',
    header: 'Next Billing',
    accessorKey: 'billingDate',
    cell: ({ row }) => {
      return <span>{format(new Date(row.original.billingDate), 'MMM dd, yyyy')}</span>;
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <SubscriptionStatusBadge status={row.original.status} />
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
      return row.original.category?.name ? (
        <Badge variant="secondary">{row.original.category.name}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    id: 'start_date',
    header: 'Start Date',
    accessorKey: 'startDate',
    cell: ({ row }) => {
      return <span>{format(new Date(row.original.startDate), 'MMM dd, yyyy')}</span>;
    },
  },
];

function SubscriptionsTable() {
  const location = useLocation();

  /* Table State */
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [search, setSearch] = useState('');

  const getInitialFilters = (): ISubscriptionFilters => {
    const state = location.state as { initialFilters?: ISubscriptionFilters } | null;
    return state?.initialFilters || {};
  };

  const [filters, setFilters] = useState<ISubscriptionFilters>(getInitialFilters());

  /* Modals and Sheets */
  const [selectedSubscription, setSelectedSubscription] = useState<ISubscriptionRes | undefined>(
    undefined,
  );
  const [deleteSubscriptionId, setDeleteSubscriptionId] = useState<string | undefined>(undefined);
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [editSubscription, setEditSubscription] = useState<ISubscriptionRes | undefined>(undefined);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
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

  const { data, isLoading, isError } = useQuery({
    queryKey: SubscriptionQueryKeys.list(queryParams),
    queryFn: async () => {
      const result = await SubscriptionQuery.list(queryParams);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return result;
    },
  });

  const { mutate: deleteSubscription } = useDeleteSubscription();

  const handleSearch = debounce((search: Updater<string>) => {
    setSearch(search);
    setPagination({ ...pagination, pageIndex: 0 });
  }, 500);

  const handleFiltersChange = (newFilters: ISubscriptionFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  const invalidateSubscriptionList = () => {
    queryClient.invalidateQueries({
      queryKey: SubscriptionQueryKeys.list(queryParams),
    });
  };

  const handleDelete = () => {
    if (!deleteSubscriptionId) return;

    deleteSubscription(deleteSubscriptionId, {
      onSuccess: () => {
        invalidateSubscriptionList();
        toast.success('Subscription deleted successfully');
        setDeleteSubscriptionId(undefined);
      },
      onError: (error) => {
        toast.error('Failed to delete subscription', {
          description: error.message,
        });
        setDeleteSubscriptionId(undefined);
      },
    });
  };

  const handleSubscriptionAdded = () => {
    invalidateSubscriptionList();
    setShowAddSubscription(false);
  };

  const handleSubscriptionUpdated = () => {
    invalidateSubscriptionList();
    setEditSubscription(undefined);
  };

  const columnsWithActions = columns.concat({
    id: 'Actions',
    header: 'Actions',
    accessorKey: 'actions',
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      const id = row.original.id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open subscription actions</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedSubscription(row.original)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditSubscription(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteSubscriptionId(id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  });

  const emptyState = (
    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
      <p className="text-lg text-muted-foreground pb-1">No subscriptions found.</p>
      <p className="text-sm text-muted-foreground">
        Click "Add Subscription" to start managing your subscriptions
      </p>
      <Button variant="link" onClick={() => setShowAddSubscription(true)} className="mt-4">
        <Plus className="size-4" />
        Add Subscription
      </Button>
    </div>
  );

  const mobileSubscriptionsList = (
    <div className="space-y-4">
      {data?.data?.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onView={() => setSelectedSubscription(subscription)}
          onEdit={() => setEditSubscription(subscription)}
          onDelete={() => setDeleteSubscriptionId(subscription.id)}
        />
      ))}
    </div>
  );

  return (
    <>
      <DataTable<ISubscriptionRes, unknown>
        loading={isLoading}
        error={isError ? 'Failed to fetch subscriptions' : ''}
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
        searchPlaceholder="Search subscriptions..."
        filtersSlot={
          <SubscriptionsTableFilters filters={filters} onFiltersChange={handleFiltersChange} />
        }
        rightSlot={
          <div className="flex gap-4">
            <Button onClick={() => setShowAddSubscription(true)}>
              <Plus />
              <span className="hidden md:block">Add Subscription</span>
            </Button>
          </div>
        }
        mobileContent={mobileSubscriptionsList}
        mobileSkeleton={<SubscriptionCardSkeleton />}
      />

      <DeleteDialog
        open={!!deleteSubscriptionId}
        onOpenChange={(open) => !open && setDeleteSubscriptionId(undefined)}
        onConfirm={handleDelete}
        title="Delete Subscription"
        description="Are you sure you want to delete this subscription? This action cannot be undone."
      />

      <AddSubscription
        open={showAddSubscription}
        onOpenChange={setShowAddSubscription}
        onSubscriptionAdded={handleSubscriptionAdded}
      />

      <EditSubscription
        subscription={editSubscription}
        open={!!editSubscription}
        onOpenChange={(open) => !open && setEditSubscription(undefined)}
        onSubscriptionUpdated={handleSubscriptionUpdated}
      />

      <SubscriptionDetails
        subscription={selectedSubscription}
        open={!!selectedSubscription}
        onOpenChange={(open) => !open && setSelectedSubscription(undefined)}
      />
    </>
  );
}

export default SubscriptionsTable;
