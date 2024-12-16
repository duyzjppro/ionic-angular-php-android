import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShiftsPageRoutingModule } from './shifts-routing.module';

import { ShiftsPage } from './shifts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShiftsPageRoutingModule
  ],
  declarations: [ShiftsPage]
})
export class ShiftsPageModule {}
