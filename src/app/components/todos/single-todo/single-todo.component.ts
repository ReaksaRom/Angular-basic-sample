import { Component } from '@angular/core';
import { TodosService } from '../../../service/todos.service';
import { Todos } from '../../../model/todos';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-todo',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './single-todo.component.html',
  styleUrl: './single-todo.component.css'
})
export class SingleTodoComponent {
  todoId = 1;
  todo?: Todos;
  loading = false;
  errorMessage = '';

  constructor(private todoService: TodosService) { }

  fetchTodo() {
    if (!this.todoId || this.todoId < 1) {
      this.errorMessage = 'Please enter a valid ID (1–150).';
      this.todo = undefined;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.todo = undefined;

    this.todoService.getTodoById(this.todoId).subscribe({
      next: (data) => {
        this.todo = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Todo not found. Try another ID.';
        this.loading = false;
      }
    });
  }
}
