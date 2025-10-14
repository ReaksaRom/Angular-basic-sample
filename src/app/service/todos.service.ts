import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Todos, TodosResponse } from '../model/todos';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private baseUrl = 'https://dummyjson.com';
  constructor(private http: HttpClient) { }
  //get all todos
  getTodos(limit = 30, skip = 0): Observable<TodosResponse> {
    const params = new HttpParams()
      .set('limit', String(limit))
      .set('skip', String(skip));

    return this.http
      .get<TodosResponse>(`${this.baseUrl}/todos`, { params })
      .pipe(
        tap(resp => console.log('API response', resp)), // logs the whole response
        catchError(this.handleError)
      );
  }
  //single todo
  getTodoById(id: number): Observable<Todos> {
    return this.http.get<Todos>(`${this.baseUrl}/todos/${id}`);
  }
  private handleError(err: HttpErrorResponse) {
    console.error('TodoService error', err);
    return throwError(() => err);
  }
  //Get a random todo
  getRandomTodo(): Observable<Todos> {
    return this.http.get<Todos>(`${this.baseUrl}/todos/random`);

  }
}
