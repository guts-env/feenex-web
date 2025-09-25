import ExpenseService from '@/api/services/ExpenseService/service';
import {
  type IExpenseListParams,
  type IExpenseListRes,
  type IExpensesTotal,
  type IExpenseTotalRes,
} from '@/types/api';

export default class ExpenseQuery {
  public static readonly list = async (params: IExpenseListParams): Promise<IExpenseListRes> => {
    const data = await ExpenseService.list(params);
    return data;
  };

  public static readonly getTotal = async (params?: IExpensesTotal): Promise<IExpenseTotalRes> => {
    const data = await ExpenseService.getTotal(params);
    return data;
  };
}
