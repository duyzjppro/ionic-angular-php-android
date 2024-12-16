import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  regForm: FormGroup;
  formData = {
    username: "",
    password: "",
    email: "",
    role: "",
  };

  constructor(private navCtrl: NavController, public formBuilder: FormBuilder, public modalController: ModalController, public loadingCtrl: LoadingController, public router: Router) {}

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['',
        [
          Validators.required,
          Validators.email,
          Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
        ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z]).{8,}")
        ]
      ]
    });
  }

  get errorControl() {
    return this.regForm.controls;
  }

  async create() {
    if (this.regForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Registering...',
      });
      await loading.present();

      this.formData.username = this.regForm.value.username;
      this.formData.password = this.regForm.value.password;
      this.formData.email = this.regForm.value.email;
      
      axios.post('http://localhost/medic1/backend/register.php', this.formData)
        .then(async (response) => {
          await loading.dismiss();
          console.log(response.data);
          if (response.data.success) {
            localStorage.setItem('user_id', response.data.user_id); // Lưu user_id vào localStorage
            this.modalController.dismiss();
          } else {
            alert(response.data.error || 'Registration failed');
          }
        })
        .catch(async (error) => {
          await loading.dismiss();
          console.log(error);
          alert('An error occurred. Please try again later.');
        });
    } else {
      console.log('Form is not valid');
    }
  }
}