import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Redact } from './redact';

describe('Redact', () => {
  let component: Redact;
  let fixture: ComponentFixture<Redact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Redact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Redact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
