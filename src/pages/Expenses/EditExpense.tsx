import { useState, useRef, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
import EditExpenseForm from '@/pages/Expenses/EditExpenseForm';
import type { IEditExpenseFormRef } from '@/types/expenses';
import type { IEditExpenseProps } from '@/types/expenses';

function EditExpense({ expense, open, onOpenChange, onExpenseUpdated }: IEditExpenseProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<IEditExpenseFormRef>(null);

  const isFormDirty = useCallback(() => {
    return formRef.current?.isDirty() || false;
  }, []);

  const shouldShowDirtyWarning = () => {
    return isFormDirty() && !isSubmitting;
  };

  const resetForm = useCallback(() => {
    formRef.current?.reset();
  }, []);

  const resetAndClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 300);
  };

  const handleExpenseUpdated = () => {
    setIsSubmitting(true);
    onExpenseUpdated();
    resetAndClose();
  };

  const handleCancel = () => {
    if (shouldShowDirtyWarning()) {
      setShowConfirmDialog(true);
    } else {
      resetAndClose();
    }
  };

  const handleConfirmAction = () => {
    resetForm();
    resetAndClose();
    setShowConfirmDialog(false);
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (shouldShowDirtyWarning()) {
        setShowConfirmDialog(true);
      } else {
        resetAndClose();
      }
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-hidden p-0 flex flex-col gap-0"
        >
          <SheetHeader className="border-b p-6 flex-shrink-0">
            <SheetTitle>Edit Expense</SheetTitle>
          </SheetHeader>

          {expense && (
            <EditExpenseForm
              ref={formRef}
              onSubmit={handleExpenseUpdated}
              onCancel={handleCancel}
              expense={expense}
            />
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelAction}>Keep Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>Discard Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default EditExpense;
