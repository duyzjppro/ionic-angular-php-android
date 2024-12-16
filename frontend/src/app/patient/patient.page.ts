import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.page.html',
  styleUrls: ['./patient.page.scss'],
})
export class PatientPage implements OnInit {
  patients: any[] = [];
  isLoading = false;

  constructor(
    private patientService: PatientService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadPatients();
  }

  // Lấy danh sách bệnh nhân
  async loadPatients() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Loading patients...'
    });
    await loading.present();

    this.patientService.getAllPatients().subscribe(
      async (response) => {
        await loading.dismiss();
        this.isLoading = false;
        if (response.success) {
          this.patients = response.data;
        } else {
          this.showAlert('Error', response.message || 'Failed to load patients.');
        }
      },
      async (error) => {
        await loading.dismiss();
        this.isLoading = false;
        console.error('Error fetching patients:', error);
        this.showAlert('Error', 'An error occurred while loading patients.');
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
}
