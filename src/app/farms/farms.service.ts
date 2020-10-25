import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Farm } from './models/farms.model';

@Injectable()
export class FarmsService {

  constructor(private http: HttpClient) {
  }

  public getFarms(method): Observable<Array<Farm>> {
    return this.http.get(environment.linkerUrl + method).pipe(
      map((res: any) => {
        if (res && res.code === 200) {
          return res.data && res.data.farms ? res.data.farms : [];
        }
        throw throwError(res.message);
      }),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  public getPounds(method): Observable<any> {
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

  public deleteFarm(method): Observable<any> {
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

  public createFarm(params): Observable<any> {
    return this.http.post(environment.linkerUrl + 'newFarm', {name: params.Name}).pipe(
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

  public editFarm(params): Observable<any> {
    return this.http.put(environment.linkerUrl + 'editFarm', {name: params.Name, id: params.id}).pipe(
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
