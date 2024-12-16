import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {
  private baseUrl = 'http://x.x.x.x/medic1/backend'; // dùng IPv4 để có thể dễ dàng chuyển đổi sang android

  constructor(private http: HttpClient) {}


  getTimeSlotsByDate(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_time.php?date=${date}`);
  }
  
  getTimeSlotsByDate1(date: string): Observable<any> {
    const url = `${this.baseUrl}/get_time_slots_by_date.php`;
    const formData = new FormData();
    formData.append('date', date);

    return this.http.post(url, formData);
  }
  addTimeSlot(date: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create_time.php`, date);
  }
  deleteTimeSlot(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete_time.php?id=${id}`);
  }
  updateTimeSlot(timeSlot: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update_time.php`, timeSlot);
  }
}
