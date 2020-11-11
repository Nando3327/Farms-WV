import { DataColumnModel } from './data-column/data-column.model';

export class DataTableOptionsModel {
  title: string;
  columns: Array<DataColumnModel>;
  buttons?: Array<any>;
  selectField?: boolean;
  selectFieldEndColumn?: boolean;
  hideSelectFieldAll?: boolean;
  sortable?: boolean;
  showExportOptions?: boolean;
  hideCSVExportOptions?: boolean;
}
