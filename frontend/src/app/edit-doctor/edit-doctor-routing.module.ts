import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDoctorPage } from './edit-doctor.page';

const routes: Routes = [
  {
    path: '',
    component: EditDoctorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDoctorPageRoutingModule {}
