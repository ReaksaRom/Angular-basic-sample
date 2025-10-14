import { Routes } from '@angular/router';
import { EmpListComponent } from './components/employee/emp-list/emp-list.component';
import { TodosComponent } from './components/todos/todos.component';
import { CommentComponent } from './components/comment/comment.component';

export const routes: Routes = [
    { path: 'employee-test-crud', component: EmpListComponent },
    { path: 'todos', component: TodosComponent },
    { path: 'comment', component: CommentComponent }
];
