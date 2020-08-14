import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostreqComponent } from './postreq.component';

describe('PostreqComponent', () => {
  let component: PostreqComponent;
  let fixture: ComponentFixture<PostreqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostreqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
