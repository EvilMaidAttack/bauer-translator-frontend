import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, interval, takeWhile, switchMap, startWith } from 'rxjs';

export type TranslationJob = {
  id: string;
  filename: string;
  target_lang: string;
  source_blob_url: string;
  target_container_url: string; // eigentlich Blob-URL
  operation_location: string;
  status: 'notStarted'|'running'|'succeeded'|'failed'|'canceled';
  error_message: string;
  created_at: string;
  updated_at: string;
  download_url?: string|null; // vom Serializer, wenn succeeded
};

@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  private readonly baseUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  translateFile(formData: FormData) {
    return this.http.post<TranslationJob>(this.baseUrl + "translate/", formData);
  }

  listJobs(): Observable<TranslationJob> {
    return this.http.get<TranslationJob>(this.baseUrl + "translate/");
  }

  getStatus(jobId: string): Observable<TranslationJob> {
    return this.http.get<TranslationJob>(this.baseUrl + `translate/${jobId}/status/`);
  }

  pollJob(jobId: string, everyMs = 2000): Observable<TranslationJob> {
    return interval(everyMs).pipe(
      startWith(0),
      switchMap(() => this.getStatus(jobId)),
      takeWhile(j => !['succeeded', 'failed', 'canceled'].includes(j.status), true)
    );
  }
  
}
