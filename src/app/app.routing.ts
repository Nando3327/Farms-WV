// angular
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { FarmsComponent } from './farms/components';


const routes: Route[] = [
  {
    path: 'home',
    component: FarmsComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./farms/farms.module').then(m => m.FarmsModule)
      },
    ]
  },
  {
    path: '',
    component: FarmsComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
