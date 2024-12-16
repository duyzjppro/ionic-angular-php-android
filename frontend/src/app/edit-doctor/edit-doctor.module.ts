import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDoctorPageRoutingModule } from './edit-doctor-routing.module';

import { EditDoctorPage } from './edit-doctor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDoctorPageRoutingModule
  ],
  declarations: [EditDoctorPage]
})
export class EditDoctorPageModule {}
