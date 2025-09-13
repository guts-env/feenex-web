import request from '@/api/request';
import axios from 'axios';
import { UploadEndpoints } from '@/api/services/UploadService/config';
import type {
  IUploadGetPresigned,
  IUploadGetPresignedRes,
  IUploadPresigned,
  IUploadPresignedRes,
} from '@/types/api';

export default class UploadService {
  public static readonly generatePresigned = async (
    data: IUploadPresigned,
  ): Promise<IUploadPresignedRes> => {
    return request({
      url: UploadEndpoints.generatePresigned(),
      method: 'POST',
      data,
    });
  };

  public static readonly downloadPresigned = async (
    data: IUploadGetPresigned,
  ): Promise<IUploadGetPresignedRes> => {
    return request({
      url: UploadEndpoints.downloadPresigned(),
      method: 'POST',
      data,
    });
  };

  public static readonly uploadFile = async (url: string, file: File): Promise<void> => {
    /* Use axios directly for S3 uploads to avoid adding unnecessary headers */
    return axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  };
}
