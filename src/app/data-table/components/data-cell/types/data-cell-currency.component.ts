import { Component, Input, OnInit } from '@angular/core';
import { DataCellInterface } from '../data-cell.interface';
import { DataColumnModel } from '../../data-column/data-column.model';

@Component({
  selector: 'app-data-currency-cell',
  template: '<span>{{ row[column.field] | currency:" " }}</span>'
})
export class DataCellCurrencyComponent implements DataCellInterface{
  @Input() column: DataColumnModel;
  @Input() row: object;
  @Input() mode: string;
}
