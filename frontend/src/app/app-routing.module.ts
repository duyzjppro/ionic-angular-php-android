import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then( m => m.LandingPageModule)
  },

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'doctor',
    loadChildren: () => import('./doctor/doctor.module').then( m => m.DoctorPageModule)
  },
  {
    path: 'appointments',
    loadChildren: () => import('./appointments/appointments.module').then( m => m.AppointmentsPageModule)
  },
  {
    path: 'doctor-appointments',
    loadChildren: () => import('./doctor-appointments/doctor-appointments.module').then( m => m.DoctorAppointmentsPageModule)
  },
  {
    path: 'clinic-management',
    loadChildren: () => import('./clinic-management/clinic-management.module').then( m => m.ClinicManagementPageModule)
  },
  {
    path: 'clinics',
    loadChildren: () => import('./clinics/clinics.module').then( m => m.ClinicsPageModule)
  },
  {
    path: 'shifts',
    loadChildren: () => import('./shifts/shifts.module').then( m => m.ShiftsPageModule)
  },
  {
    path: 'patient',
    loadChildren: () => import('./patient/patient.module').then( m => m.PatientPageModule)
  },
  {
    path: 'edit-doctor/:id',  // Thêm :id để nhận ID từ URL
    loadChildren: () => import('./edit-doctor/edit-doctor.module').then( m => m.EditDoctorPageModule)
  },
  {
    path: 'create-doctor',
    loadChildren: () => import('./create-doctor/create-doctor.module').then( m => m.CreateDoctorPageModule)
  },
  {
    path: 'edit-patient/:id',
    loadChildren: () => import('./edit-patient/edit-patient.module').then( m => m.EditPatientPageModule)
  },
  {
    path: 'profile-patient',
    loadChildren: () => import('./profile-patient/profile-patient.module').then( m => m.ProfilePatientPageModule)
  },
  {
    path: 'time-slots',
    loadChildren: () => import('./time-slots/time-slots.module').then( m => m.TimeSlotsPageModule)
  },
  {
    path: 'create-appointment',
    loadChildren: () => import('./create-appointment/create-appointment.module').then( m => m.CreateAppointmentPageModule)
  },
  {
    path: 'manage-appointments',
    loadChildren: () => import('./manage-appointments/manage-appointments.module').then( m => m.ManageAppointmentsPageModule)
  },
  {
    path: 'doctor-schedule/:id',
    loadChildren: () => import('./doctor-schedule/doctor-schedule.module').then( m => m.DoctorSchedulePageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'medical-records/:patientId',
    loadChildren: () => import('./medical-records/medical-records.module').then( m => m.MedicalRecordsPageModule)
  },
  {
    path: 'view-medical-records/:patientId',
    loadChildren: () => import('./view-medical-records/view-medical-records.module').then(m => m.ViewMedicalRecordsPageModule)
  }
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
