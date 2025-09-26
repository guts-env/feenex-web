import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Filter } from 'lucide-react';
import capitalize from 'lodash/capitalize';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { CategoryQueryKeys } from '@/api/services/CategoryService/config';
import CategoryQuery from '@/api/services/CategoryService/query';
import { ExpenseStatusEnum } from '@/constants/enums';
import { cn } from '@/lib/utils';
import { type ICategoryRes } from '@/types/api';

export interface IExpenseFilters {
  startDate?: string;
  endDate?: string;
  paymentStartDate?: string;
  paymentEndDate?: string;
  invoiceStartDate?: string;
  invoiceEndDate?: string;
  categoryIds?: string[];
  statuses?: ExpenseStatusEnum[];
  minAmount?: number;
  maxAmount?: number;
}

interface ExpensesTableFiltersProps {
  filters: IExpenseFilters;
  onFiltersChange: (filters: IExpenseFilters) => void;
}

interface FilterContentProps {
  localFilters: IExpenseFilters;
  setLocalFilters: (filters: IExpenseFilters) => void;
  categories?: ICategoryRes[];
  handleCategoryToggle: (categoryId: string) => void;
  handleStatusToggle: (status: ExpenseStatusEnum) => void;
  hasActiveFilters: boolean;
  handleClearFilters: () => void;
  handleApplyFilters: () => void;
  onClose: () => void;
}

function FilterContent({
  localFilters,
  setLocalFilters,
  categories,
  handleCategoryToggle,
  handleStatusToggle,
  handleApplyFilters,
  onClose,
}: FilterContentProps) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Label className="text-xs text-primary">Created Date Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground pb-2">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !localFilters.startDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="size-4" />
                      {localFilters.startDate
                        ? format(new Date(localFilters.startDate), 'MMM dd')
                        : 'From'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        localFilters.startDate ? new Date(localFilters.startDate) : undefined
                      }
                      defaultMonth={
                        localFilters.startDate ? new Date(localFilters.startDate) : undefined
                      }
                      onSelect={(date) => {
                        setLocalFilters({
                          ...localFilters,
                          startDate: date ? format(date, 'yyyy-MM-dd') : undefined,
                        });
                      }}
                      disabled={(date) => date > new Date()}
                      classNames={{
                        today: localFilters.startDate
                          ? undefined
                          : 'text-foreground bg-transparent',
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground pb-2">To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !localFilters.endDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="size-4" />
                      {localFilters.endDate
                        ? format(new Date(localFilters.endDate), 'MMM dd')
                        : 'To'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localFilters.endDate ? new Date(localFilters.endDate) : undefined}
                      defaultMonth={
                        localFilters.endDate ? new Date(localFilters.endDate) : undefined
                      }
                      onSelect={(date) => {
                        setLocalFilters({
                          ...localFilters,
                          endDate: date ? format(date, 'yyyy-MM-dd') : undefined,
                        });
                      }}
                      disabled={(date) =>
                        date > new Date() ||
                        !!(localFilters.startDate && date < new Date(localFilters.startDate))
                      }
                      classNames={{
                        today: localFilters.endDate ? undefined : 'text-foreground bg-transparent',
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-xs text-primary">Payment Date Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground pb-2">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !localFilters.paymentStartDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="size-4" />
                      {localFilters.paymentStartDate
                        ? format(new Date(localFilters.paymentStartDate), 'MMM dd')
                        : 'From'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        localFilters.paymentStartDate
                          ? new Date(localFilters.paymentStartDate)
                          : undefined
                      }
                      defaultMonth={
                        localFilters.paymentStartDate
                          ? new Date(localFilters.paymentStartDate)
                          : undefined
                      }
                      onSelect={(date) => {
                        setLocalFilters({
                          ...localFilters,
                          paymentStartDate: date ? format(date, 'yyyy-MM-dd') : undefined,
                        });
                      }}
                      disabled={(date) => date > new Date()}
                      classNames={{
                        today: localFilters.paymentStartDate
                          ? undefined
                          : 'text-foreground bg-transparent',
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground pb-2">To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !localFilters.paymentEndDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="size-4" />
                      {localFilters.paymentEndDate
                        ? format(new Date(localFilters.paymentEndDate), 'MMM dd')
                        : 'To'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        localFilters.paymentEndDate
                          ? new Date(localFilters.paymentEndDate)
                          : undefined
                      }
                      defaultMonth={
                        localFilters.paymentEndDate
                          ? new Date(localFilters.paymentEndDate)
                          : undefined
                      }
                      onSelect={(date) => {
                        setLocalFilters({
                          ...localFilters,
                          paymentEndDate: date ? format(date, 'yyyy-MM-dd') : undefined,
                        });
                      }}
                      disabled={(date) =>
                        date > new Date() ||
                        !!(
                          localFilters.paymentStartDate &&
                          date < new Date(localFilters.paymentStartDate)
                        )
                      }
                      classNames={{
                        today: localFilters.paymentEndDate
                          ? undefined
                          : 'text-foreground bg-transparent',
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-xs text-primary">Invoice Date Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground pb-2">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !localFilters.invoiceStartDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="size-4" />
                      {localFilters.invoiceStartDate
                        ? format(new Date(localFilters.invoiceStartDate), 'MMM dd')
                        : 'From'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        localFilters.invoiceStartDate
                          ? new Date(localFilters.invoiceStartDate)
                          : undefined
                      }
                      defaultMonth={
                        localFilters.invoiceStartDate
                          ? new Date(localFilters.invoiceStartDate)
                          : undefined
                      }
                      onSelect={(date) => {
                        setLocalFilters({
                          ...localFilters,
                          invoiceStartDate: date ? format(date, 'yyyy-MM-dd') : undefined,
                        });
                      }}
                      disabled={(date) => date > new Date()}
                      classNames={{
                        today: localFilters.invoiceStartDate
                          ? undefined
                          : 'text-foreground bg-transparent',
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground pb-2">To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !localFilters.invoiceEndDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="size-4" />
                      {localFilters.invoiceEndDate
                        ? format(new Date(localFilters.invoiceEndDate), 'MMM dd')
                        : 'To'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        localFilters.invoiceEndDate
                          ? new Date(localFilters.invoiceEndDate)
                          : undefined
                      }
                      defaultMonth={
                        localFilters.invoiceEndDate
                          ? new Date(localFilters.invoiceEndDate)
                          : undefined
                      }
                      onSelect={(date) => {
                        setLocalFilters({
                          ...localFilters,
                          invoiceEndDate: date ? format(date, 'yyyy-MM-dd') : undefined,
                        });
                      }}
                      disabled={(date) =>
                        date > new Date() ||
                        !!(
                          localFilters.invoiceStartDate &&
                          date < new Date(localFilters.invoiceStartDate)
                        )
                      }
                      classNames={{
                        today: localFilters.invoiceEndDate
                          ? undefined
                          : 'text-foreground bg-transparent',
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-xs text-primary">Amount Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground pb-2">Min</Label>
                <Input
                  type="number"
                  placeholder="0"
                  step="0.01"
                  value={localFilters.minAmount || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setLocalFilters({
                        ...localFilters,
                        minAmount: undefined,
                      });
                      return;
                    }

                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                      const roundedValue = Math.round(numValue * 100) / 100;
                      setLocalFilters({
                        ...localFilters,
                        minAmount: roundedValue,
                      });
                    }
                  }}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground pb-2">Max</Label>
                <Input
                  type="number"
                  placeholder="0"
                  step="0.01"
                  value={localFilters.maxAmount || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setLocalFilters({
                        ...localFilters,
                        maxAmount: undefined,
                      });
                      return;
                    }

                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                      const roundedValue = Math.round(numValue * 100) / 100;
                      setLocalFilters({
                        ...localFilters,
                        maxAmount: roundedValue,
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-primary">Status</Label>
              {(localFilters.statuses?.length || 0) > 0 && (
                <Badge
                  variant="outline"
                  className={cn('text-xs h-5', 'border-primary text-primary')}
                >
                  {localFilters.statuses!.length} selected
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.values(ExpenseStatusEnum).map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={(localFilters.statuses || []).includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  />
                  <Label
                    htmlFor={`status-${status}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {capitalize(status)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-primary">Categories</Label>
              {(localFilters.categoryIds?.length || 0) > 0 && (
                <Badge
                  variant="outline"
                  className={cn('text-xs h-5', 'border-primary text-primary')}
                >
                  {localFilters.categoryIds!.length} selected
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {categories?.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={(localFilters.categoryIds || []).includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t p-6 flex-shrink-0 bg-background">
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="button" className="flex-1" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ExpensesTableFilters({ filters, onFiltersChange }: ExpensesTableFiltersProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<IExpenseFilters>(filters);

  const { data: categories } = useQuery({
    queryKey: CategoryQueryKeys.list(),
    queryFn: () => CategoryQuery.list(),
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(filters).some((key) => {
    const value = filters[key as keyof IExpenseFilters];
    return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== '';
  });

  const activeFilterCount = Object.keys(filters).filter((key) => {
    const value = filters[key as keyof IExpenseFilters];
    return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== '';
  }).length;

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = localFilters.categoryIds || [];
    const isSelected = currentCategories.includes(categoryId);

    if (isSelected) {
      setLocalFilters({
        ...localFilters,
        categoryIds: currentCategories.filter((id) => id !== categoryId),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        categoryIds: [...currentCategories, categoryId],
      });
    }
  };

  const handleStatusToggle = (status: ExpenseStatusEnum) => {
    const currentStatuses = localFilters.statuses || [];
    const isSelected = currentStatuses.includes(status);

    if (isSelected) {
      setLocalFilters({
        ...localFilters,
        statuses: currentStatuses.filter((s) => s !== status),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        statuses: [...currentStatuses, status],
      });
    }
  };

  const filterButton = (
    <Button variant="outline">
      <Filter className="size-4" />
      Filters
      {activeFilterCount > 0 && (
        <Badge className="ml-1 h-5 w-5 p-0 text-xs">{activeFilterCount}</Badge>
      )}
    </Button>
  );

  const filterContent = (
    <FilterContent
      localFilters={localFilters}
      setLocalFilters={setLocalFilters}
      categories={categories}
      handleCategoryToggle={handleCategoryToggle}
      handleStatusToggle={handleStatusToggle}
      hasActiveFilters={hasActiveFilters}
      handleClearFilters={handleClearFilters}
      handleApplyFilters={handleApplyFilters}
      onClose={() => setOpen(false)}
    />
  );

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{filterButton}</SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-hidden p-0 flex flex-col gap-0"
        >
          <SheetHeader className="border-b p-6 flex flex-row items-center gap-4">
            <SheetTitle>Filters</SheetTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear all
              </Button>
            )}
          </SheetHeader>
          {filterContent}
        </SheetContent>
      </Sheet>
    </div>
  );
}
