import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseUrl = 'http://x.x.x.x/medic1/backend';// dùng IPv4 để có thể dễ dàng chuyển đổi sang android

  constructor(private http: HttpClient) { }


  deleteDoctor(doctorId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete_doctor.php?id=${doctorId}`);
  }
  
  getAllDoctors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_all_doctors.php`);
  }

  getDoctorById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_doctor.php?id=${id}`);
  }

  updateDoctor(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_doctor.php`, formData);
  }
  addDoctor(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/create_doctor.php`, data);
  }
  getDoctorByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDoctorByUserId.php?user_id=${userId}`);
  }
  getShiftsByDoctorId(doctorId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDoctorShifts.php?doctor_id=${doctorId}`);
  }
  getShiftsByDoctorIdAndDate(doctorId: number, date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_shifts.php?doctor_id=${doctorId}&selected_date=${date}`);
  }
}
