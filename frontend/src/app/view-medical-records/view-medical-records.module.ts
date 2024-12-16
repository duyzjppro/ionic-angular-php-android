import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewMedicalRecordsPageRoutingModule } from './view-medical-records-routing.module';

import { ViewMedicalRecordsPage } from './view-medical-records.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewMedicalRecordsPageRoutingModule
  ],
  declarations: [ViewMedicalRecordsPage]
})
export class ViewMedicalRecordsPageModule {}
