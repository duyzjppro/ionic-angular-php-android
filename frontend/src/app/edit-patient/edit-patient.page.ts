import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.page.html',
  styleUrls: ['./edit-patient.page.scss'],
})
export class EditPatientPage implements OnInit {
  patient: any = {};
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.loadPatientDetails(patientId);
    }
  }

  async loadPatientDetails(id: string) {
    const loading = await this.loadingController.create({
      message: 'Loading patient details...'
    });
    await loading.present();

    this.patientService.getPatientById(id).subscribe(
      async (response) => {
        await loading.dismiss();
        if (response.success) {
          this.patient = response.data;
        } else {
          this.showAlert('Error', response.message || 'Failed to load patient details.');
        }
      },
      async (error) => {
        await loading.dismiss();
        console.error('Error fetching patient details:', error);
        this.showAlert('Error', 'An error occurred while loading patient details.');
      }
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.patient.image_url = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async updatePatient() {
    const loading = await this.loadingController.create({
      message: 'Updating patient details...'
    });
    await loading.present();

    const formData = new FormData();
    formData.append('id', this.patient.id);
    formData.append('name', this.patient.name);
    formData.append('age', this.patient.age);
    formData.append('gender', this.patient.gender);
    formData.append('phone', this.patient.phone);
    formData.append('city', this.patient.city);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.patientService.updatePatient(formData).subscribe(
      async (response) => {
        await loading.dismiss();
        if (response.success) {
          this.showAlert('Success', 'Patient details updated successfully.');
          this.navCtrl.navigateForward('/admin/patient');
        } else {
          this.showAlert('Error', response.message || 'Failed to update patient details.');
        }
      },
      async (error) => {
        await loading.dismiss();
        console.error('Error updating patient:', error);
        this.showAlert('Error', 'An error occurred while updating patient details.');
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
