import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageAppointmentsPage } from './manage-appointments.page';

const routes: Routes = [
  {
    path: '',
    component: ManageAppointmentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAppointmentsPageRoutingModule {}
