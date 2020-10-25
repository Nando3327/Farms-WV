import { Component, Input, OnInit } from '@angular/core';
import { DialogModel } from '../dialog.model';
import { DialogInterface } from '../dialog.interface';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrEmpty } from '../../../general-functions/general-functions';


@Component({
  selector: 'app-dialog-alert',
  template: `
    <div class="custom-dialog-detail">
      <h1 mat-dialog-title>{{dialog.title}}</h1>
      <div mat-dialog-content>
        <p class="text-justify">{{dialog.message}}</p>
      </div>
      <div mat-dialog-actions class="pull-right">
        <button class="btn btn-primary" mat-dialog-close>{{btnMessage}}</button>
      </div>
    </div>
  `
})
export class DialogAlertComponent implements DialogInterface, OnInit {
  @Input() dialog: DialogModel;
  btnMessage: string;

  constructor(private translate: TranslateService) {
    this.loadLabels();
  }

  loadLabels(): void {
    this.translate.get(['global']).subscribe(labels => {
      this.btnMessage = !isNullOrEmpty(labels.global.buttons.alert) ? labels.global.buttons.alert : labels.global.buttons.accept;
    });
  }

  ngOnInit(): void {
  }
}
