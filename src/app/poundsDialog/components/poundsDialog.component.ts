import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PoundsConfig } from '../../pounds/models/pounds.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pounds-dialog',
  templateUrl: './poundsDialog.component.html',
  styleUrls: ['./poundsDialog.component.scss']
})
export class PoundsDialogComponent implements OnInit {

  params: PoundsConfig;
  showDetails = false;
  globalLabels: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private translate: TranslateService,
              public dialogRef: MatDialogRef<PoundsDialogComponent>) {
  }

  ngOnInit(): void {
    this.loadLabels();
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
    this.translate.get(['global']).subscribe(labels => {
      this.globalLabels = labels.global;
    });
  }

  back(): void {
    this.dialogRef.close();
  }
}
