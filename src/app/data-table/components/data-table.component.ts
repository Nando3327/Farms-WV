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
  defaultPageSize = 10;
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

  public TABLE_DATA: any[];

  @Input() set tableData(dataRows: any[]) {
    this.TABLE_DATA = dataRows;
    if (this.dataSource) {
      this.dataSource.data = this.TABLE_DATA;
    }
  }

  @Input() execute: BehaviorSubject<any>;

  @Input() tableOptions: DataTableOptionsModel;
  @Output() selectedRows = new EventEmitter<Array<any>>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.configureResizeView();
  }

  ngOnInit() {
    this.columns = this.tableOptions.columns.map(x => {
      return x.field;
    });
    this.showTotals = (this.tableOptions.columns.filter(c => {
      return c.showTotal;
    }).length > 0) && this.TABLE_DATA.length > 1;
    this.tableOptions.showExportOptions = isNullOrEmpty(this.tableOptions.showExportOptions) ? true : this.tableOptions.showExportOptions;
    // tslint:disable-next-line:max-line-length
    this.tableOptions.hideCSVExportOptions = isNullOrEmpty(this.tableOptions.hideCSVExportOptions) ? false : this.tableOptions.hideCSVExportOptions;
    // tslint:disable-next-line:max-line-length
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
      this.labels = labels.table;
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
    const applyBreakpoints = this.tableOptions.columns.find(c => !isNullOrEmpty(c.breakpoints));
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
        // tslint:disable-next-line:max-line-length
        this.tableOptions.columns.filter(c => c.breakpoints === '' || c.breakpoints === 'xs' || c.breakpoints === 'xs sm').forEach(c => columns.push(c.field));
        break;
      }
      case 'md': {
        // tslint:disable-next-line:max-line-length
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
      data: {row, options: this.tableOptions},
      id: 'data-table-detail-row'
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
