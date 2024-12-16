import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClinicsPageRoutingModule } from './clinics-routing.module';

import { ClinicsPage } from './clinics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClinicsPageRoutingModule
  ],
  declarations: [ClinicsPage]
})
export class ClinicsPageModule {}
