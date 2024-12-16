import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../services/clinic.service';
import { TimeSlotService } from '../services/time-slot.service';
import { AppointmentService } from '../services/appointment.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { PatientService } from '../services/patient.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
  clinics: any[] = [];
  selectedDate: string;
  patientId: number;

  constructor(
    private clinicService: ClinicService,
    private timeSlotService: TimeSlotService,
    private appointmentService: AppointmentService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private patientService: PatientService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadPatientInfo();
  }

  async loadClinicsAndTimeSlots() {
    if (this.selectedDate) {
      const loading = await this.loadingController.create({
        message: 'Loading Clinics and Time Slots...',
      });
      await loading.present();

      // Fetch clinics for the selected date
      this.clinicService.getClinicsByDate(this.selectedDate).subscribe(
        async (clinicResponse: any) => {
          if (clinicResponse.success) {
            this.clinics = clinicResponse.clinics;

            // Fetch time slots for each clinic
            this.clinics.forEach((clinic) => {
              this.timeSlotService.getTimeSlotsByDate(this.selectedDate).subscribe(
                (timeSlotResponse: any) => {
                  clinic.timeSlots = timeSlotResponse.timeSlots;

                  // check time has been book
                  this.appointmentService.getAppointmentsByClinicAndDate(clinic.id, this.selectedDate).subscribe(
                    (appointmentResponse: any) => {
                      if (appointmentResponse.success) {
                        const bookedTimeSlots = appointmentResponse.bookedTimeSlots;

                        // hiden time has been book
                        clinic.timeSlots = clinic.timeSlots.map((slot) => ({
                          ...slot,
                          available: !bookedTimeSlots.includes(slot.id),
                        }));
                      }
                    }
                  );
                },
                async (error) => {
                  await this.presentAlert('Error loading time slots.');
                }
              );
            });
          } else {
            await this.presentAlert('Error loading clinics.');
          }

          await loading.dismiss();
        },
        async (error) => {
          await this.presentAlert('Error loading clinics.');
          await loading.dismiss();
        }
      );
    }
  }

  async bookTimeSlot(clinicId: number, timeSlotId: number) {
    const appointmentData = {
      patient_id: this.patientId,
      clinic_id: clinicId,
      time_slot_id: timeSlotId,
      appointment_date: this.selectedDate,
    };

    this.appointmentService.createAppointment(appointmentData).subscribe(
      async (response: any) => {
        if (response.success) {
          await this.presentAlert('Appointment booked successfully!');
          location.reload();
        } else {
          await this.presentAlert(response.error || 'Error booking appointment.');
        }
      },
      async (error) => {
        await this.presentAlert('Error booking appointment.');
      }
    );
  }

  async loadPatientInfo() {
    const user = this.authService.getCurrentUser();

    if (user && user.id) {
      if (user.role === 'patient') {
        this.patientService.getPatientByUserId(user.id).subscribe(
          (response: any) => {
            if (response.patient_id) {
              this.patientId = response.patient_id;
            } else {
              this.presentAlert(response.error || 'Failed to load patient info');
            }
          },
          (error) => {
            this.presentAlert('Error fetching patient data.');
          }
        );
      } else {
        this.presentAlert('Access restricted to patients only.');
        this.navCtrl.navigateRoot('/login');
      }
    } else {
      this.presentAlert('User not found. Please log in.');
      this.navCtrl.navigateRoot('/login');
    }
  }
  booking() {
    this.navCtrl.navigateRoot('/home');

  }
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
