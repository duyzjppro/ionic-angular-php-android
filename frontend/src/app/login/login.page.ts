import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  userName: string = '';
  password: string = '';
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private http: HttpClient,
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"),
        ],
      ],
    });
  }

  get errorControl() {
    return this.loginForm?.controls;
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Đang đăng nhập...',
    });
    await loading.present();

    this.authService.login(this.userName, this.password).subscribe(
      async (response: any) => {
        await loading.dismiss();
        if (!response.error) {
          console.log('Đăng nhập thành công');
          const user = {
            id: response[0].id,
            userName: response[0].userName,
            role: response[0].role,
            patient_id: response[0].patient_id || null,  // Save patient_id if available
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          const role = response[0].role;

        
  

          // đăng nhập dựa trên role
          if (role === 'admin') {
            this.navCtrl.navigateForward('/admin');
          } else if (role === 'doctor') {
            this.navCtrl.navigateForward('/admin');
          } else {
            this.navCtrl.navigateForward('/home');
          }

          this.modalController.dismiss();
        } else {
          console.log('Đăng nhập thất bại: ' + response.error);
        }
      },
      async (error) => {
        await loading.dismiss();
        console.log('Lỗi:', error);
      }
    );
  }
  
}
