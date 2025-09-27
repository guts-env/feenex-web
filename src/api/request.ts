import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useUserStore } from '@/stores/useUserStore';
import AuthService from './services/AuthService/service';

export const client = (() => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    paramsSerializer: {
      indexes: true,
    },
  });
})();

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useUserStore.getState().token;
    const user = useUserStore.getState().user;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (user) {
      config.headers['x-organization-id'] = user.organization.id;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

const request = async (options: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse) => {
    const { data } = response;
    return data;
  };

  const onError = async function (error: AxiosError<{ message?: string }>): Promise<unknown> {
    if (error.status === 401) {
      try {
        const accessToken = await AuthService.refreshAccessToken();
        useUserStore.getState().setToken(accessToken.accessToken);
        return request(options);
      } catch {
        AuthService.logout();
        useUserStore.getState().logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message,
      status: error.status,
      code: error.code,
      response: error.response,
    });
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
