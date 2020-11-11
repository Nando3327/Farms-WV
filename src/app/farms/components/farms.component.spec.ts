import { async, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FarmsComponent } from './farms.component';
import { FarmsService } from '../farms.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerModule } from '../../spinner';
import { DialogModule } from '../../dialog';
import { of } from 'rxjs';


describe('FarmsComponent', () => {

  let httpClientSpy: { get: jasmine.Spy, delete: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy };
  let farmsService: FarmsService;

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
      declarations: [FarmsComponent],
      providers: [FarmsService, {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}}, TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'delete', 'post', 'put']);
    farmsService = new FarmsService(httpClientSpy as any);
  });

  it('should have as data empty', () => {
    const fixture = TestBed.createComponent(FarmsComponent);
    const app = fixture.componentInstance;
    expect(app.data.length).toEqual(0);
  });

  it('should return farms', () => {
    const expectedResult =
      {
        error: false,
        code: 200,
        message: 'OK',
        data: {
          farms: [
            {
              Id: 9,
              Name: 'TEST'
            }
          ]
        }
      };
    httpClientSpy.get.and.returnValue(of(expectedResult));
    farmsService.getFarms('farms').subscribe(
      farms => {
        expect(farms).toEqual(expectedResult.data.farms, 'expected farms');
      },
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should return pound by farm id', () => {
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
    farmsService.getPounds('pounds/22').subscribe(
      data => {
        expect(data.pounds).toEqual(expectedResult.data.pounds, 'expected pound');
      },
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should return farm size by farm id', () => {
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
    farmsService.getPounds('pounds/22').subscribe(
      data => {
        expect(data.size).toEqual(expectedResult.data.size, 'expected farm size');
      },
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should delete farm by id', () => {
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
    farmsService.deleteFarm('deleteFarm/1').subscribe(
      data => {
        expect(data.affectedRows).toEqual(expectedResult.data.affectedRows, 'expected farms');
      },
      fail
    );
    expect(httpClientSpy.delete.calls.count()).toBe(1, 'one call');
  });

  it('should create farm', () => {
    const expectedResult =
      {
        error: false,
        code: 200,
        message: 'OK',
        data: {}
      };
    httpClientSpy.post.and.returnValue(of(expectedResult));
    farmsService.createFarm({Name: 'test'}).subscribe(
      data => {
        expect(data.status).toEqual('OK', 'expected farms');
      },
      fail
    );
    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
  });

  it('should edit farm by id', () => {
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
    farmsService.editFarm({Name: 'test', id: 1}).subscribe(
      data => {
        expect(data.status).toEqual('OK', 'expected farms');
      },
      fail
    );
    expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
  });
});
