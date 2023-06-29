import { IAxiosDirector } from './AxiosDirector.interfaces';
import { IAxiosBuilder } from '../AxiosBuilder/AxiosBuilder.interfaces';

export class AxiosDirectorService implements IAxiosDirector {
  private builder: IAxiosBuilder;

  constructor(builder: IAxiosBuilder) {
    this.constructAxiosWithToastInterceptor = this.constructAxiosWithToastInterceptor.bind(this);
    this.builder = builder;
  }

  constructAxiosWithToastInterceptor() {
    return this.builder
      .setRequestInterceptor({
        onRejected: (error) => {
          throw new Error(error);
        },
      })
      .setResponseInterceptor({
        onRejected: (error) => {
          throw new Error(error);
        },
      })
      .getInstance();
  }
}
