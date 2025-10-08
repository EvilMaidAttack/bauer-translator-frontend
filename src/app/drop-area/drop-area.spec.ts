import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropArea } from './drop-area';

describe('DropArea', () => {
  let component: DropArea;
  let fixture: ComponentFixture<DropArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
