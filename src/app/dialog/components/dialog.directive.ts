import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDialogHost]'
})
export class DialogDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
