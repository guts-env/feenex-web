import { useQuery } from '@tanstack/react-query';
import { type ControllerRenderProps, type FieldValues, type Path } from 'react-hook-form';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryQueryKeys } from '@/api/services/CategoryService/config';
import CategoryQuery from '@/api/services/CategoryService/query';

interface CategoriesSelectInputProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  label?: string;
  placeholder?: string;
}

function CategoriesSelectInput<T extends FieldValues>({
  field,
  label = 'Category',
  placeholder = 'Select category',
}: CategoriesSelectInputProps<T>) {
  const { data: categories } = useQuery({
    queryKey: CategoryQueryKeys.list(),
    queryFn: () => CategoryQuery.list(),
    enabled: true,
  });

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
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

export default CategoriesSelectInput;
