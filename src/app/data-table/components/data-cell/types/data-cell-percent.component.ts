import { Component, Input, OnInit } from '@angular/core';
import { DataCellInterface } from '../data-cell.interface';
import { DataColumnModel } from '../../data-column/data-column.model';

@Component({
  selector: 'app-data-percent-cell',
  template: '{{ row[column.field] }}%'
})
export class DataCellPercentComponent implements DataCellInterface {
  @Input() column: DataColumnModel;
  @Input() row: object;
}
