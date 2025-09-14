import { io, type Socket } from 'socket.io-client';
import { useUserStore } from '@/stores/useUserStore';

let expenseSocket: Socket | null = null;

export const getExpenseSocket = (): Socket => {
  if (!expenseSocket) {
    const token = useUserStore.getState().token;

    if (!token) {
      throw new Error('No authentication token available');
    }

    expenseSocket = io(`${import.meta.env.VITE_API_URL}/expenses`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return expenseSocket;
};

export const disconnectExpenseSocket = () => {
  if (expenseSocket) {
    expenseSocket.disconnect();
    expenseSocket = null;
  }
};
