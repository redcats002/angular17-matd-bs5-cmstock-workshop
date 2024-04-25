import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { restInterceptor } from './rest.interceptor';
import { logInterceptor } from './log.interceptor';

export const httpInterceptorProvider = [restInterceptor, logInterceptor];
