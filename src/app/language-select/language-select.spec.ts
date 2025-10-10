import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSelect } from './language-select';

describe('LanguageSelect', () => {
  let component: LanguageSelect;
  let fixture: ComponentFixture<LanguageSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
