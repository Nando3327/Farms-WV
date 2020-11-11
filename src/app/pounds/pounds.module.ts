import { NgModule } from '@angular/core';
import { POUNDS_COMPONENTS, PoundsComponent } from './components';
import { DemoMaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { DataTableModule } from '../data-table';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PoundsService } from './pounds.service';
import { PoundsFormDialogModule } from '../poundsFormDialog';
import { PoundsFormDialogComponent } from '../poundsFormDialog/components';

const routes: Route[] = [
  {
    path: '',
    component: PoundsComponent,
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
    PoundsFormDialogModule
  ],
  declarations: [...POUNDS_COMPONENTS],
  entryComponents: [...POUNDS_COMPONENTS, PoundsFormDialogComponent],
  exports: [...POUNDS_COMPONENTS, RouterModule],
  providers: [PoundsService]
})
export class PoundsModule {
}
