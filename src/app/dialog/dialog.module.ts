import { NgModule } from '@angular/core';
import { DIALOG_COMPONENTS, DIALOG_DIRECTIVES, DIALOG_TYPE_COMPONENTS, DialogAlertComponent } from './components';
import { DialogBuildService } from './components/dialog-build.service';
import { DialogService } from './components/dialog.service';
import { DialogConfirmComponent } from './components/types/dialog-confirm.component';
import { DialogCustomComponent } from './components/types/dialog-custom.component';
import { DemoMaterialModule } from '../material.module';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormlyModule.forChild(),
    FormlyMaterialModule,
  ],
  declarations: [
    ...DIALOG_COMPONENTS,
    ...DIALOG_TYPE_COMPONENTS,
    ...DIALOG_DIRECTIVES
  ],
  exports: [...DIALOG_COMPONENTS],
  entryComponents: [...DIALOG_COMPONENTS, ...DIALOG_TYPE_COMPONENTS],
  providers: [DialogService, DialogBuildService]
})
export class DialogModule {
  constructor(private readonly dialogService: DialogService) {
    dialogService.registerDialog('alert', DialogAlertComponent);
    dialogService.registerDialog('confirm', DialogConfirmComponent);
    dialogService.registerDialog('custom', DialogCustomComponent);
  }
}
