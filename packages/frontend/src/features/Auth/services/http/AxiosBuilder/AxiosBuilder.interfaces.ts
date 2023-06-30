import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export interface IAxiosBuilder {
  getInstance: () => AxiosInstance;
  setRequestInterceptor: (params: SetRequestInterceptorParams) => IAxiosBuilder;
  setResponseInterceptor: (params: SetResponseInterceptorParams) => IAxiosBuilder;
}

export type SetRequestInterceptorParams = InterceptorParams<InternalAxiosRequestConfig>;
export type SetResponseInterceptorParams = InterceptorParams<AxiosResponse>;

interface InterceptorParams<T> {
  onFulfilled?: (value: T) => T | Promise<T>;
  onRejected?: (error: any) => any;
}
