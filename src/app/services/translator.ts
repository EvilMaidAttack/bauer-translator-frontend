import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  private readonly baseUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  translateFile(formData: FormData) {
    return this.http.post<any>(this.baseUrl + "translate/", formData);
  }
  
}
