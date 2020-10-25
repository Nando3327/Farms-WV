import { DialogComponent } from './dialog.component';
import { DialogDirective } from './dialog.directive';
import { DialogAlertComponent } from './types/dialog-alert.component';
import { DialogConfirmComponent } from './types/dialog-confirm.component';
import { DialogCustomComponent } from './types/dialog-custom.component';

export const DIALOG_COMPONENTS = [DialogComponent];

export const DIALOG_TYPE_COMPONENTS = [
  DialogAlertComponent,
  DialogConfirmComponent,
  DialogCustomComponent,
];

export const DIALOG_DIRECTIVES = [DialogDirective];

export * from './dialog.component';
export * from './types/dialog-alert.component';
export * from './types/dialog-confirm.component';
export * from './types/dialog-custom.component';
export * from './dialog.model';
export * from './dialog-build.service';
