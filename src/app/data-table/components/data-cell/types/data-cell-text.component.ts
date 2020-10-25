import { Component, Input } from '@angular/core';
import { DataCellInterface } from '../data-cell.interface';
import { DataColumnModel } from '../../data-column/data-column.model';

@Component({
  selector: 'app-data-text-cell',
  template: '{{ row[column.field] }}'
})
export class DataCellTextComponent implements DataCellInterface {
  @Input() column: DataColumnModel;
  @Input() row: object;
}
