import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoundsComponent } from './pounds.component';
import { PoundsService } from '../pounds.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpinnerModule } from '../../spinner';
import { DialogModule } from '../../dialog';
import { of } from 'rxjs';

describe('PoundsComponent', () => {

  let httpClientSpy: { get: jasmine.Spy, delete: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy };
  let poundService: PoundsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        TranslateModule.forRoot({
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
      declarations: [PoundsComponent],
      providers: [PoundsService, {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}}, TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'delete', 'post', 'put']);
    poundService = new PoundsService(httpClientSpy as any);
  });

  it('should return pound by id', () => {
    const expectedResult =
      {
        error: false,
        code: 200,
        message: 'OK',
        data: {
          pounds: [
            {
              Id: 9,
              Name: 'TEST',
              Size: 198.98
            }
          ],
          size: 16.44
        }
      };

    httpClientSpy.get.and.returnValue(of(expectedResult));
    poundService.getPounds('pounds/22').subscribe(
      data => {
        expect(data.pounds).toEqual(expectedResult.data.pounds, 'expected pound');
      },
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should delete pound by id', () => {
    const expectedResult =
      {
        error: false,
        code: 200,
        message: 'OK',
        data: {
          affectedRows: 1
        }
      };
    httpClientSpy.delete.and.returnValue(of(expectedResult));
    poundService.deletePound('deletePound/1').subscribe(
      data => {
        expect(data.affectedRows).toEqual(expectedResult.data.affectedRows, 'expected farms');
      },
      fail
    );
    expect(httpClientSpy.delete.calls.count()).toBe(1, 'one call');
  });

  it('should create pound using farm id', () => {
    const expectedResult =
      {
        error: false,
        code: 200,
        message: 'OK',
        data: {}
      };
    httpClientSpy.post.and.returnValue(of(expectedResult));
    poundService.createPound({Name: 'test', Size: 20, Id: 1}).subscribe(
      data => {
        expect(data.status).toEqual('OK', 'expected farms');
      },
      fail
    );
    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
  });

  it('should edit pound by id', () => {
    const expectedResult =
      {
        error: false,
        code: 200,
        message: 'OK',
        data: {
          affectedRows: 1
        }
      };
    httpClientSpy.put.and.returnValue(of(expectedResult));
    poundService.editPound({Name: 'test', Size: 20, Id: 1}).subscribe(
      data => {
        expect(data.status).toEqual('OK', 'expected farms');
      },
      fail
    );
    expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
  });
});
