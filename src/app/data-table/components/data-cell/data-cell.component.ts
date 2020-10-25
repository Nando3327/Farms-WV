import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { DataCellDirective } from './data-cell.directive';
import { DataCellService } from './data-cell.service';
import { DataColumnModel } from '../data-column/data-column.model';

@Component({
  selector: 'app-data-cell',
  template: '<ng-template appCellHost></ng-template>'
})

export class DataCellComponent implements OnInit {
  @ViewChild(DataCellDirective, { static: true }) cellHost: DataCellDirective;
  @Input() column: DataColumnModel;
  @Input() row: object;
  @Input() mode: string;

  constructor(
    private readonly cellService: DataCellService,
    private readonly componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
    this.initCell();
  }

  initCell() {
    const cellComponent = this.cellService.getCell(this.column.type);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(cellComponent);
    const viewContainerRef = this.cellHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const cell = componentRef.instance as DataCellComponent;
    cell.row = this.row;
    cell.column = this.column;
    cell.mode = this.mode;
  }
}
