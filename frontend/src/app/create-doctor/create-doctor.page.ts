import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DoctorService } from '../services/doctor.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-doctor',
  templateUrl: './create-doctor.page.html',
  styleUrls: ['./create-doctor.page.scss'],
})
export class CreateDoctorPage implements OnInit {

  basicInfoForm: FormGroup;
  users: any[] = [];
  userid: string;
  name: string;
  specialty: string;
  phone: string;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async loadUsers() {
    const loading = await this.loadingCtrl.create({
      message: 'Đang tải người dùng...',
    });
    await loading.present();

    this.userService.getAllUsersDoctor().subscribe(
      (response: any) => {
        loading.dismiss();
        if (response.success) {
          this.users = response.data;
        } else {
          this.showAlert('Lỗi', 'Không thể tải danh sách người dùng.');
          console.log('Lỗi khi tải người dùng:', response.error);
        }
      },
      (error) => {
        loading.dismiss();
        this.showAlert('Lỗi', 'Đã xảy ra lỗi khi tải danh sách người dùng.');
        console.error('Lỗi:', error);
      }
    );
  }

  async addDoctor() {
    const loading = await this.loadingCtrl.create({
      message: 'Đang thêm bác sĩ...',
    });
    await loading.present();
  
    const formData = new FormData();
    formData.append('user_id', this.userid);
    formData.append('name', this.name);
    formData.append('specialty', this.specialty);
    formData.append('phone', this.phone);
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
  
    this.doctorService.addDoctor(formData).subscribe(
      async (response: any) => {
        await loading.dismiss();
        if (response?.success) {
          this.showAlert('Thành công', 'Bác sĩ đã được thêm thành công!');
        } else {
          this.showAlert('Lỗi', 'Không thể thêm bác sĩ.');
          console.log('Error adding doctor:', response?.message || 'Unknown error');
        }
      },
      async (error) => {
        await loading.dismiss();
        this.showAlert('Lỗi', 'Đã xảy ra lỗi khi thêm bác sĩ.');
        console.error('HTTP Error:', error);
      }
    );
  }
  
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  onCancel() {
    // Xử lý khi hủy bỏ form
  }

  onSubmit() {
    this.addDoctor();
  }
}
