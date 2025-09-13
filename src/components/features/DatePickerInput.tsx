import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { type ControllerRenderProps, type FieldValues, type Path } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerInputProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePickerInput<T extends FieldValues>({
  field,
  label = 'Date',
  placeholder = 'Pick a date',
  disabled,
}: DatePickerInputProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button variant={'outline'} className={cn(!field.value && 'text-muted-foreground')}>
              {field.value ? format(field.value, 'MMMM dd, yyyy') : <span>{placeholder}</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={(date) => {
              if (date) {
                field.onChange(format(date, 'yyyy-MM-dd'));
              } else {
                field.onChange(undefined);
              }
              setOpen(false);
            }}
            disabled={(date) => disabled || date > new Date() || date < new Date('1900-01-01')}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
