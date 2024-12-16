import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { DoctorPageRoutingModule } from './doctor-routing.module';

import { DoctorPage } from './doctor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    DoctorPageRoutingModule
  ],
  declarations: [DoctorPage]
})
export class DoctorPageModule {}
