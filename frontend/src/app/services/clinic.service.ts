import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private baseUrl = 'http://xxx.xxx.xxx.xxx/medic1/backend'; // dùng IPv4 để có thể dễ dàng chuyển đổi sang android
  constructor(private http: HttpClient) {}

  getClinicsByDate(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_clinics.php?creation_date=${date}`);
  }
  
  getAppointments(date: string, clinicName: string): Observable<any> {
    const url = `${this.baseUrl}/get_appointment.php?date=${date}&clinic_name=${clinicName}`;
    return this.http.get(url);
  }
  addClinic(clinic: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create_clinic.php`, clinic);
  }

  getAvailableDoctors(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_available_doctors.php?date=${date}`);
  }

  getAvailableAppointments(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_available_appointments.php?date=${date}`);
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete_appointment.php`, { appointment_id: appointmentId });
  }
  getNotifications(patientId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_notifications.php?patient_id=${patientId}`);
  }
  getClinicsByDate1(date: string): Observable<any> {
    const url = `${this.baseUrl}/get_clinics_by_date.php`;
    const formData = new FormData();
    formData.append('date', date);

    return this.http.post(url, formData);
  }
  deleteClinic(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete_clinic.php?id=${id}`);
  }
  updateClinic(id: number, clinic: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update_clinic.php?id=${id}`, clinic);
  }
}
