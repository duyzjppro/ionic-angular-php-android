import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;

  constructor(private http: HttpClient, private platform: Platform) {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      // Chạy trên thiết bị hoặc emulator
      this.apiUrl = 'http://x.x.x.x/medic1/backend'; // dùng IPv4 để có thể dễ dàng chuyển đổi sang android
    } else {
      // Chạy trên trình duyệt (ionic serve)
      this.apiUrl = 'http://x.x.x.x/medic1/backend'; 
    }
  }
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ userName: username, password: password });

    return this.http.post<any>(`${this.apiUrl}/login.php`, body, { headers })
      .pipe(
        map(response => {
          if (response && !response.error) {
            console.log('Login response:', response); // Debugging line
            localStorage.setItem('user', JSON.stringify(response[0])); // Lưu thông tin người dùng dưới khóa `user`
            if (response[0].userName) {
              localStorage.setItem('username', response[0].userName); // Lưu riêng username nếu có
            }
            if (response[0].patient_id) {
              localStorage.setItem('patient_id', response[0].patient_id.toString()); // Lưu riêng patient_id nếu có
            }
          }
          return response;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
    localStorage.removeItem('patient_id');
    localStorage.removeItem('user');
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('user')!);
  }

  getUsername(): string | null {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user && user.userName) {
      console.log('Retrieved username:', user.userName); // Debugging line
      return user.userName;
    }
    return null;
  }

  getPatientId(): number | null {
    const patientId = localStorage.getItem('patient_id');
    return patientId ? Number(patientId) : null;
  }

  saveUserData(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserData() {
    return JSON.parse(localStorage.getItem('user'));
  } 

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}
