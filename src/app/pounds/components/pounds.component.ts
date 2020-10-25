import { Component, Input, OnInit } from '@angular/core';
import { DataTableOptionsModel } from '../../data-table/components';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { PoundsService } from '../pounds.service';
import { Pounds, PoundsConfig, PoundsSearch } from '../models/pounds.model';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerModel } from '../../spinner/models';
import { SpinnerService } from '../../spinner/services/spinner.service';
import { DialogBuildService } from '../../dialog/components';
import { MatDialog } from '@angular/material/dialog';
import { PoundsFormDialogComponent } from '../../poundsFormDialog/components';
import { isNullOrEmpty } from '../../general-functions/general-functions';

@Component({
  selector: 'app-pounds',
  templateUrl: './pounds.component.html',
  styleUrls: ['./pounds.component.scss']
})
export class PoundsComponent implements OnInit {

  @Input() config: PoundsConfig;
  data: Array<any> = [];
  showTable = false;
  tableOptions: DataTableOptionsModel;

  size: any;
  name: any;

  globalLabels: any;
  labels: any;

  constructor(private poundsService: PoundsService,
              private translate: TranslateService,
              private spinner: SpinnerService,
              private dialogMaterial: MatDialog,
              private dialog: DialogBuildService) {
  }

  ngOnInit(): void {
    this.loadLabels();
  }

  loadPounds(): void {
    this.showTable = false;
    this.spinner.show(new SpinnerModel(this.globalLabels.spinner.loading));
    this.poundsService.getPounds('pounds/' + this.config.farm.Id).subscribe((data: PoundsSearch) => {
      this.spinner.hide();
      this.size = data.size;
      this.name = this.config.farm.Name;
      this.data = data.pounds;
      this.showTable = true;
    }, error => {
      this.spinner.hide();
      this.dialog.buildDialog({
        message: this.globalLabels.errors.genericErrorMessage
      });
      console.log(error);
    });
  }

  loadLabels(): void {
    this.translate.get(['pounds', 'global']).subscribe(labels => {
      this.globalLabels = labels.global;
      this.labels = labels.pounds;
      this.initGrid();
      this.loadPounds();
    });
  }

  initGrid() {
    this.tableOptions = {
      title: this.labels.table.title,
      columns: [
        {field: 'Name', name: this.labels.table.name},
        {field: 'Size', name: this.labels.table.size, type: 'currency'},
      ]
    };
    if (this.config.showActions) {
      this.tableOptions.columns.push({
        field: 'actions',
        name: this.globalLabels.buttons.actions,
        type: 'actions',
        options: {
          buttons: [
            {
              tooltip: this.globalLabels.buttons.edit,
              icon: 'edit',
              handler: this.editItem.bind(this)
            },
            {
              tooltip: this.globalLabels.buttons.delete,
              icon: 'delete',
              handler: this.deletePound.bind(this)
            }
          ]
        }
      });
      this.tableOptions.buttons = [
        {
          name: this.labels.table.newFarm,
          handler: () => {
            this.createPound();
          }
        }
      ];
    }
  }

  deletePound(item): void {
    this.dialog.buildDialog({
      type: 'confirm',
      message: this.labels.messages.deleteConfirm,
      options: {
        buttons: [
          {
            label: this.translate.instant('global.buttons.accept'),
            handler: () => {
              this.deletePoundAction(item.Id);
            }
          }
        ]
      }
    });
  }

  deletePoundAction(id): void {
    this.spinner.show(new SpinnerModel(this.globalLabels.spinner.loading));
    this.poundsService.deletePound('deletePound/' + id).subscribe(_ => {
      this.spinner.hide();
      this.dialog.buildDialog({
        message: this.labels.messages.farmDeleted
      });
      this.loadPounds();
    }, error => {
      this.spinner.hide();
      this.dialog.buildDialog({
        message: this.globalLabels.errors.genericErrorMessage
      });
      console.log(error);
    });
  }

  editItem(item): void {
    const dialogRef = this.dialogMaterial.open(PoundsFormDialogComponent, {
      width: '80%',
      data: {
        mode: 'edit',
        model: item
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && !isNullOrEmpty(result.model)) {
        this.editPoundAction(result.model);
      }
    });
  }

  createPound(): void {
    const dialogRef = this.dialogMaterial.open(PoundsFormDialogComponent, {
      width: '80%',
      data: {
        mode: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && !isNullOrEmpty(result.model)) {
        this.createPoundAction(result.model);
      }
    });
  }

  createPoundAction(model): void {
    this.spinner.show(new SpinnerModel(this.globalLabels.spinner.loading));
    this.poundsService.createPound({
      Name: model.Name,
      Size: model.Size,
      Id: this.config.farm.Id
    }).subscribe(res => {
      this.spinner.hide();
      this.validateResponseCreateEdit(res);
    }, error => {
      this.spinner.hide();
      this.dialog.buildDialog({
        message: this.globalLabels.errors.genericErrorMessage
      });
      console.log(error);
    });
  }

  editPoundAction(model): void {
    this.spinner.show(new SpinnerModel(this.globalLabels.spinner.loading));
    this.poundsService.editPound({
      Name: model.Name,
      Size: model.Size,
      Id: model.Id
    }).subscribe(res => {
      this.spinner.hide();
      this.validateResponseCreateEdit(res);
    }, error => {
      this.spinner.hide();
      this.dialog.buildDialog({
        message: this.globalLabels.errors.genericErrorMessage
      });
      console.log(error);
    });
  }

  validateResponseCreateEdit(res): void {
    if (res.status && res.status === 'OK') {
      this.dialog.buildDialog({
        message: this.labels.messages.farmCreated
      });
      this.loadPounds();
    } else {
      switch (res.status) {
        case 'Duplicate':
          this.dialog.buildDialog({
            message: this.labels.messages.farmDuplicate
          });
          break;
        default: {
          this.dialog.buildDialog({
            message: this.labels.messages.farmGenericErrorCreateUpdate
          });
        }
      }
    }
  }
}
