import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSideNavComponent } from './icon-side-nav.component';

describe('IconSideNavComponent', () => {
  let component: IconSideNavComponent;
  let fixture: ComponentFixture<IconSideNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconSideNavComponent]
    });
    fixture = TestBed.createComponent(IconSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
