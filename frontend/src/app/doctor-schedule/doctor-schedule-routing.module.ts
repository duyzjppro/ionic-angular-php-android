import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoctorSchedulePage } from './doctor-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorSchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorSchedulePageRoutingModule {}
