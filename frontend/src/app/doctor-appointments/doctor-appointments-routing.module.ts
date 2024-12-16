import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoctorAppointmentsPage } from './doctor-appointments.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorAppointmentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorAppointmentsPageRoutingModule {}
