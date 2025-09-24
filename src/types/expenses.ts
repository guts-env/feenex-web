import type {
  IAddAutoExpenseFormValues,
  IAddManualExpenseFormValues,
} from '@/forms/schema/expenses';
import type { IExpenseRes } from '@/types/api';

export interface IAddExpenseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded: () => void;
}

export interface IEditExpenseProps {
  expense: IExpenseRes | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseUpdated: () => void;
}

export interface IEditExpenseFormRef {
  isDirty: () => boolean;
  reset: () => void;
}

export interface IEditExpenseFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  expense: IExpenseRes;
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
