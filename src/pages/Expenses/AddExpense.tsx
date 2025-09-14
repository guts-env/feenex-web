import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManualExpenseForm from '@/pages/Expenses/ManualExpenseForm';
import AutoExpenseForm from '@/pages/Expenses/AutoExpenseForm';
import { ExpenseTypeEnum } from '@/constants/enums';

interface AddExpenseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded: () => void;
}

function AddExpense({ open, onOpenChange, onExpenseAdded }: AddExpenseProps) {
  const [activeTab, setActiveTab] = useState<ExpenseTypeEnum>(ExpenseTypeEnum.AUTO);

  const handleCancel = () => {
    onOpenChange(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case ExpenseTypeEnum.AUTO:
        return <AutoExpenseForm onSubmit={onExpenseAdded} onCancel={handleCancel} />;
      case ExpenseTypeEnum.MANUAL:
        return <ManualExpenseForm onSubmit={onExpenseAdded} onCancel={handleCancel} />;
      default:
        return null;
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCancel();
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

        <div className="p-6 pb-0 flex-shrink-0">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ExpenseTypeEnum)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={ExpenseTypeEnum.AUTO}>Auto</TabsTrigger>
              <TabsTrigger value={ExpenseTypeEnum.MANUAL}>Manual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {renderTabContent()}
      </SheetContent>
    </Sheet>
  );
}

export default AddExpense;
