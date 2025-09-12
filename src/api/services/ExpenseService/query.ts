import ExpenseService from '@/api/services/ExpenseService/service'
import { type IExpenseListParams, type IExpenseListRes } from '@/types/api'

export default class ExpenseQuery {
  public static readonly list = async (params: IExpenseListParams): Promise<IExpenseListRes> => {
    const data = await ExpenseService.list(params)
    return data
  }
}
