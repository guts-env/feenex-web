import { useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import UploadPhotoInput, { type UploadedFile } from '@/components/features/UploadPhotoInput';
import { UploadStatusEnum, UploadTypeEnum } from '@/constants/enums';
import { useAddAutoExpenseForm } from '@/forms/hooks/useExpenseForm';
import { useCreateAutoExpense } from '@/api/services/ExpenseService/mutation';
import type { IAddAutoExpenseFormValues } from '@/forms/schema/expenses';
import type { IAutoExpenseFormRef, IAutoExpenseFormProps } from '@/types/expenses';

const AutoExpenseForm = forwardRef<IAutoExpenseFormRef, IAutoExpenseFormProps>(
  ({ onSubmit, onCancel }, ref) => {
    const form = useAddAutoExpenseForm();

    const [photos, setPhotos] = useState<UploadedFile[]>([]);

    const { mutate: createExpense, isPending } = useCreateAutoExpense();

    const resetForm = () => {
      form.reset();
      setPhotos([]);
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

    const handleSubmit = async (data: IAddAutoExpenseFormValues) => {
      createExpense(data, {
        onSuccess: () => {
          resetForm();
          toast.success('Expense is being processed');
          onSubmit(data);
        },
        onError: (error) => {
          toast.error('Failed to process expense', {
            description: error.message,
          });
        },
      });
    };

    const handleUploadError = (error: string) => {
      form.setError('photos', { message: error });
    };

    const isSubmitBtnDisabled = () => {
      const isPhotoUploading = photos.some((photo) => photo.status === UploadStatusEnum.UPLOADING);
      return isPending || isPhotoUploading;
    };

    return (
      <div className="flex flex-col h-dvh min-h-0">
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
              </div>
            </form>
          </Form>
        </div>

        <div className="border-t p-6 pb-safe flex-shrink-0 bg-background">
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
              Process Expense
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

AutoExpenseForm.displayName = 'AutoExpenseForm';

export default AutoExpenseForm;
