import { AppointmentService } from './../services/appointment.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ClinicService } from '../services/clinic.service';
import { NavController, AlertController, ToastController, MenuController } from '@ionic/angular';
import { PatientService } from '../services/patient.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { ModalController } from '@ionic/angular';
import { ManageAppointmentsPage } from '../manage-appointments/manage-appointments.page';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  isMenuOpen = false;
  patientId: number | null = null;
  username: string | null = '';
  notifications = [];
  showNotifications = false;
  unreadCount = 0; // Đếm số lượng thông báo chưa đọc

  constructor(
    private authService: AuthService,
    private clinicService: ClinicService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private patientService: PatientService,
    private notificationService: NotificationService,
    private toastController: ToastController,
    private router: Router,
    private modalController: ModalController,
    private menuCtrl: MenuController
  ) {}
  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }
  async openManageAppointments() {
    const modal = await this.modalController.create({
      component: ManageAppointmentsPage
    });
    return await modal.present();
  }
  swiperSlideChanged(e: any) {
    console.log('Slide changed: ', e);
  } 
 toggleMenu() {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('open');
  }
  ngOnInit() {
    this.username = this.authService.getUsername();

    if (this.username) {
      this.loadPatientInfo();
    }

    // Lắng nghe sự kiện thông báo mới từ NotificationService
    this.notificationService.notifications$.subscribe(
      (notifications) => {
        console.log('Received notifications:', notifications); // Log các thông báo nhận được
        this.notifications = notifications;
        this.unreadCount = notifications.length;
        this.showEmailNotification();
      }
    );
  }
  navigateTo(page: string) {
    this.menuCtrl.close(); // Đóng menu sau khi điều hướng
    this.navCtrl.navigateRoot(`/${page}`);
  }
  async showEmailNotification() {
    const toast = await this.toastController.create({
      message: 'You got email!',
      duration: 3000, // Thời gian hiển thị thông báo (ms)
      position: 'top', // Vị trí hiển thị của hộp thông báo
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  loadPatientInfo() {
    const user = this.authService.getCurrentUser();
    
    if (user && user.id) {
      this.patientService.getPatientByUserId(user.id).subscribe(
        (response: any) => {
          if (response.patient_id) {
            this.patientId = response.patient_id;  // Lưu patientId vào thuộc tính
            localStorage.setItem('patient_id', this.patientId.toString());
            this.loadNotifications(); 
          } else {
            this.router.navigate(['/profile-patient']);
          }
        },
        (error) => {
          this.presentAlert('Failed to load patient info');
          this.router.navigate(['/profile-patient']);
        }
      );
    } else {
      this.presentAlert('User not found in localStorage');
      this.router.navigate(['/landing']);
    }
  }
  
  loadNotifications() {
    const patientId = this.authService.getPatientId();
    if (patientId) {
      this.notificationService.getNotificationPatient(patientId).subscribe(
        (response: any) => {
          if (response.success && response.notifications.length > 0) {
            response.notifications.forEach((notification: any) => {
              // Kiểm tra xem `notification_id` có tồn tại
              console.log('Notification ID:', notification.notification_id); 
              
              // Thêm vào NotificationService, bao gồm `notification_id`
              this.notificationService.addNotification(notification);
            });
          } else if (response.success && response.notifications.length === 0) {
            console.log('No new notifications');
          } else {
            this.presentAlert('Hãy luôn kiểm tra thông báo');
          }
        },
        (error) => {
          this.presentAlert('Failed to load notifications');
        }
      );
    }
  }
  deleteNotification(notificationId: number) {
    this.notificationService.deleteNotification(notificationId).subscribe(response => {
      if (response.success) {
        // Hiển thị thông báo thành công nếu cần
        this.presentAlert('Notification deleted successfully');
      } else {
        this.presentAlert('Failed to delete notification');
      }
    });
  }
  
  
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;

    if (this.showNotifications) {
      this.unreadCount = 0; // Đặt lại số lượng chưa đọc khi người dùng xem thông báo
    }
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateRoot('/landing');
  }

  booking() {
    this.navCtrl.navigateRoot('/appointments');
  }
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  sendTestNotification() {
    const testMessage = { message: 'Test notification from client!' };
    this.notificationService.addNotification(testMessage);
  }
  
  login(){
    this.navCtrl.navigateRoot('/landing');

  }
  reload(){
    location.reload();

  }
  
}
