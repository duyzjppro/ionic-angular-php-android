import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../services/clinic.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-clinic-management',
  templateUrl: './clinic-management.page.html',
  styleUrls: ['./clinic-management.page.scss'],
})
export class ClinicManagementPage implements OnInit {
  appointments: any[] = [];
  selectedDate: string;
  searchTerm: string = ''; // Biến để lưu từ khóa tìm kiếm

  constructor(
    private clinicService: ClinicService, // Đổi thành ClinicService
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  // Gọi API để load danh sách cuộc hẹn dựa theo ngày và tên phòng
  async loadAppointments() {
    if (this.selectedDate && this.searchTerm) {
      const loading = await this.loadingController.create({
        message: 'Loading Appointments...'
      });
      await loading.present();

      this.clinicService.getAppointments(this.selectedDate, this.searchTerm).subscribe(
        async (response: any) => {
          await loading.dismiss();
          if (response.success) {
            this.appointments = response.appointments;
          } else {
            this.presentAlert(response.error || 'Failed to load appointments.');
          }
        },
        async (error) => {
          await loading.dismiss();
          this.presentAlert('Error loading appointments.');
        }
      );
    }
  }

  // Hàm hiện thông báo lỗi
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
