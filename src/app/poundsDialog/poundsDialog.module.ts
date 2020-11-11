import { NgModule } from '@angular/core';
import { POUNDS_DIALOG_COMPONENTS, PoundsDialogComponent, } from './components';
import { DemoMaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { DataTableModule } from '../data-table';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PoundsModule } from '../pounds';

const routes: Route[] = [
  {
    path: '',
    component: PoundsDialogComponent,
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
    PoundsModule
  ],
  declarations: [...POUNDS_DIALOG_COMPONENTS],
  entryComponents: [...POUNDS_DIALOG_COMPONENTS, PoundsDialogComponent],
  exports: [...POUNDS_DIALOG_COMPONENTS, RouterModule],
  providers: []
})
export class PoundsDialogModule {
}
