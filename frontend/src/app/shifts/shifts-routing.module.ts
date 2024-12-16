import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShiftsPage } from './shifts.page';

const routes: Routes = [
  {
    path: '',
    component: ShiftsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShiftsPageRoutingModule {}
