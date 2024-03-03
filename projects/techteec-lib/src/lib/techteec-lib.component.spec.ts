import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechteecLibComponent } from './techteec-lib.component';

describe('TechteecLibComponent', () => {
  let component: TechteecLibComponent;
  let fixture: ComponentFixture<TechteecLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechteecLibComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechteecLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
