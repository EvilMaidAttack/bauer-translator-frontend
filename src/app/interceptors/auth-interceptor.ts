import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const access_token = localStorage.getItem("access")
  if (!access_token) return next(req);
  const authReq = req.clone({setHeaders: {Authorization: `JWT ${access_token}`}});
  return next(authReq);
};
