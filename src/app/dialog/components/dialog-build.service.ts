import { DialogComponent } from './dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogModel } from './dialog.model';
import { Injectable } from '@angular/core';


@Injectable()
export class DialogBuildService {
  constructor(private dialog: MatDialog) {
  }

  buildDialog(dialogOptions: DialogModel, configuration: MatDialogConfig = {}) {
    if (dialogOptions.type === 'custom' && dialogOptions.disableClose) {
      configuration.id = dialogOptions.id || 'custom-component-id';
      configuration.disableClose = true;
    }

    configuration.data = dialogOptions;

    return this.dialog.open(DialogComponent, configuration);
  }
}
