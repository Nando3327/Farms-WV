import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-data-table-detail',
  templateUrl: 'data-table-detail.component.html'
})
export class DataTableDetailComponent implements OnInit {
  columns: Array<any>;
  row: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.row = this.data.row;
    this.columns = this.data.options.columns;
  }
}
