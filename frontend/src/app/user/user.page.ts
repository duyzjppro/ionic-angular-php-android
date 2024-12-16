import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  users = [];
  isLoading = true; // Thêm biến isLoading để hiển thị trạng thái tải

  constructor(
    private userService: UserService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true; // Bắt đầu tải
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.data;
        this.isLoading = false; // Kết thúc tải
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách người dùng:', error);
        this.isLoading = false;
        this.showAlert('Lỗi', 'Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      }
    });
  }
 async openEditUserModal(user) {
    const alert = await this.alertController.create({
      header: 'Cập nhật thông tin người dùng',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Tên người dùng',
          value: user.username
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email',
          value: user.email
        },
        {
          name: 'role',
          type: 'text',
          placeholder: 'Vai trò',
          value: user.role
        }
      ],
      buttons: [
        {
          text: 'Hủy',
          role: 'cancel'
        },
        {
          text: 'Lưu',
          handler: (data) => {
            this.updateUser(user.id, data);
          }
        }
      ]
    });

    await alert.present();
  }

  updateUser(id: number, updatedData: any) {
    const updatedUser = {
      id: id,
      username: updatedData.username,
      email: updatedData.email,
      role: updatedData.role
    };

    this.userService.updateUser(updatedUser).subscribe({
      next: (response) => {
        if (response.success) {
          this.showAlert('Thành công', 'Cập nhật người dùng thành công.');
          this.loadUsers();
        } else {
          this.showAlert('Lỗi', 'Không thể cập nhật người dùng.');
        }
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật người dùng:', error);
        this.showAlert('Lỗi', 'Đã xảy ra lỗi khi cập nhật người dùng.');
      }
    });
  }
  deleteUser(userId: number) {
    this.alertController.create({
      header: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa người dùng này?',
      buttons: [
        {
          text: 'Hủy',
          role: 'cancel'
        },
        {
          text: 'Xóa',
          handler: () => {
            this.userService.deleteUser(userId).subscribe({
              next: (response) => {
                if (response.success) {
                  this.showAlert('Thành công', 'Người dùng đã được xóa.');
                  this.loadUsers(); // Tải lại danh sách người dùng sau khi xóa
                } else {
                  this.showAlert('Lỗi', 'Không thể xóa người dùng.');
                }
              },
              error: (error) => {
                console.error('Lỗi khi xóa người dùng:', error);
                this.showAlert('Lỗi', 'Đã xảy ra lỗi khi xóa người dùng.');
              }
            });
          }
        }
      ]
    }).then(alert => alert.present());
  }
  async openAddUserModal() {
    const alert = await this.alertController.create({
      header: 'Thêm Người Dùng Mới',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Tên người dùng'
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Mật khẩu'
        },
        {
          name: 'role',
          type: 'text',
          placeholder: 'Vai trò (patient, doctor, admin)'
        }
      ],
      buttons: [
        {
          text: 'Hủy',
          role: 'cancel'
        },
        {
          text: 'Thêm',
          handler: (data) => {
            this.addUser(data);
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  addUser(userData: any) {
    this.userService.addUser(userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showAlert('Thành công', 'Người dùng đã được thêm.');
          this.loadUsers(); // Tải lại danh sách người dùng
        } else {
          this.showAlert('Lỗi', 'Không thể thêm người dùng.');
        }
      },
      error: (error) => {
        console.error('Lỗi khi thêm người dùng:', error);
        this.showAlert('Lỗi', 'Đã xảy ra lỗi khi thêm người dùng.');
      }
    });
  }
  
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
