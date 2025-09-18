import { useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from 'sonner';
import { Plus, TrashIcon, Info } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import UploadPhotoInput, { type UploadedFile } from '@/components/features/UploadPhotoInput';
import { useAddMultipleAutoExpensesForm } from '@/forms/hooks/useExpenseForm';
import { useCreateAutoExpense } from '@/api/services/ExpenseService/mutation';
import { UploadTypeEnum } from '@/constants/enums';
import { useIsMobile } from '@/hooks/use-mobile';
import type { IAddExpenseProps, IMultipleAutoExpensesFormRef } from '@/types/expenses';

interface ExpenseRow {
  id: string;
  photos: UploadedFile[];
}

export const MultipleAutoExpensesForm = forwardRef<IMultipleAutoExpensesFormRef, IAddExpenseProps>(
  ({ open, onOpenChange, onExpenseAdded }, ref) => {
    const form = useAddMultipleAutoExpensesForm();
    const isMobile = useIsMobile();

    const [expenseRows, setExpenseRows] = useState<ExpenseRow[]>([
      { id: '1', photos: [] },
      { id: '2', photos: [] },
    ]);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

    const { mutateAsync: createAutoExpense, isPending } = useCreateAutoExpense();

    const { isDirty } = form.formState;

    useImperativeHandle(ref, () => ({
      isDirty: () => {
        const hasPhotos = expenseRows.some((row) => row.photos.length > 0);
        return isDirty || hasPhotos;
      },
      reset: () => {
        form.reset();
        setExpenseRows([
          { id: '1', photos: [] },
          { id: '2', photos: [] },
        ]);
      },
    }));

    const handlePhotoChange = (rowId: string, photos: UploadedFile[]) => {
      setExpenseRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, photos } : row)));
    };

    const handleProcessAll = async () => {
      const rowsWithPhotos = expenseRows.filter((row) => row.photos.length > 0);

      if (rowsWithPhotos.length === 0) {
        form.setError('expenses', {
          message: 'Please upload photos for at least one expense',
        });
        return;
      }

      try {
        const expensePromises = rowsWithPhotos.map((row) => {
          const formData = {
            photos: row.photos.map((photo) => photo.key || ''),
          };

          return createAutoExpense(formData);
        });

        const results = await Promise.allSettled(expensePromises);
        const successful = results.filter((result) => result.status === 'fulfilled').length;
        const failed = results.filter((result) => result.status === 'rejected').length;

        if (successful > 0) {
          onExpenseAdded();
        }

        if (failed > 0) {
          const firstError = results.find((result) => result.status === 'rejected');
          if (firstError && firstError.status === 'rejected') {
            form.setError('expenses', {
              message: firstError.reason?.message || 'Some expenses failed to process',
            });
          }
        }

        if (failed === 0) {
          form.reset();
          handleClose();
        }
      } catch (error: unknown) {
        const err = error as { message?: string };
        toast.error('Failed to process expenses', {
          description: err.message || 'Something went wrong while processing expenses',
        });
      }
    };

    const handleRemoveRow = (rowId: string) => {
      const row = expenseRows.find((row) => row.id === rowId);

      if (row && row.photos.length > 0) {
        setExpenseToDelete(rowId);
        setDeleteDialogOpen(true);
      } else {
        setExpenseRows((prev) => prev.filter((row) => row.id !== rowId));
      }
    };

    const confirmDelete = () => {
      if (expenseToDelete) {
        setExpenseRows((prev) => prev.filter((row) => row.id !== expenseToDelete));
        setExpenseToDelete(null);
      }
      setDeleteDialogOpen(false);
    };

    const cancelDelete = () => {
      setExpenseToDelete(null);
      setDeleteDialogOpen(false);
    };

    const handleAddRow = () => {
      if (expenseRows.length >= 5) {
        toast.error('Maximum 5 expenses allowed');
        return;
      }

      const newId = (Math.max(...expenseRows.map((r) => parseInt(r.id))) + 1).toString();
      setExpenseRows((prev) => [...prev, { id: newId, photos: [] }]);
    };

    const canAddNewExpense = () => {
      const hasPhotos = expenseRows.some((row) => row.photos.length > 0);
      return hasPhotos && expenseRows.length < 5;
    };

    const handleUploadError = (error: string) => {
      toast.error('Upload failed', { description: error });
    };

    const handleClose = () => {
      onOpenChange(false);
      setTimeout(() => {
        form.reset();
        setExpenseRows([
          { id: '1', photos: [] },
          { id: '2', photos: [] },
        ]);
      }, 300);
    };

    const isSubmitBtnDisabled = () => {
      const isPhotoUploading = expenseRows.some((row) =>
        row.photos.some((photo) => photo.status === 'uploading'),
      );
      return isPending || isPhotoUploading;
    };

    const rowsWithPhotos = expenseRows.filter((row) => row.photos.length > 0).length;

    return (
      <>
        <Sheet
          open={open}
          onOpenChange={(open) => {
            if (!open) {
              handleClose();
            } else {
              onOpenChange(open);
            }
          }}
        >
          <SheetContent className="w-full sm:max-w-xl gap-0">
            <SheetHeader className="border-b p-6 flex-shrink-0">
              <SheetTitle>
                Process Multiple Expenses{' '}
                <span className="pl-1 text-sm font-normal text-accent">(Max. 5)</span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col h-full min-h-0">
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                <Form {...form}>
                  <form className="space-y-6">
                    <div className="flex flex-col">
                      <Accordion
                        type="multiple"
                        className="w-full"
                        defaultValue={expenseRows.map((row) => row.id)}
                      >
                        {expenseRows.map((row, index) => (
                          <AccordionItem key={row.id} value={row.id}>
                            <div className="relative border-b last:border-b-0">
                              <AccordionTrigger
                                className={`rounded-none hover:no-underline w-full pr-2 data-[state=open]:bg-muted ${
                                  expenseRows.length > 1 ? 'pl-10' : 'pl-2'
                                }`}
                              >
                                <span>Expense #{index + 1}</span>
                              </AccordionTrigger>
                              {expenseRows.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghostDestructive"
                                  size="sm"
                                  onClick={() => handleRemoveRow(row.id)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 z-10"
                                >
                                  <TrashIcon className="size-3" />
                                </Button>
                              )}
                            </div>
                            <AccordionContent className="py-4">
                              <FormField
                                control={form.control}
                                name={`expenses.${index}.photos`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <UploadPhotoInput
                                        type={UploadTypeEnum.RECEIPTS}
                                        value={row.photos}
                                        onChange={(files) => {
                                          form.clearErrors(`expenses.${index}.photos`);
                                          field.onChange(files.map((file) => file.key));
                                          handlePhotoChange(row.id, files);
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
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>

                      {expenseRows.length < 5 && (
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex justify-start">
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              onClick={handleAddRow}
                              disabled={!canAddNewExpense()}
                            >
                              <Plus className="size-4" /> Add Expense
                            </Button>
                          </div>
                          {!canAddNewExpense() && (
                            <>
                              {isMobile ? (
                                <Alert variant="info">
                                  <AlertDescription className="text-xs">
                                    Upload photos to existing expenses first
                                  </AlertDescription>
                                </Alert>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>
                                      <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        onClick={handleAddRow}
                                        disabled={!canAddNewExpense()}
                                      >
                                        <Plus className="size-4" /> Add Expense
                                      </Button>
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="left">
                                    <p>Upload photos to existing expenses first</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </>
                          )}
                        </div>
                      )}
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
                    onClick={handleProcessAll}
                    disabled={isSubmitBtnDisabled() || rowsWithPhotos === 0}
                  >
                    Process All Expenses ({rowsWithPhotos})
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Expense</AlertDialogTitle>
              <AlertDialogDescription>
                This expense contains uploaded photos. Are you sure you want to delete it? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  },
);

MultipleAutoExpensesForm.displayName = 'MultipleAutoExpensesForm';

export default MultipleAutoExpensesForm;
