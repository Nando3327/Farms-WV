import { NgModule } from '@angular/core';
import { DataCellService } from './components/data-cell/data-cell.service';
import {
  CELL_COMPONENTS,
  CELL_DIRECTIVES,
  TABLE_COMPONENTS,
  DataCellActionsComponent,
  DataCellDateComponent,
  DataCellLinkComponent,
  DataCellPercentComponent,
  DataCellCurrencyComponent,
  DataCellBadgeComponent
} from './components';
import { TranslateService } from '@ngx-translate/core';
import { PaginatorI18n } from './PaginatorI18n';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { DemoMaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    DemoMaterialModule,
    CommonModule
  ],
  declarations: [
    ...TABLE_COMPONENTS,
    ...CELL_COMPONENTS,
    ...CELL_DIRECTIVES
  ],
  exports: [
    ...TABLE_COMPONENTS,
    ...CELL_COMPONENTS
  ],
  entryComponents: [
    ...CELL_COMPONENTS
  ],
  providers: [
    {
      provide: MatPaginatorIntl, deps: [TranslateService],
      useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
    },
    DataCellService
  ]
})

export class DataTableModule {
  constructor(
    private readonly dataCellService: DataCellService
  ) {
    dataCellService.registerCell('date', DataCellDateComponent);
    dataCellService.registerCell('currency', DataCellCurrencyComponent);
    dataCellService.registerCell('percent', DataCellPercentComponent);
    dataCellService.registerCell('link', DataCellLinkComponent);
    dataCellService.registerCell('badge', DataCellBadgeComponent);
    dataCellService.registerCell('actions', DataCellActionsComponent);
  }
}
