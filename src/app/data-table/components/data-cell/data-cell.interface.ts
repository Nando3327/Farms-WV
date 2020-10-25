import { DataColumnModel } from '../data-column/data-column.model';

export interface DataCellInterface {
  column: DataColumnModel;
  row: object;
}
