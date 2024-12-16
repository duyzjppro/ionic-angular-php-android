import { Component } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { PatientService } from '../services/patient.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-manage-appointments',
  templateUrl: './manage-appointments.page.html',
  styleUrls: ['./manage-appointments.page.scss'],
})
export class ManageAppointmentsPage {
  appointments: any[] = [];
  patientId: number | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private modalController: ModalController,
    private authService: AuthService,
    private alertController: AlertController,
    private patientService: PatientService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadPatientInfo();
  }
// đây là code phương hướng phát triển khác, nhưng vài điểm bất lợi chưa được giải quyết triệt để.
  // Tải thông tin bệnh nhân từ AuthService và PatientService
  async loadPatientInfo() {
    const user = this.authService.getCurrentUser();

    if (user && user.id) {
      if (user.role === 'patient') {
        this.patientService.getPatientByUserId(user.id).subscribe(
          (response: any) => {
            if (response.patient_id) {
              this.patientId = response.patient_id;
              this.loadAppointmentsByPatientId();  // Load danh sách cuộc hẹn của bệnh nhân
            } else {
              console.error(response.error || 'Failed to load patient info');
            }
          },
          (error) => {
            console.error('Error fetching patient data:', error);
          }
        );
      } else {
        console.error('Access restricted to patients only.');
        this.navCtrl.navigateRoot('/login');
      }
    } else {
      console.error('User not found. Please log in.');
      this.navCtrl.navigateRoot('/login');
    }
  }

  // Tải danh sách cuộc hẹn của bệnh nhân dựa trên ID
  loadAppointmentsByPatientId() {
    if (this.patientId && this.patientId > 0) {
      this.appointmentService.getAppointmentsByPatientId(this.patientId).subscribe(
        (data: any) => {
          console.log('API Response:', data);
          if (data.success) {
            this.appointments = data.appointments.map((appointment: any) => {
              console.log('Loaded appointment:', appointment);  // Debugging
              return appointment;
            });
          } else {
            console.error('No appointments found.');
            this.appointments = [];
          }
        },
        (error) => {
          console.error('Error fetching appointments', error);
        }
      );
    } else {
      console.error('Invalid patient ID:', this.patientId);
    }
  }

  // Hủy cuộc hẹn
  async cancelAppointment(appointmentId: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Cancel',
      message: 'Are you sure you want to cancel this appointment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: () => {
            this.appointmentService.deleteAppointment(appointmentId).subscribe(
              async (response: any) => {
                if (response.success) {
                  await this.presentAlert('Appointment canceled successfully.');
                  this.loadAppointmentsByPatientId();  // Tải lại danh sách cuộc hẹn sau khi hủy
                } else {
                  await this.presentAlert(response.error || 'Failed to cancel appointment.');
                }
              },
              async (error) => {
                await this.presentAlert('Error canceling appointment.');
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  // Hiển thị thông báo cho người dùng
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Đóng modal
  dismissModal() {
    this.modalController.dismiss();
  }
}
