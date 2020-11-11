import { Component, Input } from '@angular/core';
import { DataCellInterface } from '../data-cell.interface';
import { DataColumnModel } from '../../data-column/data-column.model';
import { DataCellService } from '../data-cell.service';

@Component({
  selector: 'app-data-link-cell',
  template: `<a class="kt-link" (click)="handleLinkClick()" href="javascript:;">
    {{ row[column.field] }}
  </a>`
})
export class DataCellLinkComponent implements DataCellInterface {
  @Input() column: DataColumnModel;
  @Input() row: object;
  @Input() mode: string;

  constructor(
    private dataCellService: DataCellService
  ) {
  }

  handleLinkClick() {
    if (this.column.options && typeof this.column.options.handler === 'function') {
      if (this.mode === 'detail') {
        this.dataCellService.sendResult(true);
      }
      this.column.options.handler(this.row);
    } else {
      throw Error('No handler for column: ' + this.column.field);
    }
  }
}
