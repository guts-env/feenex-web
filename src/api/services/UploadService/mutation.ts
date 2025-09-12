import type { IUploadGetPresigned, IUploadGetPresignedRes, IUploadPresigned, IUploadPresignedRes } from '@/types/api'
import { useMutation } from '@tanstack/react-query'
import UploadService from './service'

export const useUploadPresigned = () => {
  return useMutation({
    mutationFn: (data: IUploadPresigned): Promise<IUploadPresignedRes> => {
      return UploadService.upload(data)
    },
  })
}

export const useDownloadPresigned = () => {
  return useMutation({
    mutationFn: (data: IUploadGetPresigned): Promise<IUploadGetPresignedRes> => {
      return UploadService.downloadPresigned(data)
    },
  })
}
