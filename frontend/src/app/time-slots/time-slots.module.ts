import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeSlotsPageRoutingModule } from './time-slots-routing.module';

import { TimeSlotsPage } from './time-slots.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeSlotsPageRoutingModule
  ],
  declarations: [TimeSlotsPage]
})
export class TimeSlotsPageModule {}
