import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

export const client = (() => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    paramsSerializer: {
      indexes: null,
    },
  });
})();

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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

  const onError = function (error: AxiosError<{ message?: string }>) {
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
