import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';
import { LangOption } from '../services/translator';

@Component({
  selector: 'app-language-select',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './language-select.html',
  styleUrl: './language-select.scss',
    providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LanguageSelect),
    multi: true
  }]
})
export class LanguageSelect implements ControlValueAccessor  {
  @Input() options: LangOption[] = [];
  @Input() placeholder = 'Search languages…';

  // UI state
  open = false;
  disabled = false;

  // Sichtbarer Suchtext im Input
  query = new FormControl<string>('', { nonNullable: true });

  // interner Wert für das FormControl (code)
  private _value: string | null = null;

  // --- CVA ---
  private onChange: (val: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string | null): void {
    this._value = val;
    const opt = this.options.find(o => o.code === val);
    this.query.setValue(opt ? `${opt.name} (${opt.code})` : '', { emitEvent: false });
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  // Normalisiert nur für die Suche (case-insensitive; Akzent-insensitiv optional)
  private norm(s: string) {
    return s
      .toLowerCase()
      .normalize('NFD')               // optional: Umlaute/Diakritika entfernen
      .replace(/\p{Diacritic}/gu, '');
  }

  get filtered(): LangOption[] {
    const q = this.norm(this.query.value || '');
    if (!q) return this.options.slice(0, 100);
    return this.options
      .filter(o => this.norm(o.name).includes(q) || this.norm(o.code).includes(q))
      .slice(0, 100);
  }

  focusInput() {
    if (this.disabled) return;
    this.open = true;
    this.query.setValue('', { emitEvent: false });
  }

  selectOption(opt: LangOption) {
    this._value = opt.code;
    this.onChange(opt.code);
    this.onTouched();
    this.query.setValue(`${opt.name} (${opt.code})`, { emitEvent: false });
    this.open = false;
  }

  toggle() { 
    if (this.disabled) return;
    if (this.open) this.restoreLabel();
    this.open = !this.open;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    const target = ev.target as HTMLElement;
    if (!target.closest('.lang-select')) {
      if (this.open) this.restoreLabel();
      this.open = false;
    }
  }

  // When we close without selecting, restore the label
  private restoreLabel() {
    const opt = this.options.find(o => o.code === this._value);
    this.query.setValue(opt ? `${opt.name} (${opt.code})` : '', { emitEvent: false });
  }

  // Used for form display
  get isSelectedCode(): string | null {
    return this._value;
  }



}
