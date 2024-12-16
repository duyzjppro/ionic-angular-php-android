import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicalRecordsPageRoutingModule } from './medical-records-routing.module';

import { MedicalRecordsPage } from './medical-records.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicalRecordsPageRoutingModule
  ],
  declarations: [MedicalRecordsPage]
})
export class MedicalRecordsPageModule {}
