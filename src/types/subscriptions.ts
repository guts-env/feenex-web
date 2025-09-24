import type {
  IAddSubscriptionFormValues,
  IUpdateSubscriptionFormValues,
} from '@/forms/schema/subscriptions';
import type { ISubscriptionRes } from '@/types/api';

export interface IAddSubscriptionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionAdded: (data?: IAddSubscriptionFormValues) => void;
}

export interface IEditSubscriptionProps {
  subscription: ISubscriptionRes | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionUpdated: () => void;
}

export interface ISubscriptionDetailsProps {
  subscription: ISubscriptionRes | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface IBaseSubscriptionFormProps {
  onCancel: () => void;
}

export interface ISubscriptionFormProps extends IBaseSubscriptionFormProps {
  onSubmit: (data: IAddSubscriptionFormValues) => void;
}

export interface IEditSubscriptionFormProps extends IBaseSubscriptionFormProps {
  subscription: ISubscriptionRes;
  onSubmit: (data: IUpdateSubscriptionFormValues) => void;
}

export interface ISubscriptionFormRef {
  isDirty: () => boolean;
  reset: () => void;
}
