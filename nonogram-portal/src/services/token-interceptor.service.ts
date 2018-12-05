import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { LoggedUserService } from './logged-user.service';
import { Observable } from 'rxjs';



@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(public loggedUserService: LoggedUserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.loggedUserService.GetToken() != null){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.loggedUserService.GetToken()}`
        }
      });
    }
    return next.handle(request);
  }
}