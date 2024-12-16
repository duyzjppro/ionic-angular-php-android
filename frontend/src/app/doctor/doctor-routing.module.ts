import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoctorPage } from './doctor.page';
import { EditDoctorPage } from '../edit-doctor/edit-doctor.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorPage
  },
  { path: 'doctor', component: DoctorPage },
  { path: 'edit-doctor/:id', component: EditDoctorPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorPageRoutingModule {}
