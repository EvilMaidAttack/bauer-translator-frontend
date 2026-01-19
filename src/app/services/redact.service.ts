import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, startWith, switchMap, takeWhile } from 'rxjs';

export interface LangOption {
  code: string;
  name: string;
}

export interface RedactionJob {
  id: string;
  status: 'notStarted' | 'running' | 'succeeded' | 'failed' | 'canceled';
  display_status: string;
  error_message?: string;
  download_url?: string;
  download_expires_at?: string | null;
  target_name?: string;
  entity_download_url?: string;
  entity_expires_at?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RedactService {
  private readonly baseUrl = 'https://b-translator-prod.azurewebsites.net/api/';
  //private readonly baseUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  redactFile(formData: FormData) {
    return this.http.post<RedactionJob>(this.baseUrl + "redact/", formData);
  }

  getLanguages(): Observable<LangOption[]> {
    return this.http.get<LangOption[]>(this.baseUrl + "languages/")
  }

  getStatus(jobId: string): Observable<RedactionJob> {
    return this.http.get<RedactionJob>(this.baseUrl + `redact/${jobId}/status/`);
  }
  
  pollJob(jobId: string, everyMs = 2000): Observable<RedactionJob> {
    return interval(everyMs).pipe(
      startWith(0),
      switchMap(() => this.getStatus(jobId)),
      takeWhile(j => !['succeeded', 'failed', 'canceled'].includes(j.status), true)
    );
  }

  getJobs(): Observable<RedactionJob[]> {
    return this.http.get<RedactionJob[]>(this.baseUrl + "redact/");
  }

  
}
