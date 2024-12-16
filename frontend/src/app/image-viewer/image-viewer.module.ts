import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImageViewerComponent } from './image-viewer.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,  // Đảm bảo rằng IonicModule được import ở đây
  ],
  declarations: [ImageViewerComponent],
  exports: [ImageViewerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Thêm CUSTOM_ELEMENTS_SCHEMA để hỗ trợ các thành phần web của Ionic
})
export class ImageViewerModule {}
