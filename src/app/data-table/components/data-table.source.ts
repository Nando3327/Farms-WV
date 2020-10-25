import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';

export class GenericDataSource extends DataSource<any> {
  constructor(
    private dataSource
  ) {
    super();
  }

  connect(): Observable<any> {
    return of(this.dataSource);
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }


}
