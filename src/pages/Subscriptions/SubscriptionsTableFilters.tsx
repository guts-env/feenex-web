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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { CategoryQueryKeys } from '@/api/services/CategoryService/config';
import CategoryQuery from '@/api/services/CategoryService/query';
import { SubscriptionStatusEnum, RecurringFrequencyEnum } from '@/constants/enums';
import { cn } from '@/lib/utils';

export interface ISubscriptionFilters {
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
  statuses?: SubscriptionStatusEnum[];
  frequency?: RecurringFrequencyEnum;
  minAmount?: number;
  maxAmount?: number;
  isVat?: boolean;
}

interface SubscriptionsTableFiltersProps {
  filters: ISubscriptionFilters;
  onFiltersChange: (filters: ISubscriptionFilters) => void;
}

export function SubscriptionsTableFilters({ filters, onFiltersChange }: SubscriptionsTableFiltersProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ISubscriptionFilters>(filters);

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
    setOpen(false);
  };

  const hasActiveFilters = Object.keys(filters).some((key) => {
    const value = filters[key as keyof ISubscriptionFilters];
    return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== '';
  });

  const activeFilterCount = Object.keys(filters).filter((key) => {
    const value = filters[key as keyof ISubscriptionFilters];
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

  const handleStatusToggle = (status: SubscriptionStatusEnum) => {
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

  const handleFrequencyChange = (frequency: RecurringFrequencyEnum | undefined) => {
    setLocalFilters({
      ...localFilters,
      frequency: frequency || undefined,
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter className="size-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 text-xs">{activeFilterCount}</Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-2rem)] md:w-80 md:mx-0" align="start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear all
                </Button>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-xs text-primary">Date Range</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground pb-1">From</Label>
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
                          today: localFilters.startDate ? undefined : "text-foreground bg-transparent"
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground pb-1">To</Label>
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
                          today: localFilters.endDate ? undefined : "text-foreground bg-transparent"
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-primary">Categories</p>
                {(localFilters.categoryIds?.length || 0) > 0 && (
                  <Badge
                    variant="outline"
                    className={cn('text-xs h-5', 'border-primary text-primary')}
                  >
                    {localFilters.categoryIds!.length} selected
                  </Badge>
                )}
              </div>
              <div className="border rounded-md">
                <ScrollArea className="h-32">
                  <div className="p-2 space-y-2">
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
                </ScrollArea>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-primary">Status</p>
                {(localFilters.statuses?.length || 0) > 0 && (
                  <Badge
                    variant="outline"
                    className={cn('text-xs h-5', 'border-primary text-primary')}
                  >
                    {localFilters.statuses!.length} selected
                  </Badge>
                )}
              </div>
              <div className="border rounded-md">
                <div className="p-2 space-y-2">
                  {Object.values(SubscriptionStatusEnum).map((status) => (
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
            </div>

            <div className="space-y-2">
              <p className="text-xs text-primary">Frequency</p>
              <Select
                value={localFilters.frequency}
                onValueChange={(value) => handleFrequencyChange(value as RecurringFrequencyEnum)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RecurringFrequencyEnum).map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {capitalize(freq)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-primary">Amount Range</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground pb-1">Min</Label>
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
                  <Label className="text-xs text-muted-foreground pb-1">Max</Label>
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

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVat"
                  checked={localFilters.isVat === true}
                  onCheckedChange={(checked) => {
                    setLocalFilters({
                      ...localFilters,
                      isVat: checked === true ? true : undefined,
                    });
                  }}
                />
                <Label
                  htmlFor="isVat"
                  className="text-sm font-normal cursor-pointer"
                >
                  VAT only
                </Label>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}