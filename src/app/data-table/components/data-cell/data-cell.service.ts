import { Type, OnInit } from '@angular/core';
import { DataCellTextComponent } from './types/data-cell-text.component';
import { BehaviorSubject } from 'rxjs';

export class DataCellService {
  
  detailColumn$: BehaviorSubject<boolean>;
  private registeredCells: { [key: string]: Type<any>; } = {};

  constructor() {
    this.detailColumn$ = new BehaviorSubject<boolean>(false);
  }

  registerCell(type: string, component: Type<any>) {
    this.registeredCells[type] = component;
  }

  getCell(type: string): Type<any> {
    const component = this.registeredCells[type];

    if (component == null) {
      return DataCellTextComponent;
    }

    return component;
  }

  sendResult(result: boolean) {
    this.detailColumn$.next(result);
  }
}
