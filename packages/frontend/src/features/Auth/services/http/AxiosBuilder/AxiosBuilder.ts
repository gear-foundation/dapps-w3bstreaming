import axios, { AxiosInstance } from 'axios';
import { IAxiosBuilder, SetRequestInterceptorParams, SetResponseInterceptorParams } from './AxiosBuilder.interfaces';

export class AxiosBuilder implements IAxiosBuilder {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
    this.getInstance = this.getInstance.bind(this);
    this.setRequestInterceptor = this.setRequestInterceptor.bind(this);
    this.setResponseInterceptor = this.setResponseInterceptor.bind(this);
  }

  setRequestInterceptor({ onFulfilled, onRejected }: SetRequestInterceptorParams) {
    this.axiosInstance.interceptors.request.use(onFulfilled, onRejected);
    return this;
  }

  setResponseInterceptor({ onFulfilled, onRejected }: SetResponseInterceptorParams) {
    this.axiosInstance.interceptors.response.use(onFulfilled, onRejected);
    return this;
  }

  getInstance() {
    return this.axiosInstance;
  }
}
