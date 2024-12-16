import { PatientService } from './../services/patient.service';
import { Component, OnInit } from '@angular/core';
import { MedicalRecordService } from '../services/medical-record.service';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medical-records',
  templateUrl: './medical-records.page.html',
  styleUrls: ['./medical-records.page.scss'],
})
export class MedicalRecordsPage implements OnInit {
  patientId: number | null = null;  // Allow for cases where patientId may not be set
  patientRecordCode: string = '';
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private medicalRecordService: MedicalRecordService,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private patientService: PatientService,
    private route: ActivatedRoute // Import ActivatedRoute to read route params
  ) {}

  async ngOnInit() {
    // Check if patientId is provided as a route parameter
    const routePatientId = this.route.snapshot.paramMap.get('patientId');
    if (routePatientId) {
      this.patientId = +routePatientId;
    } else {
      // If no patientId in route, load it from the current user
      await this.loadPatientId();
    }
  }

  async loadPatientId() {
    const user = this.authService.getCurrentUser();
    if (user && user.id && user.role === 'patient') {
      try {
        this.patientId = await this.getPatientIdFromUserId(user.id);
      } catch (error) {
        console.error('Error loading patient ID:', error);
        this.showAlert('Lỗi', 'Không thể xác định ID bệnh nhân.');
      }
    } else {
      this.showAlert('Lỗi', 'Không tìm thấy thông tin người dùng.');
    }
  }

  async getPatientIdFromUserId(userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.patientService.getPatientByUserId(userId).subscribe({
        next: (response: any) => {
          if (response && response.patient_id) {
            resolve(response.patient_id);
          } else {
            reject('No patient ID found for user');
          }
        },
        error: (error) => reject(error),
      });
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    } else {
      this.showAlert('Lỗi', 'File không hợp lệ hoặc vượt quá 5MB.');
    }
  }

  async uploadMedicalRecord() {
    // Ensure that patientId is available
    if (!this.patientId) {
      this.showAlert('Lỗi', 'Không tìm thấy ID bệnh nhân.');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Đang tải lên...' });
    await loading.present();

    const formData = new FormData();
    formData.append('patient_id', this.patientId.toString());
    formData.append('patient_record_code', this.patientRecordCode);
    if (this.selectedFile) {
      formData.append('record_image', this.selectedFile);
    }

    this.medicalRecordService.createmedical(formData).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.showAlert('Thành công', 'Tải lên hồ sơ bệnh án thành công!');
        } else {
          this.showAlert('Lỗi', 'Không thể tải lên hồ sơ.');
        }
      },
      error: async () => {
        await loading.dismiss();
        this.showAlert('Lỗi', 'Đã xảy ra lỗi khi tải lên.');
      }
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}
