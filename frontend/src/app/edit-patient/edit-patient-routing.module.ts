import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPatientPage } from './edit-patient.page';

const routes: Routes = [
  {
    path: '',
    component: EditPatientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPatientPageRoutingModule {}
