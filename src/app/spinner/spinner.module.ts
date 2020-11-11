import { ModuleWithProviders, NgModule } from '@angular/core';
import { SpinnerSettingsModel } from './models';
import { NgxSpinnerComponent, NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerContentComponent } from './components/spinner-content.component';
import { SpinnerService } from './services/spinner.service';


@NgModule({
  imports: [NgxSpinnerModule],
  declarations: [
    SpinnerContentComponent
  ],
  exports: [],
  entryComponents: [NgxSpinnerComponent, SpinnerContentComponent],
  providers: [SpinnerService]
})
export class SpinnerModule {
  constructor() {
  }

  static forRoot(settingModel: SpinnerSettingsModel): ModuleWithProviders {
    return ({
      ngModule: SpinnerModule,
      providers: [
        {provide: SpinnerSettingsModel, useValue: settingModel}
      ]
    });
  }
}
