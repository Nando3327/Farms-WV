import { DataTableComponent } from './data-table.component';
import { DataTableDetailComponent } from './data-table-detail.component';
import { DataCellComponent } from './data-cell/data-cell.component';
import { DataCellTextComponent } from './data-cell/types/data-cell-text.component';
import { DataCellDateComponent } from './data-cell/types/data-cell-date.component';
import { DataCellCurrencyComponent } from './data-cell/types/data-cell-currency.component';
import { DataCellPercentComponent } from './data-cell/types/data-cell-percent.component';
import { DataCellLinkComponent } from './data-cell/types/data-cell-link.component';
import { DataCellActionsComponent } from './data-cell/types/data-cell-actions.component';
import { DataCellDirective } from './data-cell/data-cell.directive';
import { DataCellBadgeComponent } from './data-cell/types/data-cell-badge.component';

export const TABLE_COMPONENTS = [
  DataTableComponent,
  DataTableDetailComponent,
  DataCellComponent
];

export const CELL_COMPONENTS = [
  DataCellTextComponent,
  DataCellDateComponent,
  DataCellCurrencyComponent,
  DataCellPercentComponent,
  DataCellLinkComponent,
  DataCellBadgeComponent,
  DataCellActionsComponent,
  DataTableDetailComponent
];

export const CELL_DIRECTIVES = [
  DataCellDirective
];



export * from './data-table.component';
export * from './data-cell/data-cell.component';
export * from './data-cell/types/data-cell-text.component';
export * from './data-cell/types/data-cell-date.component';
export * from './data-cell/types/data-cell-percent.component';
export * from './data-cell/types/data-cell-link.component';
export * from './data-cell/types/data-cell-badge.component';
export * from './data-cell/types/data-cell-currency.component';
export * from './data-cell/types/data-cell-actions.component';
export * from './data-table-options.model';
