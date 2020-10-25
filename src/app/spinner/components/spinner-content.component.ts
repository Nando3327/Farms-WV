import { Component, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-spinner-content',
  template: `<p style="font-size: 20px; color: white">{{text}}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerContentComponent implements OnDestroy {

  @Input() text: string;

  ngOnDestroy(): void {
    this.text = '';
  }

}
