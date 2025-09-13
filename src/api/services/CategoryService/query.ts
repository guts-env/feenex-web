import CategoryService from '@/api/services/CategoryService/service'
import { type ICategoryListParams, type ICategoryRes } from '@/types/api'

export default class CategoryQuery {
  public static readonly list = async (params?: ICategoryListParams): Promise<ICategoryRes[]> => {
    const data = await CategoryService.list(params)
    return data
  }

  public static readonly detail = async (id: string): Promise<ICategoryRes> => {
    const data = await CategoryService.detail(id)
    return data
  }
}
