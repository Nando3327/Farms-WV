import { Component, ComponentFactoryResolver, Inject, OnInit, ViewChild } from '@angular/core';
import { DialogDirective } from './dialog.directive';
import { DialogService } from './dialog.service';
import { DialogModel } from './dialog.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog',
  template: '<ng-template appDialogHost></ng-template>'
})

export class DialogComponent implements OnInit {
  @ViewChild(DialogDirective, {static: true}) dialogHost: DialogDirective;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialog: DialogModel,
    private readonly dialogService: DialogService,
    private translate: TranslateService,
    private readonly componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
    this.buildDialogOptions();
    this.initDialog();
  }

  initDialog() {
    const dialogComponent = this.dialogService.getDialog(this.dialog.type);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dialogComponent);
    const viewContainerRef = this.dialogHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const dialogInstance = componentRef.instance as DialogComponent;
    dialogInstance.dialog = this.dialog;
  }

  buildDialogOptions() {
    if (!this.dialog.title) {
      this.dialog.title = this.translate.instant('global.dialog.dearUser');
    }
  }
}
