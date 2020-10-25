import { Type } from '@angular/core';
import { DialogAlertComponent } from './types/dialog-alert.component';

export class DialogService {

  private registeredDialogs: { [key: string]: Type<any>; } = {};

  registerDialog(type: string, component: Type<any>) {
    this.registeredDialogs[type] = component;
  }

  getDialog(type: string): Type<any> {
    const component = this.registeredDialogs[type];

    if (component == null) {
      return DialogAlertComponent;
    }

    return component;
  }
}
