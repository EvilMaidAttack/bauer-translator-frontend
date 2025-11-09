import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {  RedactionJob, LangOption, RedactService } from '../services/redact.service';
import { LanguageSelect } from '../language-select/language-select';
import { Redactions } from '../redactions/redactions';

@Component({
  selector: 'app-drop-area-redaction',
  imports: [CommonModule, ReactiveFormsModule, LanguageSelect, Redactions],
  templateUrl: './redact.html',
  styleUrl: './redact.scss'
})
export class Redact {
  languages: LangOption[] = [];

  form: any;

  readonly accept =
    '.pdf,.doc,.docx,.rtf,.odt,.txt,.ppt,.pptx,.xls,.xlsx';

  isDragging = signal(false);
  private _file = signal<File | null>(null);
  file = computed(() => this._file());

  job = signal<RedactionJob | null>(null);
  isLoading = signal(false);

  constructor(private fb: FormBuilder, private redactorService: RedactService) {}

  // TODO: languages not being fetched somehow
  ngOnInit() {
    
    this.form = this.fb.group({
      documentLang: ['', Validators.required]
    });
    this.redactorService.getLanguages().subscribe(
      langs => (this.languages = langs)
    );
  }

  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDragging.set(false);

    const dt = evt.dataTransfer;
    if (!dt || !dt.files || dt.files.length === 0) return;

    const file = dt.files[0];
    this.setFile(file);
  }

  onFileInputChange(input: HTMLInputElement) {
    const file = input.files && input.files.length ? input.files[0] : null;
    if (file) this.setFile(file);
    input.value = '';
  }

  removeFile() {
    this._file.set(null);
  }

  private setFile(file: File) {
    const okByExtension = this.accept
      .split(',')
      .some(ext => file.name.toLowerCase().endsWith(ext.trim()));
    if (!okByExtension) {
      alert('Unsupported file type.');
      return;
    }
    this._file.set(file);
  }

  confirm() {
    if (this.form.valid && this.file()) {
      const formData = new FormData();
      formData.append('file', this.file()!);
      formData.append('document_lang', this.form.value.documentLang);

      this.isLoading.set(true);
      this.redactorService.redactFile(formData).subscribe({
        next: job => {
          console.log('Redaction job created:', job);
          this.job.set(job);
          this.redactorService.pollJob(job.id).subscribe({
            next: updatedJob => this.job.set(updatedJob),
            complete: () => this.isLoading.set(false)
          });
        },
        error: err => {
          console.error('Error creating redaction job:', err);
          this.isLoading.set(false);
        }
      });
    } else {
      console.log('Form invalid or no file selected.');
    }
  }
}
