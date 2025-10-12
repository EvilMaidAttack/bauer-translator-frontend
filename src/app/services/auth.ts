import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type LoginCredentials = {
  email: string;
  password: string;
}

export type AuthToken = {
  refresh: string;
  access: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = "http://localhost:8000/auth/";

  constructor(private http: HttpClient){}

  private obtainToken(credentials: LoginCredentials): Observable<AuthToken> {
    return this.http.post<AuthToken>(this.baseUrl + "jwt/create/", credentials)
  }

  login(credentials: LoginCredentials, onSuccess: () => void, onError: () => void): void {
    const loginSubscription = this.obtainToken(credentials).subscribe({
      next: (token) => {
        loginSubscription?.unsubscribe();
        localStorage.setItem('access', token['access']);
        localStorage.setItem('refresh', token['refresh']);
        onSuccess();
      },
      error: (error: HttpErrorResponse) => onError()
    });
  }
  

}
