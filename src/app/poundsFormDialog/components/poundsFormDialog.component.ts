import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pounds, PoundsConfig } from '../../pounds/models/pounds.model';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { isNullOrEmpty } from '../../general-functions/general-functions';
import { DialogBuildService } from '../../dialog/components';

@Component({
  selector: 'app-pounds-form-dialog',
  templateUrl: './poundsFormDialog.component.html',
  styleUrls: ['./poundsFormDialog.component.scss']
})
export class PoundsFormDialogComponent implements OnInit {

  params: PoundsConfig;
  showDetails = false;
  globalLabels: any;
  labels: any;

  form = new FormGroup({});
  model: any;
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];

  items: Array<Pounds>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private translate: TranslateService,
              private dialog: DialogBuildService,
              public dialogRef: MatDialogRef<PoundsFormDialogComponent>) {
  }

  ngOnInit(): void {
    this.loadLabels();
    this.model = (this.data && this.data.mode === 'edit') ? {...this.data.model} : {};
    this.items = this.data.items;
    this.params = {
      farm: {
        Name: this.data.Name,
        Id: this.data.Id
      },
      showActions: false
    };
    setTimeout(_ => {
      this.showDetails = true;
    }, 200);
  }

  loadLabels(): void {
    this.translate.get(['pounds', 'global']).subscribe(labels => {
      this.globalLabels = labels.global;
      this.labels = labels.pounds;
      this.initForm();
    });
  }

  initForm(): void {
    this.fields = [{
      fieldGroupClassName: 'row',
      validators: {},
      fieldGroup: [
        {
          key: 'Name',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: this.labels.name,
            placeholder: this.labels.namePh,
            required: true,
          }
        }, {
          key: 'Size',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            type: 'number',
            label: this.labels.size,
            placeholder: this.labels.sizePh,
            min: 0,
            required: true,
            keypress: _ => {
              const valueToSet = this.form.value.Size;
              setTimeout(field => {
                console.log(field);
                if (this.form.value.Size.toString().indexOf('.')) {
                  // tslint:disable-next-line:max-line-length
                  const decimalSize = (this.form.value.Size.toString().split('.')[1]) ? this.form.value.Size.toString().split('.')[1].length : 0;
                  if (decimalSize > 2) {
                    this.form.controls.Size.setValue(valueToSet);
                  }
                }
              });
            }
          }
        }
      ]
    }];
  }

  showDialogDuplicateName(): void {
    this.dialog.buildDialog({
      message: this.labels.messages.duplicatedValue
    });
  }

  submitPound() {
    if (this.validateForm()) {
      if (this.items.length > 0) {
        const itemInArrayToSave = this.items.find(it => {
          return it.Name === this.model.Name.trim();
        });
        if (!isNullOrEmpty(itemInArrayToSave)) {
          if (this.data.mode === 'edit' && itemInArrayToSave.Id !== this.model.Id) {
            this.showDialogDuplicateName();
            return;
          } else if (this.data.mode !== 'edit') {
            this.showDialogDuplicateName();
            return;
          }
        }
      }
      this.dialogRef.close({
        model: this.model
      });
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


  back(): void {
    this.dialogRef.close();
  }
}
