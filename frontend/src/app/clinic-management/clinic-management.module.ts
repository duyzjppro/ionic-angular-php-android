import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClinicManagementPageRoutingModule } from './clinic-management-routing.module';

import { ClinicManagementPage } from './clinic-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClinicManagementPageRoutingModule
  ],
  declarations: [ClinicManagementPage]
})
export class ClinicManagementPageModule {}
