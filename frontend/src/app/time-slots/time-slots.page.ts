import { Component, OnInit } from '@angular/core';
import { TimeSlotService } from '../services/time-slot.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.page.html',
  styleUrls: ['./time-slots.page.scss'],
})
export class TimeSlotsPage implements OnInit {
  timeSlots: any[] = [];
  selectedDate: string;
  newTime: string;
  isEditMode = false;
  editSlotId: number;

  constructor(
    private timeSlotService: TimeSlotService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  loadTimeSlots() {
    if (this.selectedDate) {
      this.timeSlotService.getTimeSlotsByDate(this.selectedDate).subscribe(
        (response: any) => {
          if (response.success) {
            this.timeSlots = response.timeSlots;
          } else {
            this.presentAlert('Failed to load time slots');
          }
        },
        (error) => {
          console.error('Failed to load time slots:', error);
          this.presentAlert('Failed to load time slots');
        }
      );
    }
  }
  
  createTimeSlot() {
    if (this.newTime && this.selectedDate) {
      const timeSlot = {
        time: this.newTime,
        date: this.selectedDate
      };

      this.timeSlotService.addTimeSlot(timeSlot).subscribe(
        (response: any) => {
          if (response.success) {
            this.presentAlert('Time Slot created successfully');
            this.loadTimeSlots();
          } else {
            this.presentAlert('Failed to create time slot');
          }
        },
        (error) => {
          console.error('Failed to create time slot:', error);
          this.presentAlert('Failed to create time slot');
        }
      );
    } else {
      this.presentAlert('Please enter a time and select a date');
    }
  }

  editTimeSlot(slot: any) {
    this.isEditMode = true;
    this.editSlotId = slot.id;
    this.newTime = slot.time;
  }

  updateTimeSlot() {
    const updatedSlot = {
      id: this.editSlotId,
      time: this.newTime,
      date: this.selectedDate
    };

    this.timeSlotService.updateTimeSlot(updatedSlot).subscribe(
      (response: any) => {
        if (response.success) {
          this.presentAlert('Time Slot updated successfully');
          this.isEditMode = false;
          this.newTime = '';
          this.editSlotId = null;
          this.loadTimeSlots();
        } else {
          this.presentAlert('Failed to update time slot');
        }
      },
      (error) => {
        console.error('Failed to update time slot:', error);
        this.presentAlert('Failed to update time slot');
      }
    );
  }

  deleteTimeSlot(id: number) {
    this.timeSlotService.deleteTimeSlot(id).subscribe(
      (response: any) => {
        if (response.success) {
          this.presentAlert('Time Slot deleted successfully');
          this.loadTimeSlots();
        } else {
          this.presentAlert('Failed to delete time slot');
        }
      },
      (error) => {
        console.error('Failed to delete time slot:', error);
        this.presentAlert('Failed to delete time slot');
      }
    );
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
