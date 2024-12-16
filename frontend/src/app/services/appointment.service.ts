import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private baseUrl = 'http://192.168.1.18/medic1/backend';

  constructor(private http: HttpClient) { }


  getAppointmentsByDate(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAppointmentsByDate.php?date=${date}`);
  }
  createAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create_appointment.php`, appointment);
  }
  getAppointmentsByClinicAndDate(clinicId: number, date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_appointments_by_clinic_and_date.php?clinic_id=${clinicId}&date=${date}`);
  }
  getAppointmentsByPatientId(patientId: number): Observable<any> {
    const id = Number(patientId); // Ensure it's a number
    return this.http.get(`${this.baseUrl}/get_appointments_by_patient.php?patient_id=${id}`);
  }
  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/deleteappointment.php`, { appointment_id: appointmentId });
  }
  
  
}