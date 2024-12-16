import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateDoctorPage } from './create-doctor.page';

const routes: Routes = [
  {
    path: '',
    component: CreateDoctorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateDoctorPageRoutingModule {}
