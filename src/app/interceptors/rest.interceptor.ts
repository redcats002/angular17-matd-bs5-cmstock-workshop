import {
  HttpErrorResponse,
  HttpEventType,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from 'app/services/loading.service';
import { environment } from 'environments/environment.development';
import { catchError, delay, finalize, tap, throwError } from 'rxjs';
import Swal, { SweetAlertOptions } from 'sweetalert2';

export const restInterceptor: HttpInterceptorFn = (req, next) => {
  let loadingService = inject(LoadingService);
  const url = `${environment.baseURL}/api/${req.url}`;
  const newReq = req.clone({ url });
  // console.log('REQ - restIntercetpor');
  if (!req.reportProgress) {
    loadingService.intermidate.next(true);
  }
  return next(newReq).pipe(
    tap((event) => {
      // console.log('RES - restIntercetpor');
      switch (event.type) {
        case HttpEventType.UploadProgress:
          if (event.total) {
            const progress = Math.round((100 * event.loaded) / event.total);
            loadingService.determinate.next(progress);
          }

          break;

        case HttpEventType.Response:
          {
            const config: SweetAlertOptions = {
              toast: true,
              showConfirmButton: false,
              position: 'top-right',
              icon: 'success',
              timer: 4000,
            };

            switch (event.status) {
              case 200:
                if (req.method === 'PUT')
                  Swal.fire({
                    title: 'Edit Success!',
                    ...config,
                  });
                break;
              case 201:
                Swal.fire({
                  title: 'Create Success!',
                  ...config,
                });
                break;
              case 204:
                Swal.fire({
                  title: 'Delete Success!',
                  ...config,
                });
                break;
            }
          }
          break;
      }
    }),
    catchError((errorResponse: HttpErrorResponse, caught) => {
      if (errorResponse instanceof HttpErrorResponse) {
        const config: SweetAlertOptions = {
          toast: true,
          showConfirmButton: false,
          position: 'top-right',
          icon: 'error',
          timer: 4000,
        };

        if (errorResponse.status === 401 || errorResponse.status === 403)
          Swal.fire({
            title: 'Unauthorized!',
            ...config,
          });

        if (errorResponse.status === 404 && !errorResponse.error.message) {
          Swal.fire({
            title: errorResponse.error.message,
            ...config,
          });
        } else {
          Swal.fire({
            title: errorResponse.message,
            ...config,
          });
        }
      }
      return throwError(() => errorResponse);
    }),
    delay(1000),
    finalize(() => {
      loadingService.intermidate.next(false);
    })
  );
};
