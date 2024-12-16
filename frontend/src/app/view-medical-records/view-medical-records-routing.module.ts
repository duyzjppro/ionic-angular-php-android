import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewMedicalRecordsPage } from './view-medical-records.page';

const routes: Routes = [
  {
    path: '',
    component: ViewMedicalRecordsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewMedicalRecordsPageRoutingModule {}
