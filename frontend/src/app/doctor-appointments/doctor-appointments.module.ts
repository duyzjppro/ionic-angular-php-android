import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorAppointmentsPageRoutingModule } from './doctor-appointments-routing.module';

import { DoctorAppointmentsPage } from './doctor-appointments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorAppointmentsPageRoutingModule
  ],
  declarations: [DoctorAppointmentsPage]
})
export class DoctorAppointmentsPageModule {}
