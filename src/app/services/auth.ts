import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
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
  private _token = signal<string | null>(localStorage.getItem('access'));

  constructor(private http: HttpClient){}

  private obtainToken(credentials: LoginCredentials): Observable<AuthToken> {
    return this.http.post<AuthToken>(this.baseUrl + "jwt/create/", credentials)
  }

  get token(){
    return this._token;
  }

  isAuthenticated() {
    return !!this._token();
  }

  login(credentials: LoginCredentials, onSuccess: () => void, onError: () => void): void {
    const loginSubscription = this.obtainToken(credentials).subscribe({
      next: (token) => {
        loginSubscription?.unsubscribe();
        localStorage.setItem('access', token['access']);
        localStorage.setItem('refresh', token['refresh']);
        this._token.set(token["access"]);
        onSuccess();
      },
      error: (error: HttpErrorResponse) => onError()
    });
  }

  logout(){
    localStorage.removeItem("access");
    this._token.set(null);
  }
  

}
