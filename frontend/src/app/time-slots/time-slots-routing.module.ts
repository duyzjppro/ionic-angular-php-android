import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeSlotsPage } from './time-slots.page';

const routes: Routes = [
  {
    path: '',
    component: TimeSlotsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeSlotsPageRoutingModule {}
