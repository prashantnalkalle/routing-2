import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { SnackbarService } from './shared/service/snackbar.service';
import { Ierror } from './shared/module/error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private _snackbar:SnackbarService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error:unknown) => {
        if(error instanceof HttpErrorResponse) {
          this._snackbar.openSnackbar(this.getErrormsg(error))
        }

        throw error

      })
    )
  }


  private getErrormsg(error:HttpErrorResponse) {
    const apierror = error.error.error as Partial<Ierror>
    if(typeof apierror.message === 'string' && apierror.message.length > 0  ){
      return apierror.message
    }
    if(typeof error.error === 'string' && error.error.length >0) {
      return error.error
    }
    if(error.status === 0) {
      return 'Unable to connect the server'
    }

    return error.statusText || 'An unexpected error occured'
  }
}
