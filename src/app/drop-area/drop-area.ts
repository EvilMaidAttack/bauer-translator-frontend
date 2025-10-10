import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatorService, TranslationJob, LangOption } from '../services/translator';
import { LanguageSelect } from '../language-select/language-select';

@Component({
  selector: 'app-drop-area',
  imports: [CommonModule, ReactiveFormsModule, LanguageSelect],
  templateUrl: './drop-area.html',
  styleUrl: './drop-area.scss'
})
export class DropArea {
  languages: LangOption[] = []

  form: any;
  
  readonly accept = '.pdf,.doc,.docx,.rtf,.odt,.txt,.ppt,.pptx,.xls,.xlsx';
  
  // Drag state (for styling)
  isDragging = signal(false);
  
  // Selected file state
  private _file = signal<File | null>(null);
  file = computed(() => this._file());

  job = signal<TranslationJob | null>(null);
  isLoading = signal(false);
  
  constructor(private fb: FormBuilder, private translatorService: TranslatorService) {}
  
  ngOnInit() {
    // Reactive form (target language only for now)
    this.form = this.fb.group({
      targetLang: ['', Validators.required]
    });
    this.translatorService.getLanguages().subscribe(languages => this.languages = languages);
  }

  // Handle dropzone drag events
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
    // Reset input so the same file can be selected again if needed
    input.value = '';
  }

  removeFile() {
    this._file.set(null);
  }

  private setFile(file: File) {
    // Basic client-side type hint check
    const okByExtension = this.accept
      .split(',')
      .some(ext => file.name.toLowerCase().endsWith(ext.trim()));
    if (!okByExtension) {
      // Simple UX; later implement toast notifications
      alert('Unsupported file type.');
      return;
    }
    this._file.set(file);
  }

  
  confirm() {
    if (this.form.valid && this.file()) {
      const formData = new FormData();
      formData.append('file', this.file()!);
      formData.append('target_lang', this.form.value.targetLang); 
      
      this.isLoading.set(true);
      this.translatorService.translateFile(formData).subscribe({
        next: (job) => {
          console.log('Translation job successfully created:', job);
          this.job.set(job);
          // Start polling the job status
          this.translatorService.pollJob(job.id).subscribe({
            next: (updatedJob) => this.job.set(updatedJob),
            complete: () => this.isLoading.set(false),
          });
        },
        error: (error) => {
          console.error('Error creating translation job:', error);
          this.isLoading.set(false);
        }
      });

    }
    else {
      console.log('Form is invalid or no file selected.');  
    }
  }



}
