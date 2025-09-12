import request from '@/api/request'
import { ExpenseEndpoints } from '@/api/services/ExpenseService/config'
import { type IExpenseListParams, type IExpenseListRes } from '@/types/api'

export default class ExpenseService {
  public static readonly list = async (params: IExpenseListParams): Promise<IExpenseListRes> => {
    return request({
      url: ExpenseEndpoints.list(),
      method: 'GET',
      params,
    })
  }

  public static readonly verify = async (id: string): Promise<void> => {
    return request({
      url: ExpenseEndpoints.verify(id),
      method: 'PATCH',
    })
  }

  public static readonly delete = async (id: string): Promise<void> => {
    return request({
      url: ExpenseEndpoints.delete(id),
      method: 'DELETE',
    })
  }
}
