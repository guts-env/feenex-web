import { EXPENSE_EVENTS } from '@/api/services/SocketService/config';
import { getExpenseSocket } from '@/api/services/SocketService/clients';
import type { IExpenseRes } from '@/types/api';

export const EXPENSE_SOCKET_EVENTS = {
  onExpenseCreated: (callback: (expense: IExpenseRes) => void) =>
    getExpenseSocket().on(EXPENSE_EVENTS.CREATED, callback),
  offExpenseCreated: () => getExpenseSocket().off(EXPENSE_EVENTS.CREATED),
  onExpenseProcessed: (callback: (expense: IExpenseRes) => void) =>
    getExpenseSocket().on(EXPENSE_EVENTS.PROCESSED, callback),
  offExpenseProcessed: () => getExpenseSocket().off(EXPENSE_EVENTS.PROCESSED),
  onExpenseVerified: (callback: (expense: IExpenseRes) => void) =>
    getExpenseSocket().on(EXPENSE_EVENTS.VERIFIED, callback),
  offExpenseVerified: () => getExpenseSocket().off(EXPENSE_EVENTS.VERIFIED),
  onExpenseDeleted: (callback: (expense: IExpenseRes) => void) =>
    getExpenseSocket().on(EXPENSE_EVENTS.DELETED, callback),
  offExpenseDeleted: () => getExpenseSocket().off(EXPENSE_EVENTS.DELETED),
} as const;
