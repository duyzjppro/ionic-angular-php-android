import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePatientPageRoutingModule } from './profile-patient-routing.module';

import { ProfilePatientPage } from './profile-patient.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePatientPageRoutingModule
  ],
  declarations: [ProfilePatientPage]
})
export class ProfilePatientPageModule {}
