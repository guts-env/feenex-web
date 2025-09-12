import request from '@/api/request'
import { UploadEndpoints } from '@/api/services/UploadService/config'
import type { IUploadGetPresigned, IUploadGetPresignedRes, IUploadPresigned, IUploadPresignedRes } from '@/types/api'

export default class UploadService {
  public static readonly upload = async (data: IUploadPresigned): Promise<IUploadPresignedRes> => {
    return request({
      url: UploadEndpoints.upload(),
      method: 'POST',
      data,
    })
  }

  public static readonly downloadPresigned = async (data: IUploadGetPresigned): Promise<IUploadGetPresignedRes> => {
    return request({
      url: UploadEndpoints.downloadPresigned(),
      method: 'POST',
      data,
    })
  }
}
