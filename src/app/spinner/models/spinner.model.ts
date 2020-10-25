import { ViewContainerRef } from '@angular/core';

export class SpinnerModel {

  constructor(
    public text: string = 'Cargando...',
    public container: ViewContainerRef = null,
  ) {
  }
}
