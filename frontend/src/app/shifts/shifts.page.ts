import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service'; 
import { ShiftService } from '../services/shift.service';
import { ClinicService } from '../services/clinic.service'; // Import the new service
import { LoadingController } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.page.html',
  styleUrls: ['./shifts.page.scss'],
})
export class ShiftsPage implements OnInit {
  shiftDate: string;
  shiftPeriod: string;
  doctorId: number;
  clinicId: number; // For selected clinic
  doctors: any[] = [];
  clinics: any[] = []; // For clinics
  shifts: any[] = [];
  editingShift: any = null;
  constructor(
    private doctorService: DoctorService,
    private shiftService: ShiftService,
    private clinicsService: ClinicService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadDoctors();
  }
  editShift(shift: any) {
    this.editingShift = { ...shift, shift_id: shift.id };
  }
  

  cancelEdit() {
    this.editingShift = null;
  }

  async updateShift() {
    const loading = await this.loadingCtrl.create({
      message: 'Đang cập nhật ca làm việc...',
    });
    await loading.present();

    this.shiftService.updateShift(this.editingShift).subscribe(
      async (response: any) => {
        loading.dismiss();
        if (response.success) {
          const toast = await this.toastController.create({
            message: 'Cập nhật ca làm việc thành công.',
            duration: 2000,
            color: 'success',
          });
          toast.present();
          this.editingShift = null; 
          this.getShiftByDay(); 
        } else {
          const toast = await this.toastController.create({
            message: 'Cập nhật thất bại: ' + (response.error || 'Unknown error'),
            duration: 2000,
            color: 'danger',
          });
          toast.present();
        }
      },
      async (error) => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'HTTP Error: ' + error.message,
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      }
    );
  }


  async confirmDeleteShift(shiftId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn xóa ca làm việc này không?',
      buttons: [
        {
          text: 'Hủy',
          role: 'cancel'
        },
        {
          text: 'Xóa',
          handler: () => {
            this.deleteShift(shiftId);
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  async deleteShift(shiftId: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Đang xóa ca làm việc...',
    });
    await loading.present();
  
    this.shiftService.deleteShift(shiftId).subscribe(
      async (response: any) => {
        loading.dismiss();
        if (response.success) {
          const toast = await this.toastController.create({
            message: 'Ca làm việc đã được xóa thành công.',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.getShiftByDay(); 
        } else {
          const toast = await this.toastController.create({
            message: 'Xóa ca làm việc thất bại: ' + (response.error || 'Unknown error'),
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        }
      },
      async (error) => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'HTTP Error: ' + error.message,
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    );
  }
  
  getShiftByDay() {
    if (this.shiftDate) {
      const formattedDate = this.shiftDate.split('T')[0]; 
      
      this.shiftService.getShiftsByDate(formattedDate).subscribe(
        (response: any) => {
          if (response.success) {
            this.shifts = response.shifts;
          } else {
            this.shifts = [];
          }
        },
        (error) => {
          console.error('Error fetching shifts:', error);
          this.shifts = [];
        }
      );
      this.loadClinics(formattedDate); 
    }
  }

  async loadClinics(date: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading clinics...',
    });
    await loading.present();

    this.clinicsService.getClinicsByDate(date).subscribe(
      (response: any) => {
        loading.dismiss();
        if (response.success) {
          this.clinics = response.clinics;
        } else {
          this.clinics = [];
        }
      },
      (error) => {
        loading.dismiss();
        console.error('Error fetching clinics:', error);
        this.clinics = [];
      }
    );
  }

  // Load all doctors
  async loadDoctors() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading doctors...',
    });
    await loading.present();
  
    this.doctorService.getAllDoctors().subscribe(
      (response: any) => {
        loading.dismiss();
        if (response.success) {
          this.doctors = response.data;
        } else {
          console.log('Error fetching doctors:', response.error);
        } 
      },
      (error) => {
        loading.dismiss();
        console.error('Error:', error);
      }
    );
  }

  async addShift() {
    const shiftData = {
      shift_date: this.shiftDate,
      shift_period: this.shiftPeriod,
      doctor_id: this.doctorId,
      clinic_id: this.clinicId
    };
  
    console.log('Shift Data being sent:', shiftData); 
  
    const loading = await this.loadingCtrl.create({
      message: 'Adding shift...',
    });
    await loading.present();
  
    this.shiftService.addShift(shiftData).subscribe(
      (response: any) => {
        loading.dismiss();
        if (response?.success) {
          console.log('Shift added successfully');
        } else {
          console.log('Error adding shift:', response?.error || 'Unknown error');
        }
      },
      (error) => {
        loading.dismiss();
        console.error('HTTP Error:', error);
      }
    );
  }
  
}
