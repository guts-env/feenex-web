import { useEffect } from 'react';
import { EXPENSE_SOCKET_EVENTS } from '@/api/services/SocketService/events';
import { useUserStore } from '@/stores/useUserStore';
import type { IExpenseRes } from '@/types/api';

export const useExpenseSocket = (expenses: IExpenseRes[], refetch: () => void) => {
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      return;
    }

    const handleExpenseProcessed = (expense: IExpenseRes) => {
      if (expenses.some((e) => e.id === expense.id)) {
        refetch();
      }
    };

    const handleExpenseVerified = () => {
      refetch();
    };

    const handleExpenseCreated = () => {
      refetch();
    };

    const handleExpenseDeleted = () => {
      refetch();
    };

    try {
      EXPENSE_SOCKET_EVENTS.onExpenseProcessed(handleExpenseProcessed);
      EXPENSE_SOCKET_EVENTS.onExpenseCreated(handleExpenseCreated);
      EXPENSE_SOCKET_EVENTS.onExpenseVerified(handleExpenseVerified);
      EXPENSE_SOCKET_EVENTS.onExpenseDeleted(handleExpenseDeleted);
    } catch (error) {
      console.error('Failed to connect to expense socket:', error);
    }

    return () => {
      EXPENSE_SOCKET_EVENTS.offExpenseProcessed();
      EXPENSE_SOCKET_EVENTS.offExpenseCreated();
      EXPENSE_SOCKET_EVENTS.offExpenseVerified();
      EXPENSE_SOCKET_EVENTS.offExpenseDeleted();
    };
  }, [token, expenses, refetch]);
};
