import { CreateAppointmentPage } from './../create-appointment/create-appointment.page';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'doctor-appointments',
        loadChildren: () => import('../doctor-appointments/doctor-appointments.module').then(m => m.DoctorAppointmentsPageModule)
      },
      {
        path: 'doctor',  // Route cho phần "View" của Doctors
        loadChildren: () => import('../doctor/doctor.module').then(m => m.DoctorPageModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },  
      {
        path: 'patient',
        loadChildren: () => import('../patient/patient.module').then(m => m.PatientPageModule)
      },
      {
        path: 'shifts',
        loadChildren: () => import('../shifts/shifts.module').then(m => m.ShiftsPageModule)
      },
      {
        path: 'create-doctor',
        loadChildren: () => import('../create-doctor/create-doctor.module').then(m => m.CreateDoctorPageModule)
      },
      {
        path: 'clinic-management',
        loadChildren: () => import('../clinic-management/clinic-management.module').then( m => m.ClinicManagementPageModule)
      },
      {
        path: 'clinics',
        loadChildren: () => import('../clinics/clinics.module').then( m => m.ClinicsPageModule)
      },
      {
        path: 'user',
        loadChildren: () => import('../user/user.module').then( m => m.UserPageModule)
      },
      {
        path: 'create-appointment',
        loadChildren: () => import('../create-appointment/create-appointment.module').then( m => m.CreateAppointmentPageModule)
      },
      {
        path: 'time-slots',
        loadChildren: () => import('../time-slots/time-slots.module').then( m => m.TimeSlotsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
