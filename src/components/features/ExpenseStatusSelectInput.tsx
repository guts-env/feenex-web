import { type ControllerRenderProps, type FieldValues, type Path } from 'react-hook-form'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ExpenseStatusEnum } from '@/constants/enums'
import capitalize from 'lodash/capitalize'

interface ExpenseStatusSelectInputProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>
  label?: string
  placeholder?: string
}

function ExpenseStatusSelectInput<T extends FieldValues>({
  field,
  label = 'Status',
  placeholder = 'Select status',
}: ExpenseStatusSelectInputProps<T>) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {Object.values(ExpenseStatusEnum).map((status) => (
            <SelectItem key={status} value={status}>
              {capitalize(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )
}

export default ExpenseStatusSelectInput
