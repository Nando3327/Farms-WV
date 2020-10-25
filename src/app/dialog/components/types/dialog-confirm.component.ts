import { Component, Input, OnInit } from '@angular/core';
import { DialogModel } from '../dialog.model';
import { DialogInterface } from '../dialog.interface';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrEmpty } from '../../../general-functions/general-functions';

@Component({
  selector: 'app-dialog-confirm',
  template: `
      <div class="custom-dialog-detail">
        <h1 mat-dialog-title>{{dialog.title}}</h1>
        <div mat-dialog-content>
          <p>{{dialog.message}}</p>
        </div>
        <div mat-dialog-actions class="pull-right">
          <button *ngIf="!dialog.hideCancel" class="btn btn-secondary" style="margin-right: 5px;" mat-dialog-close (click)="handlerCancel()">
            {{globalLabels.buttons.cancel}}
          </button>
          <button *ngFor="let button of dialog.options.buttons" autofocus
                  class="btn btn-primary" mat-dialog-close (click)="button.handler()">{{button.label}}</button>
        </div>
      </div>
  `
})
export class DialogConfirmComponent implements DialogInterface, OnInit {
  @Input() dialog: DialogModel;
  globalLabels: any;

  constructor(private translate: TranslateService) {
    this.loadLabels();
  }

  loadLabels(): void {
    this.translate.get(['transfer', 'global']).subscribe(labels => {
      this.globalLabels = labels.global;
    });
  }

  ngOnInit(): void {
    console.log(this.dialog);
  }

  handlerCancel() {
    if (!isNullOrEmpty(this.dialog.options.handlerCancel)) {
      this.dialog.options.handlerCancel();
    }
  }
}
