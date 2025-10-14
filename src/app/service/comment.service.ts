import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CommentResponse } from '../model/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'https://dummyjson.com';
  constructor(private http: HttpClient) { }
  getComment(limit = 30, skip = 0): Observable<CommentResponse> {
    const params = new HttpParams()
      .set('limit', String(limit))
      .set('skip', String(skip));

    return this.http
      .get<CommentResponse>(`${this.baseUrl}/comments`, { params })
      .pipe(
        tap(resp => console.log('API response', resp)), // logs the whole response
        catchError(this.handleError)
      );
  }
  private handleError(err: HttpErrorResponse) {
    console.error('TodoService error', err);
    return throwError(() => err);
  }
}
