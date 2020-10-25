import { Component, Input, OnInit } from '@angular/core';
import { DataCellInterface } from '../data-cell.interface';
import { DataColumnModel } from '../../data-column/data-column.model';
import { isFunction } from 'util';
import { DataCellService } from '../data-cell.service';

@Component({
  selector: 'app-data-actions-cell',
  template: `
      <button *ngFor="let button of actions; let i = index"
              mat-icon-button [color]="i === 0 ? 'primary' : 'warn'" [matTooltip]="button.tooltip" (click)="handleButtonsClick(button.handler)" [hidden]="button.hidden">
          <mat-icon>{{button.icon}}</mat-icon>
      </button>

      <button *ngIf="moreActions.length > 0" mat-icon-button [matMenuTriggerFor]="menu" matTooltip="More actions">
          <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
          <button *ngFor="let moreButton of moreActions"
                  mat-menu-item (click)="handleButtonsClick(moreButton.handler)">
              <mat-icon>{{moreButton.icon}}</mat-icon>
              <span>{{moreButton.name}}</span>
          </button>
      </mat-menu>`
})
export class DataCellActionsComponent implements DataCellInterface, OnInit {
  @Input() column: DataColumnModel;
  @Input() row: object;
  @Input() mode: string;

  actions: Array<DataCellButtonAction>;
  moreActions: Array<DataCellButtonAction>;

  constructor(
    private dataCellService: DataCellService
  ) {}

  ngOnInit(): void {
    this.actions = this.column.options.buttons.slice(0, 2);
    this.moreActions = this.column.options.buttons.slice(2, this.column.options.buttons.length);
  }

  handleButtonsClick(func: any) {
    if (func && isFunction(func)) {
      if (this.mode === 'detail') this.dataCellService.sendResult(true);
      func(this.row);
    } else {
      throw Error('No handler for column: ' + this.column.field);
    }
  }
}

export class DataCellButtonAction {
  name?: string;
  tooltip: string;
  icon: string;
  hidden: string;
  handler: () => any;
}
