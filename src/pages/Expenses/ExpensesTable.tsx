import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type PaginationState,
  type Updater,
} from '@tanstack/react-table'
import debounce from 'lodash/debounce'
import { MoreHorizontal, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import queryClient from '@/api/queryClient'
import { ExpenseQueryKeys } from '@/api/services/ExpenseService/config'
import ExpenseQuery from '@/api/services/ExpenseService/query'
import { useDeleteExpense, useVerifyExpense } from '@/api/services/ExpenseService/mutation'
import { DataTable } from '@/components/ui/data-table'
// import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import ExpenseStatusBadge from '@/components/features/ExpenseStatusBadge'
import ExpenseDetails from '@/pages/Expenses/ExpenseDetails'
import DeleteExpense from '@/pages/Expenses/DeleteExpense'
import AddExpense from '@/pages/Expenses/AddExpense'
import { ExpenseStatusEnum } from '@/constants/enums'
import { type IExpenseRes } from '@/types/api'

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
    cell: ({ row }) => Intl.NumberFormat('ph-PH', { style: 'currency', currency: 'PHP' }).format(row.original.amount),
  },
  {
    id: 'Date',
    header: 'Date',
    accessorKey: 'date',
    cell: ({ row }) => {
      return format(row.original.date, 'MMM dd, yyyy')
    },
  },
  {
    id: 'Status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <ExpenseStatusBadge status={row.original.status} />
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
]

function ExpensesTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [search, setSearch] = useState('')
  const [selectedExpense, setSelectedExpense] = useState<IExpenseRes | undefined>(undefined)
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | undefined>(undefined)
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ExpenseQueryKeys.list({
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      search,
    }),
    queryFn: () =>
      ExpenseQuery.list({ offset: pagination.pageIndex * pagination.pageSize, limit: pagination.pageSize, search }),
  })

  const { mutate: deleteExpense } = useDeleteExpense()
  const { mutate: verifyExpense } = useVerifyExpense()

  const handleSearch = debounce((search: Updater<string>) => {
    setSearch(search)
    setPagination({ ...pagination, pageIndex: 0 })
  }, 500)

  const invalidateExpenseList = () => {
    queryClient.invalidateQueries({
      queryKey: ExpenseQueryKeys.list({
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
        search,
      }),
    })
  }

  const handleVerify = (id: string) => {
    verifyExpense(id, {
      onSuccess: () => {
        invalidateExpenseList()
        toast.success('Expense verified! 🎉')
      },
      onError: (error) => {
        toast.error('Failed to verify expense', {
          description: error.message,
        })
      },
    })
  }

  const handleDelete = (id: string) => {
    deleteExpense(id, {
      onSuccess: () => {
        invalidateExpenseList()
        toast.success('Expense deleted! 🎉')
      },
      onError: (error) => {
        toast.error('Failed to delete expense', {
          description: error.message,
        })
      },
    })
  }

  const columnsWithActions = columns.concat({
    id: 'Actions',
    header: 'Actions',
    accessorKey: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id
      const status = row.original.status

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open expenses actions</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedExpense(row.original)}>View</DropdownMenuItem>
            {status !== ExpenseStatusEnum.VERIFIED && (
              <DropdownMenuItem onClick={() => handleVerify(id)}>Verify</DropdownMenuItem>
            )}
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteExpenseId(id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  })

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      <DataTable<IExpenseRes, unknown>
        columns={columnsWithActions}
        data={data?.data ?? []}
        pageCount={data?.count ? Math.ceil(data.count / pagination.pageSize) : 0}
        sorting={sorting}
        onSortingChange={setSorting}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={(search) => handleSearch(search)}
        searchPlaceholder="Search expenses..."
        rightSlot={
          <Button onClick={() => setAddExpenseModalOpen(true)}>
            <Plus />
            Add Expense
          </Button>
        }
      />
      <ExpenseDetails
        expense={selectedExpense}
        open={!!selectedExpense}
        onOpenChange={(open) => !open && setSelectedExpense(undefined)}
      />
      <DeleteExpense
        deleteExpenseId={deleteExpenseId}
        setDeleteExpenseId={setDeleteExpenseId}
        handleDelete={handleDelete}
      />
      <AddExpense
        open={addExpenseModalOpen}
        onOpenChange={setAddExpenseModalOpen}
        onExpenseAdded={invalidateExpenseList}
      />
    </div>
  )
}

export default ExpensesTable
