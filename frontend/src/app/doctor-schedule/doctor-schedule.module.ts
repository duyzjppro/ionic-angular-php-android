import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorSchedulePageRoutingModule } from './doctor-schedule-routing.module';

import { DoctorSchedulePage } from './doctor-schedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorSchedulePageRoutingModule
  ],
  declarations: [DoctorSchedulePage]
})
export class DoctorSchedulePageModule {}
