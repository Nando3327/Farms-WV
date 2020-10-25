import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PoundsSearch } from './models/pounds.model';

@Injectable()
export class PoundsService {

  constructor(private http: HttpClient) {
  }

  public getPounds(method): Observable<PoundsSearch> {
    return this.http.get(environment.linkerUrl + method).pipe(
      map((res: any) => {
        if (res && res.code === 200) {
          return res.data;
        }
        throw throwError(res.message);
      }),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  public deletePound(method): Observable<any> {
    return this.http.delete(environment.linkerUrl + method).pipe(
      map((res: any) => {
        if (res && res.code === 200) {
          return res.data;
        }
        throw throwError(res.message);
      }),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  public createPound(params): Observable<any> {
    return this.http.post(environment.linkerUrl + 'newPound', {name: params.Name, size: params.Size, id: params.Id}).pipe(
      map((res: any) => {
        if (res && res.code === 200) {
          return {response: res.data, status: 'OK'};
        } else if (res.message.indexOf('Duplicate') > -1) {
          return {error: res.message, status: 'Duplicate'};
        }
        throw throwError(res.message);
      }),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  public editPound(params): Observable<any> {
    return this.http.put(environment.linkerUrl + 'editPound', {name: params.Name, size: params.Size, id: params.Id}).pipe(
      map((res: any) => {
        if (res && res.code === 200) {
          return {response: res.data, status: 'OK'};
        } else if (res.message.indexOf('Duplicate') > -1) {
          return {error: res.message, status: 'Duplicate'};
        }
        throw throwError(res.message);
      }),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
