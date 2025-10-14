import { Component } from '@angular/core';
import { TodosService } from '../../../service/todos.service';
import { Todos } from '../../../model/todos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-random-todo',
  imports: [CommonModule],
  templateUrl: './random-todo.component.html',
  styleUrl: './random-todo.component.css'
})
export class RandomTodoComponent {
  todo?: Todos;
  loading = false;
  constructor(private service: TodosService) { }
  randomTodo() {
    this.loading = true;
    this.service.getRandomTodo().subscribe({
      next: (data) => {
        this.todo = data;
        this.loading = false;
      },
    });


  }
}
