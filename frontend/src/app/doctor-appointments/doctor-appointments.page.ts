import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.page.html',
  styleUrls: ['./doctor-appointments.page.scss'],
})
export class DoctorAppointmentsPage implements OnInit {
  selectedDate: string;
  appointments: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // load date theo ngày hiện tại
    this.selectedDate = new Date().toISOString().split('T')[0]; 
    this.loadAppointments(this.selectedDate); 
  }

  loadAppointments(date: string) {
    this.selectedDate = date;
    this.appointmentService.getAppointmentsByDate(date).subscribe(
      (response: any) => {
        if (response.appointments) {
          this.appointments = response.appointments;
        } else if (response.error) {
          this.presentAlert(response.error);
        } else {
          this.presentAlert('Failed to load appointments');
        }
      },
      (error) => {
        console.error('Failed to load appointments:', error);
        this.presentAlert('Failed to load appointments');
      }
    );
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
