import request from '@/api/request';
import { ExpenseEndpoints } from '@/api/services/ExpenseService/config';
import {
  type IAddAutoExpenseFormValues,
  type IAddManualExpenseFormValues,
} from '@/forms/schema/expenses';
import { type IExpenseListParams, type IExpenseListRes } from '@/types/api';

export default class ExpenseService {
  public static readonly list = async (params: IExpenseListParams): Promise<IExpenseListRes> => {
    return request({
      url: ExpenseEndpoints.list(),
      method: 'GET',
      params,
    });
  };

  public static readonly createManual = async (
    data: IAddManualExpenseFormValues,
  ): Promise<void> => {
    return request({
      url: ExpenseEndpoints.createManual(),
      method: 'POST',
      data,
    });
  };

  public static readonly createAuto = async (data: IAddAutoExpenseFormValues): Promise<void> => {
    return request({
      url: ExpenseEndpoints.createAuto(),
      method: 'POST',
      data,
    });
  };

  public static readonly verify = async (id: string): Promise<void> => {
    return request({
      url: ExpenseEndpoints.verify(id),
      method: 'PATCH',
    });
  };

  public static readonly delete = async (id: string): Promise<void> => {
    return request({
      url: ExpenseEndpoints.delete(id),
      method: 'DELETE',
    });
  };
}
