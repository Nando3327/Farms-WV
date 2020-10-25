import { Component, OnInit } from '@angular/core';
import { DataTableOptionsModel } from '../../data-table/components';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FarmsService } from '../farms.service';
import { Farm } from '../models/farms.model';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerModel } from '../../spinner/models';
import { SpinnerService } from '../../spinner/services/spinner.service';
import { DialogBuildService } from '../../dialog/components';
import { MatDialog } from '@angular/material/dialog';
import { PoundsDialogComponent } from '../../poundsDialog/components';
import { PoundsConfig } from '../../pounds/models/pounds.model';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.scss']
})
export class FarmsComponent implements OnInit {

  data: Array<any> = [];
  showTable = false;
  tableOptions: DataTableOptionsModel;

  form = new FormGroup({});
  model: any;
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];

  globalLabels: any;
  labels: any;
  poundsConfig: PoundsConfig;
  mode = 'add';

  constructor(private farmsService: FarmsService,
              private translate: TranslateService,
              private spinner: SpinnerService,
              private dialogMaterial: MatDialog,
              private dialog: DialogBuildService) {
  }

  ngOnInit(): void {
    this.model = {};
    this.loadLabels();
    this.loadFarms();
  }

  loadFarms(): void {
    this.showTable = false;
    this.spinner.show(new SpinnerModel(this.globalLabels.spinner.loading));
    this.farmsService.getFarms('farms').subscribe((data: Array<Farm>) => {
      this.spinner.hide();
      this.data = data;
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
    this.translate.get(['farm', 'global']).subscribe(labels => {
      this.globalLabels = labels.global;
      this.labels = labels.farm;
      this.initForm();
      this.initGrid();
    });
  }

  initGrid() {
    this.tableOptions = {
      title: this.labels.table.title,
      columns: [
        {field: 'Name', name: this.labels.table.name},
        {
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
                handler: this.deleteFarm.bind(this)
              },
              {
                tooltip: this.globalLabels.buttons.details,
                icon: 'remove_red_eye',
                handler: this.searchDetails.bind(this)
              }
            ]
          }
        }
      ],
      buttons: [
        {
          name: this.labels.table.newFarm,
          handler: () => {
            this.createFarm();
          }
        }
      ]
    };
  }

  searchDetails(item): void {
    this.dialogMaterial.open(PoundsDialogComponent, {
      width: '90%',
      data: item
    });
  }

  deleteFarm(item): void {
    this.spinner.show(new SpinnerModel(this.globalLabels.spinner.loading));
    this.farmsService.getPounds('pounds/' + item.Id).subscribe(res => {
      this.spinner.hide();
      if (res.pounds && res.pounds.length > 0) {
        this.dialog.buildDialog({
          type: 'confirm',
          message: this.labels.messages.poundsWithFarm,
          options: {
            buttons: [
              {
                label: this.translate.instant('global.buttons.accept'),
                handler: () => {
                  this.deleteFarmAction(item.Id);
                }
              }
            ]
          }
        });
      } else {
        this.dialog.buildDialog({
          type: 'confirm',
          message: this.labels.messages.deleteConfirm,
          options: {
            buttons: [
              {
                label: this.translate.instant('global.buttons.accept'),
                handler: () => {
                  this.deleteFarmAction(item.Id);
                }
              }
            ]
          }
        });
      }
    }, error => {
      this.spinner.hide();
      this.dialog.buildDialog({
        message: this.globalLabels.errors.genericErrorMessage
      });
      console.log(error);
    });
  }

  deleteFarmAction(id): void {
    this.spinner.show(new SpinnerModel(this.globalLabels.spinner.loading));
    this.farmsService.deleteFarm('deleteFarm/' + id).subscribe(_ => {
      this.spinner.hide();
      this.dialog.buildDialog({
        message: this.labels.messages.farmDeleted
      });
      this.loadFarms();
    }, error => {
      this.spinner.hide();
      this.dialog.buildDialog({
        message: this.globalLabels.errors.genericErrorMessage
      });
      console.log(error);
    });
  }

  editItem(item): void {
    this.model = item;
    this.poundsConfig = {
      farm: {
        Name: item.Name,
        Id: item.Id
      },
      showActions: true
    };
    this.model = {...this.model};
    this.showTable = false;
    this.mode = 'edit';
  }

  createFarm(): void {
    this.model = {};
    this.form.reset();
    this.showTable = false;
    this.mode = 'add';
  }

  back(): void {
    this.showTable = true;
  }

  initForm(): void {
    this.fields = [{
      fieldGroupClassName: 'row',
      validators: {},
      fieldGroup: [
        {
          key: 'Name',
          type: 'input',
          className: 'col-md-12',
          templateOptions: {
            label: this.labels.name,
            placeholder: this.labels.namePh,
            required: true,
          }
        }
      ]
    }];
  }

  submitFarm() {
    if (this.validateForm()) {
      if (this.mode === 'add') {
        this.createFarmAction();
      } else {
        this.editFarmAction();
      }
    }
  }

  createFarmAction(): void {
    this.spinner.show(new SpinnerModel(this.globalLabels.spinner.loading));
    this.farmsService.createFarm({
      Name: this.model.Name
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

  editFarmAction(): void {
    this.spinner.show(new SpinnerModel(this.globalLabels.spinner.loading));
    this.farmsService.editFarm({
      Name: this.model.Name,
      id: this.model.Id
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
      this.loadFarms();
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

  validateForm(): boolean {
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(c => {
        if (this.form.controls[c].status === 'INVALID') {
          this.form.controls[c].markAsTouched();
        }
      });
      return false;
    }
    return true;
  }

}
