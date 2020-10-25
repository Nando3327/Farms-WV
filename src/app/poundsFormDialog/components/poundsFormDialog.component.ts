import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PoundsConfig } from '../../pounds/models/pounds.model';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private translate: TranslateService,
              public dialogRef: MatDialogRef<PoundsFormDialogComponent>) {
  }

  ngOnInit(): void {
    this.loadLabels();
    this.model = (this.data && this.data.mode === 'edit') ? {...this.data.model} : {};
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
                  const decimalSize = this.form.value.Size.toString().split('.')[1].length;
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

  submitPound() {
    if (this.validateForm()) {
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
