import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateDoctorPageRoutingModule } from './create-doctor-routing.module';

import { CreateDoctorPage } from './create-doctor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateDoctorPageRoutingModule
  ],
  declarations: [CreateDoctorPage]
})
export class CreateDoctorPageModule {}
