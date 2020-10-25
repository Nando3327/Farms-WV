import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { DataCellService } from './data-cell/data-cell.service';
import { DataTableDetailComponent } from './data-table-detail.component';
import { DataTableOptionsModel } from './data-table-options.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getWindowSize, isNullOrEmpty } from '../../general-functions/general-functions';

@Component({
  selector: 'app-data-table',
  templateUrl: 'data-table.component.html',
  styleUrls: ['data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy, AfterViewInit {

  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  columns: string[];
  activeColumns: string[];
  defaultPageSize: number = 10;
  defaultPageSizeOptions: number[] = [5, 10, 25, 50, 100];
  showDetailColumn: boolean;
  labels: any;
  globalLabels: any;
  showTotals = false;

  // Handle subscriptions
  private subscriptions: Subscription[] = [];

  constructor(private dialog: MatDialog,
              private dataCellService: DataCellService,
              private translate: TranslateService) {
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.sort = this.sort;
    this.columns = [];
    this.activeColumns = [];
    this.showDetailColumn = false;
    this.loadLabels();
  }

  public _tableData: any[];
  @Input() set tableData(dataRows: any[]) {
    this._tableData = dataRows;
    if (this.dataSource) {
      this.dataSource.data = this._tableData;
    }
  };

  @Input() execute: BehaviorSubject<any>;

  @Input() tableOptions: DataTableOptionsModel;
  @Output() selectedRows = new EventEmitter<Array<any>>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureResizeView();
  }

  ngOnInit() {
    this.columns = this.tableOptions.columns.map(x => {
      return x.field;
    });
    this.showTotals = (this.tableOptions.columns.filter(c => {
      return c.showTotal;
    }).length > 0) && this._tableData.length > 1;
    this.tableOptions.showExportOptions = isNullOrEmpty(this.tableOptions.showExportOptions) ? true : this.tableOptions.showExportOptions;
    this.tableOptions.hideCSVExportOptions = isNullOrEmpty(this.tableOptions.hideCSVExportOptions) ? false : this.tableOptions.hideCSVExportOptions;
    this.tableOptions.hideSelectFieldAll = isNullOrEmpty(this.tableOptions.hideSelectFieldAll) ? false : this.tableOptions.hideSelectFieldAll;
    if (this.tableOptions.selectField) {
      this.columns.unshift('select');
    }
    this.configureResizeView();

    if (this.execute) {
      this.execute.subscribe(evt => {
        switch (evt.action) {
          case 'select': {
            if (!isNullOrEmpty(evt.data) && !isNullOrEmpty(evt.data.clear)) {
              this.selection.clear();
            } else {
              const selectedRowsArray = this.dataSource.data.filter(row => {
                return row.selected;
              });
              selectedRowsArray.forEach(row => {
                this.selection.select(row);
              });
            }
            this.selectedRows.emit(this.selection.selected);
            break;
          }
        }
      });
    }
  }

  loadLabels(): void {
    this.translate.get(['table', 'global']).subscribe(labels => {
      this.globalLabels = labels.global;
      this.labels = labels['table'];
    });
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.subscriptions.push(this.dataCellService.detailColumn$.subscribe(result => {
      if (result && this.dialog.getDialogById('data-table-detail-row')) {
        this.dialog.getDialogById('data-table-detail-row').close();
      }
    }));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace

    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.dataSource.data.forEach(row => {
        row.selected = false;
      });
    } else {
      this.dataSource.data.forEach(row => {
        row.selected = true;
        this.selection.select(row);
      });
    }
    this.selectedRows.emit(this.selection.selected);
  }

  toggleSelection(row: any) {
    row.selected = !row.selected;
    this.selection.toggle(row);
    this.selectedRows.emit(this.selection.selected);
  }

  // exportToExcel() {
  //   this.excel.exportAsExcelFile(
  //     this.createObjectToPrint(this.tableOptions.columns, this._tableData),
  //     this.tableOptions.title
  //   );
  // }

  // createTable(data) {
  //   let arrData = typeof data !== 'object' ? JSON.parse(data) : data;
  //   let CSV = '';
  //   //1st loop is to extract each row
  //   for (let i = 0; i < arrData.length; i++) {
  //     let row = '';
  //     //2nd loop will extract each column and convert it in string tab-seprated
  //     for (let index in arrData[i]) {
  //       row += arrData[i][index] + '    ';
  //     }
  //     row.slice(0, row.length - 1);
  //     //add a line break after each row
  //     CSV += row + '\r\n';
  //   }
  //   return CSV;
  // }

  // exportToCSV() {
  //   let dataString = this.createTable(this.createObjectToPrint(this.tableOptions.columns, this._tableData));
  //   let blob = new Blob(['\ufeff' + dataString], {
  //     type: 'text/csv;charset=utf-8;'
  //   });
  //   let dwldLink = document.createElement('a');
  //   let url = URL.createObjectURL(blob);
  //   let isSafariBrowser = navigator.userAgent.indexOf(
  //     'Safari') !== -1;
  //   //if Safari open in new window to save file with random filename.
  //   if (isSafariBrowser) {
  //     dwldLink.setAttribute('target', '_blank');
  //   }
  //   dwldLink.setAttribute('href', url);
  //   dwldLink.setAttribute('download', this.tableOptions.title + '.txt');
  //   dwldLink.style.visibility = 'hidden';
  //   document.body.appendChild(dwldLink);
  //   dwldLink.click();
  //   document.body.removeChild(dwldLink);
  // }

  // createObjectToPrint(columns, data) {
  //   let retorno = [];
  //   data.forEach(item => {
  //     let rowName = '';
  //     let row = {};
  //     columns.forEach(column => {
  //       if (!isNullOrEmpty(item[column['field']])) {
  //         rowName = column['name'];
  //         if (column.type === 'date' && column.options && column.options.dateFormat) {
  //           row[rowName] = moment(item[column['field']]).format(column.options.dateFormat.toUpperCase());
  //         } else {
  //           row[rowName] = item[column['field']];
  //         }
  //       } else {
  //         rowName = column['name'];
  //         row[rowName] = '';
  //       }
  //     });
  //     retorno.push(row);
  //   });
  //   return retorno;
  // }

  // createTableObject() {
  //   const formatter = new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //     minimumFractionDigits: 2
  //   });
  //
  //   let headersName = [];
  //   let rows = [];
  //   let headers = this.tableOptions.columns.filter(el => ['select', 'actions'].indexOf(el.field) === -1);
  //   headers.forEach(column => {
  //     headersName.push(column['name']);
  //   });
  //   let body = [headersName];
  //
  //   this._tableData.forEach(item => {
  //     let row = [];
  //     headers.forEach(column => {
  //       if (column.type === 'date' && column.options && column.options.dateFormat) {
  //         item[column['field']] = moment(item[column['field']]).format(column.options.dateFormat.toUpperCase());
  //       }
  //       if (column.type === 'currency') {
  //         row.push(formatter.format(item[column['field']]));
  //       } else if (!isNullOrEmpty(item[column['field']])) {
  //         row.push(item[column['field']].toString());
  //       } else {
  //         row.push('');
  //       }
  //
  //     });
  //     rows.push(row);
  //   });
  //   rows.forEach(row => {
  //     body.push(row);
  //   });
  //   return body;
  // }
  //
  // exportToPDF() {
  //   let body = this.createTableObject();
  //   const docDefinition = {
  //     content: [
  //       {
  //         style: 'tableExample',
  //         table: {
  //           headerRows: 1,
  //           body: body
  //         },
  //         layout: {
  //           fillColor: function(rowIndex, node, columnIndex) {
  //             return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
  //           }
  //         }
  //       }
  //     ]
  //   };
  //   // pdfMake.createPdf(docDefinition).download();
  // }

  // printScreen() {
  //   let d = new Date();
  //   let curr_date = (d.getDate() + 1 < 10) ? '0' + (d.getDate()) : d.getDate().toString();
  //   let curr_month = (d.getMonth() + 1 < 10) ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1).toString(); //Months are zero based
  //   let curr_year = d.getFullYear().toString();
  //   let dateShow = curr_date + '/' + curr_month + '/' + curr_year;
  //
  //   const loaderConfig = this.layoutConfigService.getConfig('loader');
  //   this.headerLogo = objectPath.get(loaderConfig, 'logo');
  //
  //   let template = '<div class="container">' +
  //     '<div class="row">' +
  //     '<div class="col-xs-6 col-sm-6">' +
  //     '<h4 style="font-weight: bold">T&iacute;tulo: <span style="font-weight: normal">' + this.tableOptions.title + '</span></h4>' +
  //     '<h4 style="font-weight: bold">Fecha: <span style="font-weight: normal">' + dateShow + '</span></h4>' +
  //     '</div>' +
  //     '<div class="col-xs-6 col-sm-6 text-right">' +
  //     '<img src="' + this.headerLogo + '"/>' +
  //     '</div>' +
  //     '</div>' +
  //     '</div>' +
  //     '<hr>' +
  //     '<br><br><br>';
  //
  //   let tableObject = this.createTableObject();
  //
  //   let head = document.createElement('div');
  //   head.innerHTML = template;
  //   let table = document.createElement('table');
  //   let tableBody = document.createElement('tbody');
  //   tableObject.forEach(function(rowData) {
  //     let row = document.createElement('tr');
  //     rowData.forEach(function(cellData) {
  //       let cell = document.createElement('td');
  //       cell.style.border = '1px solid #dddddd';
  //       cell.style.border = '1px solid #dddddd;';
  //       cell.appendChild(document.createTextNode(cellData));
  //       row.appendChild(cell);
  //     });
  //
  //     tableBody.appendChild(row);
  //   });
  //
  //   table.appendChild(tableBody);
  //
  //   let divprint = document.createElement('div');
  //   divprint.style.display = 'none';
  //   divprint.classList.add('visible-print');
  //   divprint.appendChild(head);
  //   divprint.appendChild(table);
  //   window.document.body.appendChild(divprint);
  //
  //   setTimeout(function() {
  //     window.print();
  //     window.document.body.removeChild(divprint);
  //   }, 1000);
  //
  // }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.id + 1}`;
  }

  getRowsByScreenSize(): Array<string> {
    const winSize = getWindowSize();
    const applyBreakpoints = this.tableOptions.columns.find(c => !isNullOrEmpty(c.breakpoints)) ? true : false;
    const columns = Object.assign([], this.columns);
    if (winSize.width < 768) {
      if (applyBreakpoints) {
        return this.getColumnsByBreakpoint('', columns);
      } else {
        return columns.slice(0, 2);
      }
    } else {
      if (winSize.width < 992) {
        if (applyBreakpoints) {
          return this.getColumnsByBreakpoint('xs', columns);
        } else {
          return columns.slice(0, 4);
        }
      } else {
        if (winSize.width < 1200) {
          if (applyBreakpoints) {
            return this.getColumnsByBreakpoint('sm', columns);
          } else {
            return columns.slice(0, 6);
          }
        } else {
          if (applyBreakpoints) {
            return this.getColumnsByBreakpoint('md', columns);
          } else {
            return columns.slice(0, 8);
          }
        }
      }
    }
  }

  getColumnsByBreakpoint(b: string, defaultColumns?: string[]): string[] {
    const columns = [];
    let selectIsAdded = false;
    if (this.tableOptions.selectField && !this.tableOptions.selectFieldEndColumn) {
      selectIsAdded = true;
      columns.push(defaultColumns[0]);
    }

    switch (b) {
      case '': {
        this.tableOptions.columns.filter(c => c.breakpoints === '').forEach(c => columns.push(c.field));
        break;
      }
      case 'xs': {
        this.tableOptions.columns.filter(c => c.breakpoints === '' || c.breakpoints === 'xs').forEach(c => columns.push(c.field));
        break;
      }
      case 'sm': {
        this.tableOptions.columns.filter(c => c.breakpoints === '' || c.breakpoints === 'xs' || c.breakpoints === 'xs sm').forEach(c => columns.push(c.field));
        break;
      }
      case 'md': {
        this.tableOptions.columns.filter(c => c.breakpoints === '' || c.breakpoints === 'xs' || c.breakpoints === 'xs sm' || c.breakpoints === 'xs sm md').forEach(c => columns.push(c.field));
        break;
      }
    }
    if (this.tableOptions.selectField && this.tableOptions.selectFieldEndColumn && !selectIsAdded) {
      columns.push(defaultColumns[0]);
    }
    return columns;
  }

  configureResizeView() {
    this.activeColumns = this.getRowsByScreenSize();
    if (this.activeColumns.length !== this.columns.length) {
      this.activeColumns.push('detail');
      this.showDetailColumn = false;
    }
  }

  handleResponsiveColumns(row: any) {
    this.dialog.open(DataTableDetailComponent, {
      width: '80%',
      height: '90%',
      data: {row: row, options: this.tableOptions},
      id: 'data-table-detail-row'
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
