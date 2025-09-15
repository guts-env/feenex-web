import { useState, useRef, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import ManualExpenseForm from '@/pages/Expenses/ManualExpenseForm';
import AutoExpenseForm from '@/pages/Expenses/AutoExpenseForm';
import { ExpenseTypeEnum } from '@/constants/enums';
import type { IManualExpenseFormRef, IAutoExpenseFormRef, AddExpenseProps } from '@/types/expenses';

function AddExpense({ open, onOpenChange, onExpenseAdded }: AddExpenseProps) {
  const [activeTab, setActiveTab] = useState<ExpenseTypeEnum>(ExpenseTypeEnum.AUTO);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'close' | 'tabChange';
    value?: ExpenseTypeEnum;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const manualFormRef = useRef<IManualExpenseFormRef>(null);
  const autoFormRef = useRef<IAutoExpenseFormRef>(null);

  const getCurrentFormRef = useCallback(() => {
    return activeTab === ExpenseTypeEnum.AUTO ? autoFormRef : manualFormRef;
  }, [activeTab]);

  const isFormDirty = useCallback(() => {
    const currentFormRef = getCurrentFormRef();
    return currentFormRef.current?.isDirty() || false;
  }, [getCurrentFormRef]);

  const shouldShowDirtyWarning = () => {
    return isFormDirty() && !isSubmitting;
  };

  const resetCurrentForm = useCallback(() => {
    const currentFormRef = getCurrentFormRef();
    currentFormRef.current?.reset();
  }, [getCurrentFormRef]);

  const resetTabAndClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveTab(ExpenseTypeEnum.AUTO);
    }, 300);
  };

  const handleExpenseAdded = () => {
    setIsSubmitting(true);
    onExpenseAdded();
    resetTabAndClose();
  };

  const handleCancel = () => {
    if (shouldShowDirtyWarning()) {
      setPendingAction({ type: 'close' });
      setShowConfirmDialog(true);
    } else {
      resetTabAndClose();
    }
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      resetCurrentForm();

      if (pendingAction.type === 'close') {
        resetTabAndClose();
      } else if (pendingAction.type === 'tabChange' && pendingAction.value) {
        setActiveTab(pendingAction.value);
      }
    }

    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (shouldShowDirtyWarning()) {
        setPendingAction({ type: 'close' });
        setShowConfirmDialog(true);
      } else {
        resetTabAndClose();
      }
    }
  };

  const handleTabChange = (value: ExpenseTypeEnum) => {
    if (shouldShowDirtyWarning()) {
      setPendingAction({ type: 'tabChange', value });
      setShowConfirmDialog(true);
    } else {
      setActiveTab(value);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case ExpenseTypeEnum.AUTO:
        return (
          <AutoExpenseForm
            ref={autoFormRef}
            onSubmit={handleExpenseAdded}
            onCancel={handleCancel}
          />
        );
      case ExpenseTypeEnum.MANUAL:
        return (
          <ManualExpenseForm
            ref={manualFormRef}
            onSubmit={handleExpenseAdded}
            onCancel={handleCancel}
          />
        );
      default:
        return null;
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
            <SheetTitle>Add Expense</SheetTitle>

            <div className="pt-4 pb-0 flex-shrink-0">
              <Tabs
                value={activeTab}
                onValueChange={(value: string) => handleTabChange(value as ExpenseTypeEnum)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value={ExpenseTypeEnum.AUTO}>Auto</TabsTrigger>
                  <TabsTrigger value={ExpenseTypeEnum.MANUAL}>Manual</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </SheetHeader>

          {renderTabContent()}
        </SheetContent>
      </Sheet>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to{' '}
              {pendingAction?.type === 'tabChange' ? 'switch tabs' : 'close'}? Your changes will be
              lost.
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

export default AddExpense;
