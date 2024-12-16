import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-doctor-schedule',
  templateUrl: './doctor-schedule.page.html',
  styleUrls: ['./doctor-schedule.page.scss'],
})
export class DoctorSchedulePage implements OnInit {
  doctorId: number | null = null;
  doctorName: string = '';
  doctorSpecialty: string = '';
  doctorPhone: string = '';
  doctorImageUrl: string = '';
  shifts: any[] = [];
  selectedDate: string = new Date().toISOString(); // Giá trị ngày được chọn

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadDoctorInfo();
      // Chỉ cần tải thông tin bác sĩ một lần khi khởi tạo
  }

  // Giữ nguyên loadDoctorInfo() để lấy doctorId
  loadDoctorInfo() {
    const user = this.authService.getCurrentUser();
    if (user && user.id && user.role === 'doctor') {
      this.doctorService.getDoctorByUserId(user.id).subscribe(
        (response: any) => {
          if (response.doctor_id) {
            this.doctorId = response.doctor_id;
            this.doctorName = response.name;
            this.doctorSpecialty = response.specialty;
            this.doctorPhone = response.phone;
            this.doctorImageUrl = response.image_url;

            // Gọi loadDoctorShifts cho ngày hiện tại khi khởi tạo
            this.loadDoctorShifts();
          } else {
            console.error(response.error || 'Failed to load doctor info');
          }
        },
        (error) => {
          console.error('Error fetching doctor data:', error);
        }
      );
    } else {
      console.error('User not found or not a doctor');
      this.navCtrl.navigateRoot('/login');
    }
  }

  // Chỉ thay đổi loadDoctorShifts để dùng selectedDate
  loadDoctorShifts() {
    if (this.doctorId && this.selectedDate) {
      console.log('Fetching shifts for doctorId:', this.doctorId, 'and date:', this.selectedDate);
  
      this.doctorService.getShiftsByDoctorIdAndDate(this.doctorId, this.selectedDate).subscribe(
        (response: any) => {
          console.log('API Response for shifts:', response);
          if (response && response.shifts && Array.isArray(response.shifts)) {
            this.shifts = response.shifts;
            console.log('Shifts loaded:', this.shifts);
          } else {
            this.shifts = [];
            console.warn('No shifts found for this doctor on selected date');
          }
        },
        (error) => {
          console.error('Error fetching shifts data:', error);
        }
      );
    }
  }
  

  // Gọi loadDoctorShifts() khi chọn ngày mới
  onDateChange(event: any) {
    this.selectedDate = formatDate(event.detail.value, 'yyyy-MM-dd', 'en-US');  // Định dạng ngày
    console.log("Selected Date (formatted):", this.selectedDate);
    this.loadDoctorShifts();  // Gọi lại để lấy dữ liệu theo ngày
  }
}
