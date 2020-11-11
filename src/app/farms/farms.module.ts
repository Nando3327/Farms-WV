import { NgModule } from '@angular/core';
import { FARMS_COMPONENTS, FarmsComponent } from './components';
import { DemoMaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { DataTableModule } from '../data-table';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FarmsService } from './farms.service';
import { PoundsModule } from '../pounds';
import { PoundsDialogComponent, PoundsDialogModule } from '../poundsDialog';

const routes: Route[] = [
  {
    path: '',
    component: FarmsComponent,
  },
  {path: '', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    DataTableModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,
    RouterModule.forChild(routes),
    PoundsModule,
    PoundsDialogModule
  ],
  declarations: [...FARMS_COMPONENTS],
  entryComponents: [...FARMS_COMPONENTS, PoundsDialogComponent],
  exports: [...FARMS_COMPONENTS, RouterModule],
  providers: [FarmsService]
})
export class FarmsModule {
}
