import type {
  IAddAutoExpenseFormValues,
  IAddManualExpenseFormValues,
} from '@/forms/schema/expenses';

export interface IAddExpenseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded: () => void;
}

export interface IBaseExpenseFormProps {
  onCancel: () => void;
}

export interface IManualExpenseFormProps extends IBaseExpenseFormProps {
  onSubmit: (data: IAddManualExpenseFormValues) => void;
}

export interface IAutoExpenseFormProps extends IBaseExpenseFormProps {
  onSubmit: (data: IAddAutoExpenseFormValues) => void;
}

export interface IBaseExpenseFormRef {
  isDirty: () => boolean;
  reset: () => void;
}

export type IManualExpenseFormRef = IBaseExpenseFormRef;
export type IAutoExpenseFormRef = IBaseExpenseFormRef;
export type IMultipleAutoExpensesFormRef = IBaseExpenseFormRef;
