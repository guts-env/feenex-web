import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAddManualExpenseForm } from '@/forms/hooks/useExpenseForm';
import CategoriesSelectInput from '@/components/features/CategoriesSelectInput';
import ExpenseStatusSelectInput from '@/components/features/ExpenseStatusSelectInput';
import { DatePickerInput } from '@/components/features/DatePickerInput';
import UploadPhotoInput, { type UploadedFile } from '@/components/features/UploadPhotoInput';
import ExpenseItemsInput, {
  type ExpenseItem,
  type ExpenseItemError,
} from '@/components/features/ExpenseItemsInput';
import { useCreateManualExpense } from '@/api/services/ExpenseService/mutation';
import { UploadStatusEnum, UploadTypeEnum } from '@/constants/enums';
import { type IAddManualExpenseFormValues } from '@/forms/schema/expenses';
import ExpenseOtherDetailsInput, {
  type ExpenseOtherDetail,
  type ExpenseOtherDetailError,
} from '@/components/features/ExpenseOtherDetailsInput';

interface AddExpenseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded?: (expense: IAddManualExpenseFormValues) => void;
}

function AddExpense({ open, onOpenChange, onExpenseAdded }: AddExpenseProps) {
  const form = useAddManualExpenseForm();

  const [photos, setPhotos] = useState<UploadedFile[]>([]);
  const [items, setItems] = useState<ExpenseItem[]>([]);

  const { mutate: createExpense } = useCreateManualExpense();

  const itemsTotal = items.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0);

  useEffect(() => {
    if (items.length > 0) {
      form.setValue('amount', itemsTotal);
    }
  }, [items, itemsTotal, form]);

  const handleUploadError = (error: string) => {
    form.setError('photos', { message: error });
  };

  const onSubmit = async (data: IAddManualExpenseFormValues) => {
    createExpense(data, {
      onSuccess: () => {
        toast.success('Expense created successfully');
        onExpenseAdded?.(data);
        handleClose();
      },
      onError: (error) => {
        toast.error('Failed to create expense', {
          description: error.message,
        });
      },
    });
  };

  const handleClose = () => {
    form.reset();
    setPhotos([]);
    setItems([]);
    onOpenChange(false);
  };

  const isSubmitBtnDisabled = () => {
    const isPhotoUploading = photos.some((photo) => photo.status === UploadStatusEnum.UPLOADING);
    return form.formState.isSubmitting || isPhotoUploading;
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-hidden p-0 flex flex-col gap-0"
      >
        <SheetHeader className="border-b p-6 flex-shrink-0">
          <SheetTitle>Add Expense</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <FormField
                    control={form.control}
                    name="photos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expense Photos</FormLabel>
                        <FormControl>
                          <UploadPhotoInput
                            type={UploadTypeEnum.RECEIPTS}
                            value={photos}
                            onChange={(files) => {
                              form.clearErrors('photos');
                              field.onChange(files.map((file) => file.key));
                              setPhotos(files);
                            }}
                            onUploadError={handleUploadError}
                            maxFiles={5}
                            maxSizeInMB={5}
                            className="h-[100px] w-[100px] border-dashed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FormField
                    control={form.control}
                    name="merchantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter merchant name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 w-full">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-primary">Total Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              min={0}
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              disabled={items.length > 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <FormField<IAddManualExpenseFormValues, 'date'>
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <DatePickerInput<IAddManualExpenseFormValues> field={field} />
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 w-full">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <div className="w-full">
                          <ExpenseStatusSelectInput<IAddManualExpenseFormValues> field={field} />
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <div className="w-full">
                          <CategoriesSelectInput<IAddManualExpenseFormValues> field={field} />
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <FormField
                    control={form.control}
                    name="items"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ExpenseItemsInput<IAddManualExpenseFormValues>
                            field={field}
                            error={
                              Array.isArray(form.formState.errors.items)
                                ? (form.formState.errors.items as Record<
                                    keyof ExpenseItem,
                                    ExpenseItemError
                                  >[])
                                : undefined
                            }
                            onItemsChange={setItems}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FormField
                    control={form.control}
                    name="otherDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ExpenseOtherDetailsInput<IAddManualExpenseFormValues>
                            field={field}
                            error={
                              Array.isArray(form.formState.errors.otherDetails)
                                ? (form.formState.errors.otherDetails as Record<
                                    keyof ExpenseOtherDetail,
                                    ExpenseOtherDetailError
                                  >[])
                                : undefined
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="border-t p-6 flex-shrink-0 bg-background">
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitBtnDisabled()}
            >
              Create Expense
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AddExpense;
