import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private baseUrl = 'http://x.x.x.x/medic1/backend'; // dùng IPv4 để có thể dễ dàng chuyển đổi sang android

  constructor(private http: HttpClient) { }

  getMedicalRecordsByPatientId(patientId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_medical_records.php?patient_id=${patientId}`);
  }
  

  uploadMedicalRecord(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload_medical_record.php`, data);
  }
 
  createmedical(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/medical_records.php`, data);
  }
  }
