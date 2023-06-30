import { AxiosPromise, AxiosRequestConfig, Method } from 'axios';

export type HttpMethod = Method;

export type Fetcher<T = unknown, R = unknown> = (
  params: AxiosRequestConfig<T>
) => AxiosPromise<R>;

export type ConfigureAPI = {
  fetcher: Fetcher;
};

export type HttpServiceRequestConfig = Omit<AxiosRequestConfig, 'url' | 'data'>;

export interface Http {
  get: <T = unknown>(
    url: string,
    requestConfig?: HttpServiceRequestConfig
  ) => AxiosPromise<T>;
  post: <T = unknown, R = unknown>(
    url: string,
    data: T,
    requestConfig?: HttpServiceRequestConfig
  ) => AxiosPromise<R>;
  delete: <T = unknown>(
    url: string,
    requestConfig?: HttpServiceRequestConfig
  ) => AxiosPromise<T>;
  patch: <T = unknown, R = unknown>(
    url: string,
    data: T,
    requestConfig?: HttpServiceRequestConfig
  ) => AxiosPromise<R>;
}
