import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NotificationBoxComponent } from './notification-box.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [NotificationBoxComponent],
  exports: [NotificationBoxComponent]
})
export class NotificationBoxModule {}
