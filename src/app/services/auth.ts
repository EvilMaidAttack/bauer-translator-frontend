import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
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

export class BackendUser {
  loggedIn: boolean = false;
  accessToken: string = "";
  refreshToken: string = "";
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private readonly baseUrl = "https://b-translator-prod.azurewebsites.net/";
  private readonly baseUrl = "http://localhost:8000/";
  private _user = signal<BackendUser>({
    loggedIn: !!localStorage.getItem('access'),
    accessToken: localStorage.getItem('access') ?? "",
    refreshToken: localStorage.getItem('refresh') ?? "",
    email: undefined
  })

  constructor(private http: HttpClient){
    if (this.isAuthenticated()){
      this.loadProfile();
    }
  }

  get user(){
    return this._user;
  }
  
  getAccessToken(): string | null{
    return this._user().accessToken || null;
  }

  getEmail(): string | undefined{
    return this._user().email
  }
  
  isAuthenticated(): boolean {
    return !!this._user().accessToken;
  }

  private obtainToken(credentials: LoginCredentials): Observable<AuthToken> {
    return this.http.post<AuthToken>(this.baseUrl + "auth/jwt/create/", credentials)
  }

  private loadProfile(): void {
    this.http.get<{email:string}>(this.baseUrl + "api/profile/").subscribe({
      next: (data) => {
        this._user.update(u => ({
          ...u,
          email: data[0].email
        }));
      },
      error: (err) => {
        console.warn('[Auth] profile load failed', err )
        if (err.status = HttpStatusCode.Unauthorized){
          this.logout();
        }
      }
    });
  }


  login(credentials: LoginCredentials, onSuccess: () => void, onError: (status: number) => void): void {
    this.obtainToken(credentials).subscribe({
      next: (token) => {
        localStorage.setItem('access', token['access']);
        localStorage.setItem('refresh', token['refresh']);
        this._user.set({
          loggedIn: true,
          accessToken: token['access'],
          refreshToken: token['refresh'],
          email:undefined
        })
        this.loadProfile();
        onSuccess();
      },
      error: (error: HttpErrorResponse) => onError(error.status)
    });
  }

  logout(){
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    this._user.set({
      loggedIn: false,
      accessToken: "",
      refreshToken: "",
      email: undefined
    });
  }
  

}
