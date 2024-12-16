import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClinicManagementPage } from './clinic-management.page';

const routes: Routes = [
  {
    path: '',
    component: ClinicManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicManagementPageRoutingModule {}
