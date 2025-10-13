import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslationJob, TranslatorService } from '../services/translator';

/**TODO: 
 * 1. Display error
 * 2. Show Expired instead of download when sas_url expires 
 * */

@Component({
  selector: 'app-translations',
  imports: [],
  templateUrl: './translations.html',
  styleUrl: './translations.scss'
})
export class Translations implements OnInit {
  translatorService = inject(TranslatorService)
  isExpanded = signal(true);
  translations:TranslationJob[] = [];
  error = "";

  ngOnInit(): void {
    this.loadTranslations();
  }

  toggleList(){
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  refresh(){
    this.loadTranslations();
  }

  loadTranslations(){
    this.translatorService.listJobs().subscribe({
        next: (translationJobs) => this.translations = translationJobs,
        error: (err) => this.error = err
    });
  }

}
