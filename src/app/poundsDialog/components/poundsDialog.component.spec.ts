import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoundsDialogComponent } from './poundsDialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpinnerModule } from '../../spinner';
import { DialogModule } from '../../dialog';

describe('poundsDialogComponent', () => {
  let component: PoundsDialogComponent;
  let fixture: ComponentFixture<PoundsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }
      }), SpinnerModule.forRoot({
        type: 'ball-spin',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white'
      }), DialogModule],
      declarations: [PoundsDialogComponent],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}}, TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoundsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
