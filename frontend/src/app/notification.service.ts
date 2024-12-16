import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<any[]>([]);
  notifications$ = this.notifications.asObservable();
  private baseUrl = 'http://x.x.x.x/medic1/backend';
  private pollingInterval = 60000; // Mỗi phút thực hiện polling một lần

  constructor(private http: HttpClient) {
    // Khởi động quá trình polling khi service được khởi tạo
    this.startPolling();
  }

  // Bắt đầu quá trình polling
  startPolling() {
    interval(this.pollingInterval)
      .pipe(
        switchMap(() => this.checkForUpcomingAppointments()),
        map(response => {
          if (response.success && response.notifications) {
            return response.notifications;
          }
          return [];
        }),
        catchError((error) => {
          console.error('Error during polling for upcoming appointments', error);
          return of([]);
        })
      )
      .subscribe(notifications => {
        // Cập nhật danh sách thông báo mới vào BehaviorSubject
        notifications.forEach(notification => this.addNotification(notification));
      });
  }

  checkForUpcomingAppointments() {
    const patientId = localStorage.getItem('patient_id');
    if (patientId) {
        const url = `${this.baseUrl}/check_upcoming_appointments.php?patient_id=${patientId}`;
        return this.http.get<any>(url).pipe(
            map(response => {
                // Đảm bảo phản hồi có cấu trúc mong đợi
                if (response && typeof response === 'object' && 'success' in response) {
                    console.log('API Response: ', response);
                    return response;
                } else {
                    throw new Error('Invalid response format');
                }
            }),
            catchError((error) => {
                console.error('Error fetching upcoming appointments', error);
                return of({ success: false, notifications: [] });
            })
        );
    }
    return of({ success: false, notifications: [] });
}


  // Thêm một thông báo mới vào danh sách
  addNotification(notification: any) {
    const currentNotifications = this.notifications.value;
    const newNotifications = [...currentNotifications, notification];
    this.notifications.next(newNotifications);
  }

  // Lấy tất cả thông báo cho bệnh nhân
  getNotificationPatient(patientId: number) {
    return this.http.get<any>(`${this.baseUrl}/get_notifications.php?patient_id=${patientId}`).pipe(
      catchError((error) => {
        console.error('Error fetching patient notifications', error);
        return of([]); // Trả về mảng rỗng nếu gặp lỗi.
      })
    );
  }
  
  deleteNotification(notificationId: number): Observable<any> {
    const url = `${this.baseUrl}/delete_notification.php`;
    return this.http.post(url, { notification_id: notificationId }).pipe(
      map(response => {
        if (response && response['success']) {
          // Nếu xóa thành công, xóa thông báo khỏi BehaviorSubject
          const currentNotifications = this.notifications.value.filter(
            notification => notification.id !== notificationId
          );
          this.notifications.next(currentNotifications);
        }
        return response;
      }),
      catchError(error => {
        console.error('Error deleting notification', error);
        return of({ success: false });
      })
    );
  }
  
}
