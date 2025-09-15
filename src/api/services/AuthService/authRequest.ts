import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';

const client = (() => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
})();

export const authRequest = async (options: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse) => {
    const { data } = response;
    return data;
  };

  const onError = async function (error: AxiosError<{ message?: string }>): Promise<unknown> {
    return Promise.reject({
      message: error.response?.data?.message || error.message,
      status: error.status,
      code: error.code,
      response: error.response,
    });
  };

  return client(options).then(onSuccess).catch(onError);
};

export default authRequest;
