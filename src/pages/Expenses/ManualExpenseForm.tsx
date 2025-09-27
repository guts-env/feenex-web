// import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from 'sonner';
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
import ExpenseStatusSelectInput from '@/pages/Expenses/ExpenseStatusSelectInput';
import { DatePickerInput } from '@/components/features/DatePickerInput';
import UploadPhotoInput, { type UploadedFile } from '@/components/features/UploadPhotoInput';
// import ExpenseItemsInput, {
//   type ExpenseItem,
//   type ExpenseItemError,
// } from '@/pages/Expenses/ExpenseItemsInput';
import { useCreateManualExpense } from '@/api/services/ExpenseService/mutation';
import { UploadStatusEnum, UploadTypeEnum } from '@/constants/enums';
import { type IAddManualExpenseFormValues } from '@/forms/schema/expenses';
import type { IManualExpenseFormRef, IManualExpenseFormProps } from '@/types/expenses';
import { Checkbox } from '@/components/ui/checkbox';

const ManualExpenseForm = forwardRef<IManualExpenseFormRef, IManualExpenseFormProps>(
  ({ onSubmit, onCancel }, ref) => {
    const form = useAddManualExpenseForm();

    const [photos, setPhotos] = useState<UploadedFile[]>([]);
    // const [items, setItems] = useState<ExpenseItem[]>([]);

    const { mutate: createExpense, isPending } = useCreateManualExpense();

    const resetForm = () => {
      form.reset();
      setPhotos([]);
      // setItems([]);
    };

    const { isDirty } = form.formState;
    useImperativeHandle(ref, () => ({
      isDirty: () => {
        return isDirty;
      },
      reset: () => {
        resetForm();
      },
    }));

    const handleClose = () => {
      onCancel();
      setTimeout(() => {
        resetForm();
      }, 300);
    };

    const handleSubmit = async (data: IAddManualExpenseFormValues) => {
      createExpense(data, {
        onSuccess: () => {
          resetForm();
          toast.success('Expense created successfully');
          onSubmit(data);
        },
        onError: (error) => {
          toast.error('Failed to create expense', {
            description: error.message,
          });
        },
      });
    };

    // const itemsTotal = items.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0);

    // useEffect(() => {
    //   if (items.length > 0) {
    //     form.setValue('amount', itemsTotal);
    //   }
    // }, [items, itemsTotal, form]);

    const handleUploadError = (error: string) => {
      form.setError('photos', { message: error });
    };

    const isSubmitBtnDisabled = () => {
      const isPhotoUploading = photos.some((photo) => photo.status === UploadStatusEnum.UPLOADING);
      return isPending || isPhotoUploading;
    };

    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                    name="orNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OR Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter OR number" {...field} />
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
                              // disabled={items.length > 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <FormField
                      control={form.control}
                      name="vat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-primary">VAT</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              min={0}
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              disabled={!form.watch('isVat')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isVat"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (!checked) {
                                  form.setValue('vat', 0);
                                }
                              }}
                              id="isVat"
                            />
                          </FormControl>
                          <FormLabel htmlFor="isVat" className="mb-0 cursor-pointer text-xs">
                            Is Vatable?
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <FormField<IAddManualExpenseFormValues, 'invoiceDate'>
                      control={form.control}
                      name="invoiceDate"
                      render={({ field }) => (
                        <DatePickerInput<IAddManualExpenseFormValues>
                          field={field}
                          label="Invoice Date"
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <FormField
                      control={form.control}
                      name="paymentDate"
                      render={({ field }) => (
                        <DatePickerInput<IAddManualExpenseFormValues>
                          field={field}
                          label="Payment Date"
                        />
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
                        <ExpenseStatusSelectInput<IAddManualExpenseFormValues> field={field} />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <CategoriesSelectInput<IAddManualExpenseFormValues> field={field} />
                      )}
                    />
                  </div>
                </div>

                {/* <div className="flex flex-col gap-1">
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
                </div> */}
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
              type="button"
              className="flex-1"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isSubmitBtnDisabled()}
            >
              Create Expense
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

ManualExpenseForm.displayName = 'ManualExpenseForm';

export default ManualExpenseForm;
