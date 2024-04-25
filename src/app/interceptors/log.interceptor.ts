import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const logInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();

  // console.log('REQ - log');

  return next(req).pipe(
    tap((event) => {
      // console.log('RES - log');
      if (event.type === HttpEventType.Response) {
        const elapsed = Date.now() - started;
        // console.log(
        //   `[${event.status}] Request for ${req.urlWithParams} took ${elapsed} ms.`
        // );
      }
    })
  );
};
