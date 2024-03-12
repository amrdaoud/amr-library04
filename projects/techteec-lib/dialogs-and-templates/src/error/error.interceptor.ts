import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ErrorService } from './error.service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  return next(req).pipe(
    catchError((error: any) => {
      if(error.status === 0) {
        errorService.open(error.status, 'Please check your connection!');
      }
      else if(error.status === 401 || error.status === 403) {
        //this.errorService.open(error.status, 'Your are not authorized to perform this action!');
        errorService.open(error.status, 'You are not authorized to perform this action!');
      }
      else if(error.status === 500) {
        errorService.open(error.status, 'Something went wrong please report the error to developers!');
      }
      else if(error && error.error && error.error.message) {
        // const m = this.languageService.currentLanguage === 'ar' && error.error.messageArabic ? error.error.messageArabic : error.error.message;
        const m = error.error.message;
        errorService.open(error.status, m);
      } else if(error && error.message) {
        errorService.open(error.status, error.message);
      } else {
        errorService.open(error.status, JSON.stringify(error));
      }
    throw error;
    })
  );
};
