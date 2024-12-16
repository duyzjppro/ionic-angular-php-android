import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
// code này không sử dụng

export class PollingService {
  private pollingUrl = 'http://x.x.x.x/medic1/backend/long_polling.php'; // dùng IPv4 để có thể dễ dàng chuyển đổi sang android
  constructor(private http: HttpClient) {}

  // Bắt đầu polling
  startPolling(): Observable<any> {
    return timer(0, 30000).pipe(  // Gửi yêu cầu mỗi 30 giây
      switchMap(() => this.http.get<any[]>(this.pollingUrl)),
      catchError(error => {
        console.error('Error during polling', error);
        return of([]);
      })
    );
  }
}
