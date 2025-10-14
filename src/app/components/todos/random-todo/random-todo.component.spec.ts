import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomTodoComponent } from './random-todo.component';

describe('RandomTodoComponent', () => {
  let component: RandomTodoComponent;
  let fixture: ComponentFixture<RandomTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomTodoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
