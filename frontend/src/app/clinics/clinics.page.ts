import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../services/clinic.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.page.html',
  styleUrls: ['./clinics.page.scss'],
})
export class ClinicsPage implements OnInit {
  clinics: any[] = [];
  selectedDate: string;
  newClinicName: string;

  constructor(
    private clinicService: ClinicService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  loadClinics() {
    if (this.selectedDate) {
      this.clinicService.getClinicsByDate(this.selectedDate).subscribe(
        (response: any) => {
          if (response.success) {
            this.clinics = response.clinics; // Updated 
          } else {
            this.presentAlert('Failed to load clinics');
          }
        },
        (error) => {
          console.error('Failed to load clinics:', error);
          this.presentAlert('Failed to load clinics');
        }
      );
    }
  }

  createClinic() {
    if (this.newClinicName && this.selectedDate) {
      const clinic = {
        name: this.newClinicName,
        creation_date: this.selectedDate
      };

      this.clinicService.addClinic(clinic).subscribe(
        (response: any) => {
          if (response.success) {
            this.presentAlert('Clinic created successfully');
            this.newClinicName = ''; 
            this.loadClinics(); // Reload 
          } else {
            this.presentAlert('Failed to create clinic');
          }
        },
        (error) => {
          console.error('Failed to create clinic:', error);
          this.presentAlert('Failed to create clinic');
        }
      );
    } else {
      this.presentAlert('Please enter a clinic name and select a date');
    }
  }
  deleteClinic(id: number) {
    this.clinicService.deleteClinic(id).subscribe(
      (response: any) => {
        if (response.success) {
          this.presentAlert('Clinic deleted successfully');
          this.loadClinics(); // Tải lại danh sách phòng khám sau khi xóa thành công
        } else {
          this.presentAlert('Failed to delete clinic');
        }
      },
      (error) => {
        console.error('Failed to delete clinic:', error);
        this.presentAlert('Failed to delete clinic');
      }
    );
  }
updateClinic(id: number) {
  if (this.newClinicName && this.selectedDate) {
    const clinic = {
      name: this.newClinicName,
      creation_date: this.selectedDate,
    };

    this.clinicService.updateClinic(id, clinic).subscribe(
      (response: any) => {
        if (response.success) {
          this.presentAlert('Clinic updated successfully');
          this.loadClinics(); // Tải lại danh sách phòng khám sau khi cập nhật
        } else {
          this.presentAlert('Failed to update clinic');
        }
      },
      (error) => {
        console.error('Failed to update clinic:', error);
        this.presentAlert('Failed to update clinic');
      }
    );
  } else {
    this.presentAlert('Please enter a clinic name and select a date');
  }
}

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
