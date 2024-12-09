import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  private readonly baseUrl = 'https://ionicframework.com/docs/native/geolocation'; 

 
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  
  createItem(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/items`, data, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  
  getItem(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/items/${id}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

 
  deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/items/${id}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  
  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error('Error en la comunicación con el servidor.'));
  }
}
