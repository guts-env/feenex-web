import request from '@/api/request'
import { CategoryEndpoints } from '@/api/services/CategoryService/config'
import {
  type IAddCategoryFormValues,
  type IUpdateCategoryFormValues,
} from '@/forms/schema/categories'
import { type ICategoryListParams, type ICategoryRes } from '@/types/api'

export default class CategoryService {
  public static readonly list = async (params?: ICategoryListParams): Promise<ICategoryRes[]> => {
    return request({
      url: CategoryEndpoints.list(),
      method: 'GET',
      params,
    })
  }

  public static readonly create = async (data: IAddCategoryFormValues): Promise<void> => {
    return request({
      url: CategoryEndpoints.create(),
      method: 'POST',
      data,
    })
  }

  public static readonly detail = async (id: string): Promise<ICategoryRes> => {
    return request({
      url: CategoryEndpoints.detail(id),
      method: 'GET',
    })
  }

  public static readonly update = async (
    id: string,
    data: IUpdateCategoryFormValues,
  ): Promise<ICategoryRes> => {
    return request({
      url: CategoryEndpoints.update(id),
      method: 'PATCH',
      data,
    })
  }

  public static readonly delete = async (id: string): Promise<void> => {
    return request({
      url: CategoryEndpoints.delete(id),
      method: 'DELETE',
    })
  }
}
