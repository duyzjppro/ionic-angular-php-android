import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicalRecordsPage } from './medical-records.page';

const routes: Routes = [
  {
    path: '',
    component: MedicalRecordsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalRecordsPageRoutingModule {}
