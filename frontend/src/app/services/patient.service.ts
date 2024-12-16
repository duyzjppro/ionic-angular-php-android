import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private baseUrl = 'http://x.x.x.x/medic1/backend'; // dùng IPv4 để có thể dễ dàng chuyển đổi sang android

  constructor(private http: HttpClient) { }

  getPatientByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getPatientByUserId.php?user_id=${userId}`);
  }
  getAllPatients(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_all_patients.php`);
  }
  updatePatient(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_patient.php`, formData);
  }
  getPatientById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_patient.php?id=${id}`);
  }
  createPatientProfile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/create_patient_profile.php`, formData);
  }
}