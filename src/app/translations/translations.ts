import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TranslationJob, TranslatorService } from '../services/translator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-translations',
  imports: [DatePipe],
  templateUrl: './translations.html',
  styleUrl: './translations.scss'
})
export class Translations implements OnInit, OnDestroy {
  translatorService = inject(TranslatorService)
  isExpanded = signal(true);
  translations:TranslationJob[] = [];
  error = "";
  loading = false;

  private tick = signal(Date.now());
  private timerId: any;

  ngOnInit(): void {
    this.loadTranslations();
    this.timerId = setInterval(() => this.tick.set(Date.now()), 30_000)
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }

  toggleList(){
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  refresh(){
    this.loadTranslations();
  }

  loadTranslations(){
    this.loading = true;
    this.translatorService.listJobs().subscribe({
        next: (translationJobs) => {
          this.translations = translationJobs;
          this.error = "";
          this.loading = false;
        },
        error: (err) => {
          this.error = "Could not fetch recent translations.";
          this.loading = false;
        }
    });
  }

  isExpired(t: TranslationJob): boolean {
    this.tick();
    if (!t.download_expires_at) return true;
    return new Date(t.download_expires_at).getTime() <= Date.now();
  }

  expiryTooltip(t: TranslationJob): string {
    if(!t.download_expires_at) return "No link available";
    const dt = new Date(t.download_expires_at);
    return `Link expires at ${dt.toLocaleString()}`;
  }

}
