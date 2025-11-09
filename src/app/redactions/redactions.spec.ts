import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Redactions } from './redactions';

describe('Redactions', () => {
  let component: Redactions;
  let fixture: ComponentFixture<Redactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Redactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Redactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
