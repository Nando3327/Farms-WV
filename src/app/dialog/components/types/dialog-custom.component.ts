import { Component, Input, OnInit } from '@angular/core';
import { DialogModel } from '../dialog.model';
import { DialogInterface } from '../dialog.interface';

@Component({
  selector: 'app-dialog-custom',
  template: `
    <div mat-dialog-content>
      <ng-container *ngComponentOutlet="dynamicComponent"></ng-container>
    </div>
  `
})
export class DialogCustomComponent implements DialogInterface, OnInit {
  @Input() dialog: DialogModel;

  dynamicComponent = null;

  ngOnInit(): void {
    if (this.dialog.options) {
      this.dynamicComponent = this.dialog.options.custom;
    }
  }
}
