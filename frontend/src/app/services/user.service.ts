import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://x.x.x.x/medic1/backend'; // dùng IPv4 để có thể dễ dàng chuyển đổi sang android
  constructor(private http: HttpClient) { }
  getAllUsersDoctor(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_all_user.php`);
  }
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_user.php`).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        return throwError(error);
      })
    );
  }
  updateUser(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/update_user.php`, JSON.stringify(user), { headers }).pipe(
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(error);
      })
    );
}
deleteUser(userId: number): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.delete(`${this.baseUrl}/delete_user.php?id=${userId}`, { headers }).pipe(
    catchError((error) => {
      console.error('Error deleting user:', error);
      return throwError(error);
    })
  );
}
addUser(user: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.baseUrl}/add_user.php`, JSON.stringify(user), { headers }).pipe(
    catchError((error) => {
      console.error('Error adding user:', error);
      return throwError(error);
    })
  );
}

}
