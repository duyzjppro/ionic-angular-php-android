import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.page.html',
  styleUrls: ['./doctor.page.scss'],
})
export class DoctorPage implements OnInit {
  doctors: any[] = [];
  isLoading = false;

  constructor(
    private doctorService: DoctorService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadDoctors();
  }

  async loadDoctors() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Loading doctors...'
    });
    await loading.present();

    this.doctorService.getAllDoctors().subscribe(
      async (response) => {
        await loading.dismiss();
        this.isLoading = false;
        if (response.success) {
          this.doctors = response.data;
        } else {
          this.showAlert('Error', response.message || 'Failed to load doctors.');
        }
      },
      async (error) => {
        await loading.dismiss();
        this.isLoading = false;
        console.error('Error fetching doctors:', error);
        this.showAlert('Error', 'An error occurred while loading doctors.');
      }
    );
  }
  async confirmDeleteDoctor(doctorId: number) {
    const alert = await this.alertController.create({
      header: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa bác sĩ này?',
      buttons: [
        {
          text: 'Hủy',
          role: 'cancel',
        },
        {
          text: 'Xóa',
          handler: () => {
            this.deleteDoctor(doctorId); // Gọi hàm xóa bác sĩ
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  async deleteDoctor(doctorId: number) {
    const loading = await this.loadingController.create({
      message: 'Đang xóa...',
    });
    await loading.present();
  
    this.doctorService.deleteDoctor(doctorId).subscribe({
      next: async (response) => {
        await loading.dismiss();
        if (response.success) {
          this.showAlert('Thành công', 'Bác sĩ đã được xóa.');
          this.loadDoctors(); // Tải lại danh sách bác sĩ
        } else {
          this.showAlert('Lỗi', response.message || 'Không thể xóa bác sĩ.');
        }
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Lỗi khi xóa bác sĩ:', error);
        this.showAlert('Lỗi', 'Đã xảy ra lỗi khi xóa bác sĩ.');
      },
    });
  }
  
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
  doRefresh(event) {
    this.doctorService.getAllDoctors().subscribe(
      (response) => {
        event.target.complete();
        if (response.success) {
          this.doctors = response.data;
        } else {
          this.showAlert('Thông báo', response.message || 'Không thể tải danh sách bác sĩ.');
        }
      },
      (error) => {
        event.target.complete();
        console.error('Error fetching doctors:', error);
        this.showAlert('Lỗi', 'Đã xảy ra lỗi khi tải danh sách bác sĩ.');
      }
    );
  }
}
