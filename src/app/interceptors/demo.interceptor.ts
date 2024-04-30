import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LoadingService } from 'app/services/loading.service';
import { environment } from 'environments/environment.development';
import { request } from 'express';
import { tap, delay, finalize } from 'rxjs';

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  let loadingService = inject(LoadingService);
  let snackBar = inject(MatSnackBar);

  const newReq = req.clone({
    // headers: req.headers.set('Authorization', ''),
    url: `${environment.baseURL}api/${req.url}`,
  });

  return next(newReq).pipe(
    tap({
      next: (event: HttpEvent<unknown>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              const progress = Math.round((100 * event.loaded) / event.total);
              loadingService.determinate.next(progress);
            }
            break;
          case HttpEventType.Response:
            const config: MatSnackBarConfig = {
              duration: 4000,
              verticalPosition: 'top',
              horizontalPosition: 'end',
              panelClass: ['snackbar', 'success'],
            };
            switch (event.status) {
              case 200:
                if (request.method === 'PUT') {
                  snackBar.open('Edit Success', undefined, config);
                }
                break;
              case 201:
                snackBar.open('Create Success', undefined, config);
                break;
              case 204:
                snackBar.open('Delete Success', undefined, config);
                break;
            }
            break;
        }
      },
      error: (error: any) => {
        if (error instanceof HttpErrorResponse) {
          const config: MatSnackBarConfig = {
            duration: 4000,
            verticalPosition: 'top',
            horizontalPosition: 'end',
            panelClass: ['snackbar', 'error'],
          };

          if (error.status === 401 || error.status === 403) {
            snackBar.open('Unauthorized', undefined, config);
          }

          if (error.status === 404 && error.error.message) {
            snackBar.open(error.error.message, undefined, config);
          } else {
            snackBar.open(error.message, undefined, config);
          }
        }
      },
      complete: () => {},
    }),
    delay(200),
    finalize(() => {
      loadingService.intermidate.next(false);
    })
  );
};
