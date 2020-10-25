import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appCellHost]'
})
export class DataCellDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
