import { useState } from 'react';
import { type ControllerRenderProps, type FieldValues, type Path } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

export interface ExpenseOtherDetail {
  key?: string;
  value?: string;
}

export interface ExpenseOtherDetailError {
  message?: string;
  type?: string;
}

interface ExpenseOtherDetailsInputProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  label?: string;
  error?: Record<keyof ExpenseOtherDetail, ExpenseOtherDetailError>[];
}

function AddDetailButton({ addDetail }: { addDetail: () => void }) {
  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      onClick={addDetail}
      className="flex items-center justify-center gap-2 mx-auto cursor-pointer"
    >
      <Plus className="h-4 w-4" />
      Add Detail
    </Button>
  );
}

function ExpenseOtherDetailsInput<T extends FieldValues>({
  field,
  error,
}: ExpenseOtherDetailsInputProps<T>) {
  const [details, setDetails] = useState<ExpenseOtherDetail[]>(field.value || []);

  const addDetail = () => {
    const newDetails = [...details, { key: undefined, value: undefined }];
    setDetails(newDetails);
    field.onChange(newDetails);
  };

  const removeDetail = (index: number) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
    field.onChange(newDetails);
  };

  const updateDetail = (index: number, key: keyof ExpenseOtherDetail, value: string) => {
    const newDetails = [...details];
    newDetails[index] = { ...newDetails[index], [key]: value };
    setDetails(newDetails);
    field.onChange(newDetails);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-primary">Other Details</p>
      </div>

      {details.length === 0 ? (
        <Card className="text-center py-8 text-muted-foreground">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-md text-muted-foreground font-medium">No details added yet</p>
            <p className="text-xs mb-3">Click "Add Detail" to start adding details</p>
            <AddDetailButton addDetail={addDetail} />
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs text-muted-foreground font-medium">Label</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">Value</TableHead>
                <TableHead className="w-9"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((detail, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell className="p-1 align-top">
                    <div className="flex flex-col">
                      <Input
                        placeholder="Label"
                        value={detail.key || ''}
                        onChange={(e) => updateDetail(index, 'key', e.target.value)}
                        className={`border-0 shadow-none focus-visible:ring-0 ${
                          error?.[index]?.key?.message ? 'border-1 border-destructive' : ''
                        }`}
                      />
                      {error?.[index]?.key?.message && (
                        <p className="text-xs text-destructive mt-1 text-wrap">
                          {error?.[index].key.message}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-1 align-top">
                    <div className="flex flex-col">
                      <Input
                        placeholder="Value"
                        value={detail.value || ''}
                        onChange={(e) => updateDetail(index, 'value', e.target.value)}
                        className={`border-0 shadow-none focus-visible:ring-0 ${
                          error?.[index]?.value?.message ? 'border-1 border-destructive' : ''
                        }`}
                      />
                      {error?.[index]?.value?.message && (
                        <p className="text-xs text-destructive mt-1 text-wrap">
                          {error?.[index].value.message}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-1 w-9 align-top">
                    <Button
                      type="button"
                      variant="ghostDestructive"
                      size="icon"
                      onClick={() => removeDetail(index)}
                      tabIndex={-1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3} className="py-2">
                  <AddDetailButton addDetail={addDetail} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default ExpenseOtherDetailsInput;
