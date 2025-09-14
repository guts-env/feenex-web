import { useMemo, useState, useEffect } from 'react';
import { type ControllerRenderProps, type FieldValues, type Path } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

export interface ExpenseItem {
  name?: string;
  quantity: number;
  price?: number;
}

export interface ExpenseItemError {
  message?: string;
  type?: string;
}

interface ExpenseItemsInputProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  label?: string;
  error?: Record<keyof ExpenseItem, ExpenseItemError>[];
  onItemsChange?: (items: ExpenseItem[]) => void;
}

function AddItemButton({ addItem }: { addItem: () => void }) {
  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      onClick={addItem}
      className="flex items-center justify-center gap-2 mx-auto cursor-pointer"
    >
      <Plus className="h-4 w-4" />
      Add Item
    </Button>
  );
}

function ExpenseItemsInput<T extends FieldValues>({
  field,
  error,
  onItemsChange,
}: ExpenseItemsInputProps<T>) {
  const [items, setItems] = useState<ExpenseItem[]>(field.value || []);

  useEffect(() => {
    onItemsChange?.(items);
  }, [items, onItemsChange]);

  const addItem = () => {
    const newItems = [...items, { name: undefined, quantity: 1, price: undefined }];
    setItems(newItems);
    field.onChange(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    field.onChange(newItems);
  };

  const updateItem = (index: number, key: keyof ExpenseItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    setItems(newItems);
    field.onChange(newItems);
  };

  const memoizedTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0).toFixed(2);
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-primary">Items</p>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-8 text-muted-foreground">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-md text-muted-foreground font-medium">No items added yet</p>
            <p className="text-xs mb-3">Click "Add Item" to start adding items</p>
            <AddItemButton addItem={addItem} />
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs text-muted-foreground font-medium">
                  Item Name
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium w-20">
                  Qty
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium w-24">
                  Price
                </TableHead>
                <TableHead className="w-9"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell className="p-1 align-top">
                    <div className="flex flex-col">
                      <Input
                        placeholder="Item name"
                        value={item.name || ''}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        className={`border-0 shadow-none focus-visible:ring-0 ${
                          error?.[index]?.name?.message ? 'border-1 border-destructive' : ''
                        }`}
                      />
                      {error?.[index]?.name?.message && (
                        <p className="text-xs text-destructive mt-1 text-wrap">
                          {error?.[index].name.message}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-1 w-20 align-top">
                    <div className="flex flex-col">
                      <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, 'quantity', parseInt(e.target.value) || 1)
                        }
                        className={`w-full border-0 shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          error?.[index]?.quantity?.message ? 'border-1 border-destructive' : ''
                        }`}
                      />
                      {error?.[index]?.quantity?.message && (
                        <p className="text-xs text-destructive mt-1 text-wrap">
                          {error?.[index].quantity.message}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-1 w-24 align-top">
                    <div className="flex flex-col">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={item.price || ''}
                        onChange={(e) =>
                          updateItem(index, 'price', parseFloat(e.target.value) || 0)
                        }
                        className={`w-full border-0 shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          error?.[index]?.price?.message ? 'border-1 border-destructive' : ''
                        }`}
                      />
                      {error?.[index]?.price?.message && (
                        <p className="text-xs text-destructive mt-1 text-wrap">
                          {error?.[index].price.message}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-1 w-9 align-top">
                    <Button
                      type="button"
                      variant="ghostDestructive"
                      size="icon"
                      onClick={() => removeItem(index)}
                      tabIndex={-1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="py-2">
                  <AddItemButton addItem={addItem} />
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="w-24">
                  {Intl.NumberFormat('ph-PH', { style: 'currency', currency: 'PHP' }).format(
                    Number(memoizedTotal),
                  )}
                </TableCell>
                <TableCell className="w-9" />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
}

export default ExpenseItemsInput;
