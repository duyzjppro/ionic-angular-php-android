import { Component } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile-patient',
  templateUrl: './profile-patient.page.html',
  styleUrls: ['./profile-patient.page.scss'],
})
export class ProfilePatientPage {
  name: string;
  age: string;
  gender: string;
  phone: string;
  city: string;
  selectedFile: File | null = null;
  user_id: number;
  imageUrl: string | null = null;

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.user_id = currentUser.id;
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Xử lý khi người dùng chọn hình ảnh
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.type)) {
        this.selectedFile = file;
        // Tạo URL tạm thời để preview ảnh
        this.imageUrl = URL.createObjectURL(file);
      } else {
        this.showAlert('Lỗi', 'Vui lòng chọn file hình ảnh (JPEG, PNG, hoặc GIF).');
        event.target.value = null;
      }
    }
  }

  // Tạo hồ sơ bệnh nhân và upload hình ảnh
  async createPatientProfile() {
    if (!this.validateForm()) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Đang tạo hồ sơ bệnh nhân...',
    });
    await loading.present();

    const formData = new FormData();
    formData.append('user_id', this.user_id.toString());
    formData.append('name', this.name);
    formData.append('age', this.age);
    formData.append('gender', this.gender);
    formData.append('phone', this.phone);
    formData.append('city', this.city);
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.patientService.createPatientProfile(formData).subscribe(
      async (response) => {
        await loading.dismiss();
        if (response.success) {
          this.imageUrl = response.image_url; // Lưu đường dẫn hình ảnh từ server
          this.showAlert('Thành công', 'Hồ sơ bệnh nhân đã được tạo.');
          this.router.navigate(['/home']);
        } else {
          this.showAlert('Lỗi', response.message || 'Không thể tạo hồ sơ bệnh nhân.');
        }
      },
      async (error) => {
        await loading.dismiss();
        this.showAlert('Lỗi', 'Đã xảy ra lỗi khi tạo hồ sơ bệnh nhân.');
      }
    );
  }

  validateForm(): boolean {
    if (!this.name || !this.age || !this.gender || !this.phone || !this.city) {
      this.showAlert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return false;
    }
    return true;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
