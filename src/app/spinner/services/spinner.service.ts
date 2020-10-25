import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { SpinnerContentComponent } from '../components/spinner-content.component';
import { SpinnerModel, SpinnerSettingsModel } from '../models';
import { isNullOrEmpty } from '../../general-functions/general-functions';


@Injectable(
  {
    providedIn: 'root',
  }
)
export class SpinnerService {

  spinnerComponentRef: ComponentRef<NgxSpinnerComponent>;
  contentComponentRef: ComponentRef<SpinnerContentComponent>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private spinnerSettings: SpinnerSettingsModel,
              private ngxSpinnerService: NgxSpinnerService) {
  }

  private appendSpinnerComponentToBody(model: SpinnerModel) {
    if (!model) {
      model = new SpinnerModel('');
    }

    // Component Factories
    const contentComponentFactory = this.componentFactoryResolver.resolveComponentFactory(SpinnerContentComponent);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NgxSpinnerComponent);

    // Component references
    let contentComponentRef: ComponentRef<SpinnerContentComponent>;
    let componentRef: ComponentRef<NgxSpinnerComponent>;

    contentComponentRef = contentComponentFactory.create(this.injector);
    this.appRef.attachView(contentComponentRef.hostView);

    componentRef = componentFactory.create(this.injector, [
      [contentComponentRef.location.nativeElement]
    ]);

    this.appRef.attachView(componentRef.hostView);
    // }
    // Fill Inputs
    contentComponentRef.instance.text = model.text;
    // When spinner is loaded withpu container
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    if (!model.container) {

      document.body.appendChild(domElem);
    } else {
      model.container.element.nativeElement.appendChild(domElem);
    }

    // Map to dispose dynamic references
    this.spinnerComponentRef = componentRef;
    this.contentComponentRef = contentComponentRef;
  }

  private removeSpinnerComponentFromBody() {
    if (this.spinnerComponentRef) {
      this.appRef.detachView(this.spinnerComponentRef.hostView);
      this.spinnerComponentRef.destroy();
    }

    if (this.contentComponentRef) {
      this.appRef.detachView(this.contentComponentRef.hostView);
      this.contentComponentRef.destroy();
    }
  }

  public show(model: SpinnerModel): void {
    this.appendSpinnerComponentToBody(model);
    if (isNullOrEmpty(this.spinnerSettings)) {
      this.spinnerSettings = new SpinnerSettingsModel('ball-spin',
        'medium',
        'rgba(50, 105, 62, 0.7)',
        'white');
    }
    this.ngxSpinnerService.show(undefined,
      {
        type: this.spinnerSettings.type,
        size: this.spinnerSettings.size,
        bdColor: this.spinnerSettings.bdColor,
        color: this.spinnerSettings.color
      });
  }

  public hide(): void {
    this.ngxSpinnerService.hide();
    this.removeSpinnerComponentFromBody();
  }
}
