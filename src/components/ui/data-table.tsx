import { useState } from 'react';
import {
  AlertCircleIcon,
  ChevronDown,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type PaginationState,
  type RowSelectionState,
  type VisibilityState,
  type ColumnFiltersState,
  type SortingState,
  type OnChangeFn,
  type Column,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DataTableProps<TData, TValue> {
  loading: boolean;
  error: string;
  emptyState?: React.ReactNode;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  onSearchChange?: OnChangeFn<string>;
  searchValue?: string;
  searchPlaceholder?: string;
  rightSlot?: React.ReactNode;
  hideColumnFilter?: boolean;
  filtersSlot?: React.ReactNode;
}

function SortableHeader<TData, TValue>({
  column,
  children,
}: {
  column: Column<TData, TValue>;
  children: React.ReactNode;
}) {
  const canSort = column.getCanSort();

  if (!canSort) {
    return <span>{children}</span>;
  }

  const isSorted = column.getIsSorted();

  const handleSort = () => {
    if (isSorted === 'asc') {
      column.toggleSorting(true);
    } else if (isSorted === 'desc') {
      column.clearSorting();
    } else {
      column.toggleSorting(false);
    }
  };

  return (
    <div className="h-auto font-medium cursor-pointer group" onClick={handleSort}>
      <span className="flex items-center gap-2">
        {children}
        <span className="opacity-50 group-hover:opacity-100 transition-opacity">
          {isSorted === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : isSorted === 'desc' ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </span>
      </span>
    </div>
  );
}

function DataTableSkeleton({
  columnLength,
  hasSearch,
  hasColumnFilter,
  hasRightSlot,
}: {
  columnLength: number;
  hasSearch?: boolean;
  hasColumnFilter?: boolean;
  hasRightSlot?: boolean;
}) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {hasSearch && (
            <div className="relative w-full md:w-sm">
              <Skeleton className="h-10 w-full pl-7" />
              <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            </div>
          )}
          {hasColumnFilter && <Skeleton className="h-10 w-24" />}
        </div>

        {hasRightSlot && <Skeleton className="h-10 w-20" />}
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnLength }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnLength }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function DataTable<TData, TValue>({
  loading,
  error,
  emptyState = 'No results',
  columns,
  data,
  pageCount,
  sorting,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  pagination,
  onPaginationChange,
  onSearchChange,
  searchValue,
  searchPlaceholder,
  rightSlot,
  hideColumnFilter,
  filtersSlot,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    onSortingChange: onSortingChange,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: onRowSelectionChange,
    onPaginationChange: onPaginationChange,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  if (loading) {
    return (
      <DataTableSkeleton
        columnLength={columns.length}
        hasSearch={!!onSearchChange}
        hasColumnFilter={!hideColumnFilter}
        hasRightSlot={!!rightSlot}
      />
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          <p>{error}</p>
        </AlertDescription>
      </Alert>
    );
  }

  const columnFiltersSlot = hideColumnFilter ? null : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-fit">
          Columns <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.columnDef.header as React.ReactNode}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col-reverse md:flex-row gap-4 pb-4 md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {onSearchChange && (
            <div className="relative w-full md:w-sm">
              <Input
                placeholder={searchPlaceholder}
                defaultValue={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full pl-7"
              />
              <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            </div>
          )}
          <div className="hidden md:block">{filtersSlot}</div>
          <div className="hidden md:block">{columnFiltersSlot}</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="md:hidden">{filtersSlot}</div>
          <div className="md:hidden">{columnFiltersSlot}</div>
          {rightSlot}
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <SortableHeader column={header.column}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </SortableHeader>
                      ) : (
                        <span className="py-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableHead colSpan={columns.length} className="h-24 text-center">
                  {emptyState}
                </TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// Export the SortableHeader component for use in column definitions
export { SortableHeader };
