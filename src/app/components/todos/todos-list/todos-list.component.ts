import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TodosResponse } from '../../../model/todos';
import { TodosService } from '../../../service/todos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todos-list',
  imports: [CommonModule],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.css'
})
export class TodosListComponent {
  limit = 10;
  skip = 0;
  response$!: Observable<TodosResponse>;
  constructor(private todoService: TodosService) {
    this.load(this.limit, this.skip);
  }
  load(limit: number, skip: number) {
    this.limit = limit;
    this.skip = skip;
    this.response$ = this.todoService.getTodos(limit, skip);
  }

  next(resp: TodosResponse) {
    const nextSkip = resp.skip + resp.todos.length;
    if (nextSkip < resp.total) {
      this.load(this.limit, nextSkip);
    }
  }
  prev(resp: TodosResponse) {
    const prevSkip = Math.max(0, resp.skip - this.limit);
    this.load(this.limit, prevSkip);
  }
  // Add helper method
  getTotalPages(resp: any): number {
    if (!resp || !resp.total || !resp.limit) return 0;
    return Math.ceil(resp.total / resp.limit);
  }

}
