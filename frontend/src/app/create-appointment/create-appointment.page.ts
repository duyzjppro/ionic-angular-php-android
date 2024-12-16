import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { PatientService } from '../services/patient.service';
import { ClinicService } from '../services/clinic.service';
import { TimeSlotService } from '../services/time-slot.service';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.page.html',
  styleUrls: ['./create-appointment.page.scss'],
})
export class CreateAppointmentPage implements OnInit {
  patients: any[] = [];
  clinics: any[] = [];
  isLoading = false;
  currentDate: string;
  timeSlots: any[] = [];
  newAppointment = {
    patient_id: null,
    clinic_id: null,
    time_slot_id: null,
    appointment_date: ''
  };

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private clinicService: ClinicService,
    private timeSlotService: TimeSlotService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadPatients();
    this.currentDate = new Date().toISOString();
    this.newAppointment.appointment_date = this.currentDate;
  }
  onDateChange(event: any) {
    this.currentDate = event.detail.value;
    console.log('Ngày đã chọn:', this.currentDate);
  }
  // Lấy danh sách bệnh nhân
  async loadPatients() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Loading patients...',
    });
    await loading.present();
  
    this.patientService.getAllPatients().subscribe(
      (response) => {
        loading.dismiss();
        this.isLoading = false;
  
        if (response.success) {
          this.patients = response.data;
        } else {
          this.showAlert('Error', response.message || 'Failed to load patients.');
        }
      },
      (error) => {
        loading.dismiss();
        this.isLoading = false;
        console.error('Error fetching patients:', error);
        this.showAlert('Error', 'An error occurred while loading patients.');
      }
    );
  }

  // Lấy phòng khám và khung giờ dựa theo ngày đã chọn
  async loadClinicsAndTimeSlotsByDate() {
    if (!this.newAppointment.appointment_date) {
      this.presentAlert('Vui lòng chọn ngày.');
      return;
    }
  
    const loading = await this.loadingController.create({
      message: 'Đang tải phòng khám và khung giờ...'
    });
    await loading.present();
  
    console.log('Ngày được chọn:', this.newAppointment.appointment_date); // Kiểm tra giá trị ngày
  
    // Gọi API lấy danh sách phòng khám
    this.clinicService.getClinicsByDate(this.newAppointment.appointment_date).subscribe(
      (clinicResponse: any) => {
        if (clinicResponse.success) {
          this.clinics = clinicResponse.clinics;
        } else {
          this.presentAlert(clinicResponse.message || 'Không thể tải phòng khám.');
        }
      },
      async (error) => {
        await loading.dismiss();
        this.presentAlert('Không thể tải phòng khám.');
      }
    );
  
    // Gọi API lấy danh sách khung giờ theo ngày
    this.timeSlotService.getTimeSlotsByDate(this.newAppointment.appointment_date).subscribe(
      (timeSlotResponse: any) => {
        this.timeSlots = timeSlotResponse.timeSlots;
        loading.dismiss(); // Dismiss loading sau khi cả phòng khám và khung giờ đã tải xong
      },
      async (error) => {
        await loading.dismiss();
        this.presentAlert('Không thể tải khung giờ.');
      }
    );
  }
  

  // Tạo cuộc hẹn
  async createAppointment() {
    if (!this.newAppointment.patient_id || !this.newAppointment.clinic_id || !this.newAppointment.time_slot_id || !this.newAppointment.appointment_date) {
      this.presentAlert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Đang tạo cuộc hẹn...'
    });
    await loading.present();

    this.appointmentService.createAppointment(this.newAppointment).subscribe(
      async (response) => {
        await loading.dismiss();

        if (response.success) {
          this.presentAlert('Cuộc hẹn đã được tạo thành công!');
          this.newAppointment = { patient_id: null, clinic_id: null, time_slot_id: null, appointment_date: '' }; // Reset form
        } else {
          this.presentAlert(response.error);
        }
      },
      async (error) => {
        await loading.dismiss();
        this.presentAlert('Không thể tạo cuộc hẹn.');
      }
    );
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Thông báo',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
