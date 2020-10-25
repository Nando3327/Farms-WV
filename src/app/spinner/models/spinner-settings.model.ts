import {Size} from 'ngx-spinner/lib/ngx-spinner.enum';

export class SpinnerSettingsModel {

  constructor(
    public type: string = 'ball-spin',
    public size: Size = 'medium',
    public bdColor: string = 'rgba(0, 63, 126, 0.7)',
    public color: string = 'white',
  ) {
  }
}
