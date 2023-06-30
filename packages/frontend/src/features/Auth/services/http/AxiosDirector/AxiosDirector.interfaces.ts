import { AxiosInstance } from 'axios';

export interface IAxiosDirector {
  constructAxiosWithToastInterceptor: () => AxiosInstance;
}
