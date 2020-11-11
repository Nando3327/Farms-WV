import { Farm } from '../../farms/models/farms.model';

export class Pounds {
  Id: number;
  Name: string;
  Size: number;
}

export class PoundsConfig {
  farm: Farm;
  showActions: boolean;
}

export class PoundsSearch {
  pounds: Array<Pounds>;
  size: number;
}
