import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoundsFormDialogComponent } from './poundsFormDialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpinnerModule } from '../../spinner';

describe('PoundsFormComponent', () => {
  let component: PoundsFormDialogComponent;
  let fixture: ComponentFixture<PoundsFormDialogComponent>;

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
      })],
      declarations: [PoundsFormDialogComponent],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}}, TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoundsFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
