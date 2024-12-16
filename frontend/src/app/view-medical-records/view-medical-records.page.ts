import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MedicalRecordService } from '../services/medical-record.service';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-view-medical-records',
  templateUrl: './view-medical-records.page.html',
  styleUrls: ['./view-medical-records.page.scss'],
})
export class ViewMedicalRecordsPage implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  patientId: number;
  medicalRecords: any[] = [];
  selectedRecordId: number | null = null; 

  constructor(
    private medicalRecordService: MedicalRecordService,
    private authService: AuthService,
    private alertController: AlertController,
    private patientService: PatientService
  ) {}

  async ngOnInit() {
    await this.initializePatientData();
  }

  async initializePatientData() {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'patient') {
      try {
        this.patientId = await this.getPatientIdFromUserId(user.id);
        if (this.patientId) {
          this.loadMedicalRecords();
        }
      } catch (error) {
        console.error('Error fetching patient ID:', error);
        this.showAlert('Lỗi', 'Không thể tải thông tin bệnh nhân.');
      }
    }
  }

  getPatientIdFromUserId(userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.patientService.getPatientByUserId(userId).subscribe({
        next: (response: any) => {
          if (response && response.patient_id) {
            resolve(response.patient_id);
          } else {
            reject('No patient ID found');
          }
        },
        error: (error) => reject(error),
      });
    });
  }

  loadMedicalRecords() {
    this.medicalRecordService.getMedicalRecordsByPatientId(this.patientId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.medicalRecords = response.records;
        } else {
          this.showAlert('Lỗi', 'Không thể tải danh sách hồ sơ bệnh án.');
        }
      },
      error: () => {
        this.showAlert('Lỗi', 'Đã xảy ra lỗi khi tải hồ sơ bệnh án.');
      }
    });
  }

  openFilePicker(record: any) {
    this.selectedRecordId = record.id; 
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click(); 
    } else {
      console.error('File input element is not available.');
    }
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && this.selectedRecordId) { 
      const formData = new FormData();
      formData.append('patient_id', this.patientId.toString());
      formData.append('record_id', this.selectedRecordId.toString()); 
      formData.append('image', file);

      this.medicalRecordService.uploadMedicalRecord(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showAlert('Thành công', 'Hình ảnh đã được tải lên.');
            this.loadMedicalRecords(); 
          } else {
            this.showAlert('Lỗi', 'Không thể tải lên hình ảnh.');
          }
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.showAlert('Lỗi', 'Đã xảy ra lỗi khi tải lên hình ảnh.');
        }
      });
    } else {
      console.warn('No file selected or no record ID specified.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}
