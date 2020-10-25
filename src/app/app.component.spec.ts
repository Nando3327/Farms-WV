import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerModule } from './spinner';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
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
      declarations: [
        AppComponent
      ],
      providers: [TranslateService]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'untitled'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('untitled');
  });
});
