import { useMutation } from '@tanstack/react-query';
import UploadService from '@/api/services/UploadService/service';
import type {
  IUploadGetPresigned,
  IUploadGetPresignedRes,
  IUploadPresigned,
  IUploadPresignedRes,
  IUploadFile,
  IUploadFileRes,
} from '@/types/api';

export const useGeneratePresigned = () => {
  return useMutation({
    mutationFn: (data: IUploadPresigned): Promise<IUploadPresignedRes> => {
      return UploadService.generatePresigned(data);
    },
  });
};

export const useDownloadPresigned = () => {
  return useMutation({
    mutationFn: (data: IUploadGetPresigned): Promise<IUploadGetPresignedRes> => {
      return UploadService.downloadPresigned(data);
    },
  });
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: (data: IUploadFile): Promise<IUploadFileRes> => {
      return UploadService.uploadFile(data.url, data.file);
    },
  });
};
