import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePatientPage } from './profile-patient.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePatientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePatientPageRoutingModule {}
