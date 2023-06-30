import { AxiosPromise, AxiosRequestConfig } from 'axios';
import merge from 'lodash.merge';
import qs from 'qs';
import { AxiosDirectorService } from './AxiosDirector/AxiosDirector';
import { Http, Fetcher, HttpMethod, HttpServiceRequestConfig } from './Http.interfaces';

export class HttpService implements Http {
  public fetcher: Fetcher;

  public constructor(director: AxiosDirectorService) {
    this.fetcher = director.constructAxiosWithToastInterceptor();
  }

  private request<T = unknown, R = unknown>(
    url: string,
    method: HttpMethod = 'GET',
    data?: T,
    requestConfig?: HttpServiceRequestConfig,
  ): AxiosPromise<R> {
    const queryParams = requestConfig?.params;
    const options: AxiosRequestConfig<T> = {
      url: `${url}`,
      method,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data && method !== 'GET' ? data : undefined,
      paramsSerializer: {
        serialize: (params: unknown) => qs.stringify(params, { indices: false, arrayFormat: 'repeat' }),
      },
    };

    const requestOptions = merge(options, {
      ...requestConfig,
      params: queryParams,
    });

    return (this.fetcher as Fetcher<T, R>)(requestOptions);
  }

  public get<T = unknown>(url: string, requestConfig?: HttpServiceRequestConfig): AxiosPromise<T> {
    return this.request<unknown, T>(url, 'GET', undefined, requestConfig);
  }

  public post<T = unknown, R = unknown>(
    url: string,
    data: T,
    requestConfig?: HttpServiceRequestConfig,
  ): AxiosPromise<R> {
    return this.request<T, R>(url, 'POST', data, requestConfig);
  }

  public delete<T = unknown>(url: string, requestConfig?: HttpServiceRequestConfig): AxiosPromise<T> {
    return this.request<unknown, T>(url, 'DELETE', undefined, requestConfig);
  }

  public patch<T = unknown, R = unknown>(
    url: string,
    data: T,
    requestConfig?: HttpServiceRequestConfig,
  ): AxiosPromise<R> {
    return this.request<T, R>(url, 'PATCH', data, requestConfig);
  }
}
