import { Component, Input } from '@angular/core';
import { DataCellInterface } from '../data-cell.interface';
import { DataColumnModel } from '../../data-column/data-column.model';

@Component({
  selector: 'app-data-currency-cell',
  template: '<span class="kt-badge kt-badge--inline kt-badge--pill kt-badge--wide">{{ row[column.field] }}</span>'
})
export class DataCellBadgeComponent implements DataCellInterface {
  @Input() column: DataColumnModel;
  @Input() row: object;
}
