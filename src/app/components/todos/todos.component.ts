import { Component, OnInit } from '@angular/core';
import { TodosService } from '../../service/todos.service';
import { CommonModule } from '@angular/common';
import { TodosListComponent } from "./todos-list/todos-list.component";
import { SingleTodoComponent } from "./single-todo/single-todo.component";
import { RandomTodoComponent } from "./random-todo/random-todo.component";

@Component({
  selector: 'app-todos',
  imports: [CommonModule, TodosListComponent, SingleTodoComponent, RandomTodoComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent {


}
