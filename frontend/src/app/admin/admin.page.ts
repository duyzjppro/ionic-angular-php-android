import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';  // Thêm AuthService
import { DoctorService } from '../services/doctor.service';  // Thêm DoctorService

register();

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  expandedSections: { [key: string]: boolean } = {};

  // Thêm biến để lưu thông tin bác sĩ
  doctorName: string = '';  
  doctorSpecialty: string = '';  
  doctorId: number | null = null;  

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private location: Location,
    private authService: AuthService,  // Thêm AuthService
    private doctorService: DoctorService  // Thêm DoctorService
  ) {}

  ngOnInit() {
    this.loadDoctorInfo();  // Thêm hàm loadDoctorInfo để tải dữ liệu bác sĩ
  }

  toggleSection(section: string) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  isSectionExpanded(section: string): boolean {
    return this.expandedSections[section];
  }

  // Thêm hàm để lấy thông tin bác sĩ dựa trên user_id
  loadDoctorInfo() {
    const user = this.authService.getCurrentUser();  // Lấy user hiện tại từ AuthService
    if (user && user.id) {
      this.doctorService.getDoctorByUserId(user.id).subscribe(
        (response: any) => {
          if (response && response.doctor_id) {
            // Gán thông tin bác sĩ vào các biến trong trang
            this.doctorId = response.doctor_id;
            this.doctorName = response.name;
            this.doctorSpecialty = response.specialty;
          } else {
            console.error('Không lấy được thông tin bác sĩ');
          }
        },
        (error) => {
          console.error('Lỗi khi lấy dữ liệu bác sĩ:', error);
        }
      );
    } else {
      console.error('Không có thông tin người dùng.');
      this.navCtrl.navigateRoot('/login');  // Điều hướng về trang đăng nhập nếu không có user
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/admin']).then(() => {
      window.location.reload(); // Tải lại trang khi điều hướng đến Dashboard
    });
  }

  closeView() {
    this.location.back(); 
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  swiperSlideChanged(e: any) {
    console.log('Slide changed: ', e);
  }

  toggleMenu() {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('open');
  }
}
