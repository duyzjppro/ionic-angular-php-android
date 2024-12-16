import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateAppointmentPage } from './create-appointment.page';

const routes: Routes = [
  {
    path: '',
    component: CreateAppointmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateAppointmentPageRoutingModule {}
