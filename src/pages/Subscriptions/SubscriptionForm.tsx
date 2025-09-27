import { forwardRef, useImperativeHandle } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddSubscriptionForm } from '@/forms/hooks/useSubscriptionForm';
import CategoriesSelectInput from '@/components/features/CategoriesSelectInput';
import { DatePickerInput } from '@/components/features/DatePickerInput';
import { useCreateSubscription } from '@/api/services/SubscriptionService/mutation';
import { RecurringFrequencyEnum, SubscriptionStatusEnum } from '@/constants/enums';
import type { IAddSubscriptionFormValues } from '@/forms/schema/subscriptions';
import type { ISubscriptionFormRef } from '@/pages/Subscriptions/AddSubscription';
import capitalize from 'lodash/capitalize';

interface SubscriptionFormProps {
  onSubmit: (data: IAddSubscriptionFormValues) => void;
  onCancel: () => void;
}

const SubscriptionForm = forwardRef<ISubscriptionFormRef, SubscriptionFormProps>(
  ({ onSubmit, onCancel }, ref) => {
    const form = useAddSubscriptionForm();

    const { mutate: createSubscription, isPending } = useCreateSubscription();

    const resetForm = () => {
      form.reset();
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

    const handleSubmit = async (data: IAddSubscriptionFormValues) => {
      createSubscription(data, {
        onSuccess: () => {
          resetForm();
          toast.success('Subscription created successfully');
          onSubmit(data);
        },
        onError: (error) => {
          toast.error('Failed to create subscription', {
            description: error.message,
          });
        },
      });
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
                    name="merchantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter subscription name" {...field} />
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
                          <FormLabel className="text-xs text-primary">Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              min={0}
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                          <FormLabel htmlFor="isVat" className="mb-0 cursor-pointer text-xs ml-2">
                            Is Vatable?
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <DatePickerInput<IAddSubscriptionFormValues>
                          field={field}
                          label="Start Date"
                          placeholder="Start date"
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <DatePickerInput<IAddSubscriptionFormValues>
                          field={field}
                          label="End Date"
                          placeholder="End date"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 w-full">
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(RecurringFrequencyEnum).map((frequency) => (
                                <SelectItem key={frequency} value={frequency}>
                                  {capitalize(frequency)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(SubscriptionStatusEnum).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {capitalize(status)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 w-full">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <CategoriesSelectInput<IAddSubscriptionFormValues> field={field} />
                      )}
                    />
                  </div>
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
              type="button"
              className="flex-1"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isPending}
            >
              Create Subscription
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

SubscriptionForm.displayName = 'SubscriptionForm';

export default SubscriptionForm;
