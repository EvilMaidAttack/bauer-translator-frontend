import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RedactService, RedactionJob } from '../services/redact.service';
import { DatePipe } from '@angular/common';

declare global {
  interface Window {
    bootstrap: any;
  }
}



@Component({
  selector: 'app-redactions',
  imports: [DatePipe],
  templateUrl: './redactions.html',
  styleUrl: './redactions.scss'
})
export class Redactions implements OnInit, OnDestroy {
  redactService = inject(RedactService);

  isExpanded = signal(true);
  redactions: RedactionJob[] = [];
  error = '';
  loading = false;

  private tick = signal(Date.now());
  private timerId: any;


  ngOnInit(): void {
    this.loadRedactions();
    this.timerId = setInterval(() => this.tick.set(Date.now()), 30_000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }

  toggleList() {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  refresh() {
    this.loadRedactions();
  }

  loadRedactions() {
    this.loading = true;
    this.redactService.getJobs().subscribe({
      next: (jobs) => {
        this.redactions = jobs;
        this.error = '';
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not fetch recent redactions.';
        this.loading = false;
      },
    });
  }

  isExpired(job: RedactionJob): boolean {
    this.tick();
    if (!job.download_expires_at) return true;
    return new Date(job.download_expires_at).getTime() <= Date.now();
  }

  expiryTooltip(job: RedactionJob): string {
    if (!job.download_expires_at) return 'No link available';
    const dt = new Date(job.download_expires_at);
    return `Link expires at ${dt.toLocaleString()}`;
  }
}