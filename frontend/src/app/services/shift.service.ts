import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private baseUrl = 'http://x.x.x.x/medic1/backend'; // dùng IPv4 để có thể dễ dàng chuyển đổi sang android

  constructor(private http: HttpClient) { }

  getShifts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_shifts.php`);
  }

  getShiftsByDate(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_shifts_by_date.php?selectedDate=${date}`);
  }

  addShift(shift: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add_shift.php`, shift);
  }

  deleteShift(shiftId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete_shift.php`, { shift_id: shiftId });
  }
  getShiftsByDoctorIdAndDate(doctorId: number, date: string): Observable<any> {
    const url = `${this.baseUrl}/get_shifts.php?doctor_id=${doctorId}&selected_date=${date}`;
    console.log("Requesting shifts from URL:", url);  // Log URL để kiểm tra
    return this.http.get(url);
  }
  updateShift(shift: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_shift.php`, shift);
  }
  
}
