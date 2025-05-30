import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialComponent } from './social.component';

describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
