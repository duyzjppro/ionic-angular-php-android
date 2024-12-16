import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.page.html',
  styleUrls: ['./edit-doctor.page.scss'],
})
export class EditDoctorPage implements OnInit {
  doctor: any = {};
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private sanitizer: DomSanitizer,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      this.loadDoctorDetails(doctorId);
    }
  }

  async loadDoctorDetails(id: string) {
    const loading = await this.loadingController.create({
      message: 'Loading doctor details...'
    });
    await loading.present();

    this.doctorService.getDoctorById(id).subscribe(
      async (response) => {
        await loading.dismiss();
        if (response.success) {
          this.doctor = response.data;
        } else {
          this.showAlert('Error', response.message || 'Failed to load doctor details.');
        }
      },
      async (error) => {
        await loading.dismiss();
        console.error('Error fetching doctor details:', error);
        this.showAlert('Error', 'An error occurred while loading doctor details.');
      }
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.doctor.image_url = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }




  async updatePatient() {
    const loading = await this.loadingController.create({
      message: 'Updating doctor details...'
    });
    await loading.present();

    const formData = new FormData();
    formData.append('id', this.doctor.id);
    formData.append('name', this.doctor.name);
    formData.append('specialty', this.doctor.specialty);
    formData.append('phone', this.doctor.phone);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.doctorService.updateDoctor(formData).subscribe(
      async (response) => {
        await loading.dismiss();
        if (response.success) {
          this.showAlert('Success', 'Doctor details updated successfully.');
          this.navCtrl.navigateForward('/admin/doctor');

        } else {
          this.showAlert('Error', response.message || 'Failed to update doctor details.');
        }
      },
      async (error) => {
        await loading.dismiss();
        console.error('Error updating doctor:', error);
        this.showAlert('Error', 'An error occurred while updating doctor details.');
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
