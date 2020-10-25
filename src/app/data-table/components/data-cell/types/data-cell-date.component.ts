import { Component, Input, OnInit } from '@angular/core';
import { DataCellInterface } from '../data-cell.interface';
import { DataColumnModel } from '../../data-column/data-column.model';

@Component({
  selector: 'app-data-date-cell',
  template: '{{ row[column.field] | date:dateFormat }}'
})
export class DataCellDateComponent implements DataCellInterface, OnInit {
  @Input() column: DataColumnModel;
  @Input() row: object;

  dateFormat: string = 'dd/MM/yyyy';

  ngOnInit(): void {
    if (this.column.options) {
      if (this.column.options.dateFormat) {
        this.dateFormat = this.column.options.dateFormat;
      }
    }
  }


}
