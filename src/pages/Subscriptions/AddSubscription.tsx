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
import SubscriptionForm from '@/pages/Subscriptions/SubscriptionForm';
import type { IAddSubscriptionFormValues } from '@/forms/schema/subscriptions';

export interface ISubscriptionFormRef {
  isDirty: () => boolean;
  reset: () => void;
}

interface AddSubscriptionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionAdded: (data?: IAddSubscriptionFormValues) => void;
}

function AddSubscription({ open, onOpenChange, onSubscriptionAdded }: AddSubscriptionProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<ISubscriptionFormRef>(null);

  const isFormDirty = useCallback(() => {
    return formRef.current?.isDirty() || false;
  }, []);

  const shouldShowDirtyWarning = useCallback(() => {
    return isFormDirty() && !isSubmitting;
  }, [isFormDirty, isSubmitting]);

  const resetForm = useCallback(() => {
    formRef.current?.reset();
  }, []);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen && shouldShowDirtyWarning()) {
        setShowConfirmDialog(true);
        return;
      }

      if (!newOpen) {
        resetForm();
      }

      onOpenChange(newOpen);
    },
    [onOpenChange, resetForm, shouldShowDirtyWarning],
  );

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    resetForm();
    onOpenChange(false);
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  const handleSubmit = useCallback(
    (data: IAddSubscriptionFormValues) => {
      setIsSubmitting(true);
      onSubscriptionAdded(data);
    },
    [onSubscriptionAdded],
  );

  const handleCancel = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto gap-0">
          <SheetHeader className="border-b p-6 flex-shrink-0">
            <SheetTitle>Add Subscription</SheetTitle>
          </SheetHeader>
          <SubscriptionForm ref={formRef} onSubmit={handleSubmit} onCancel={handleCancel} />
        </SheetContent>
      </Sheet>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default AddSubscription;
